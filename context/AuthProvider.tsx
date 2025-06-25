'use client'
import socket from "@/utils/socket";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export interface User {
  ownedRides: any;
  _id: string | null;
  fullname: string | null;
  email: string | null;
  pass: string | null;
  number: string | null;
  city: string | null;
  photo: string | null;
  role: string | null;
  isProvider: boolean;
  contacts: any[];
  rating: number;
  gender: string | null;
  activeRides: string[],
  car_details: {
    brand: string | null;
    model: string | null;
    color: string | null;
    avg_available_seats: number | null;
  },
  reviews: any[],
  createdAt: Date | null;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => void,
  userLocation: [number, number] | null,
  drivers: any[],
  setUserLocation: Dispatch<SetStateAction<[number, number] | null>>,
  setDrivers: Dispatch<SetStateAction<any[]>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  //collecting all riders
  const [drivers, setDrivers] = useState<any[]>([])

  const fetchUser = async () => {
    let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user-data`, {
      method: 'GET',
      credentials: 'include'
    })

    let response = await a.json()
    if (response.statusCode === 200) {
      setUser(response.data)
    }
  }

  useEffect(() => {
    fetchUser()

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        localStorage.setItem('long', longitude.toString());
        localStorage.setItem('lat', latitude.toString());
      },
      (error) => {
        console.error("Error getting initial position:", error);
        alert("Unable to retrieve your location.");
      }
    )

    const watcherId = navigator.geolocation.watchPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setUserLocation([longitude, latitude]);
        localStorage.setItem('long', longitude.toString())
        localStorage.setItem('lat', latitude.toString())

        socket.emit("driverMoved", { userId: user?._id, location: [longitude, latitude] });

        //for tracking passengers movement on driver movement
        socket.emit("passengerMoved", { userId: user?._id, location: [longitude, latitude] });
      },
      (error) => {
        console.error("Error watching position:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watcherId);
      socket.off("driverMoved")
      socket.off("passengerMoved")
    }
  }, [user?._id, drivers]);

  // for checking user own any drive or not
  const checkRide = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/check-user-ride`, {
        method: "GET",
        credentials: 'include'
      })

      const data = await response.json()
      if (data.statusCode === 200) {
        socket.emit("avl.driver", { userId: user?._id, location: userLocation })
      }
    } catch (error) {
      console.error("Error checking ride:", error)
    }
  }

  useEffect(() => {
    const handleRequest = () => checkRide()

    const handleAvailableDrivers = ({ userId, location }: { userId: string, location: [number, number] }) => {
      if (setDrivers) {
        setDrivers((prev) => {
          const exists = prev.some(driver => driver.userId === userId);
          if (!exists) return [...prev, { userId, location }]
          return prev;
        })
      }
    }

    socket.on('userRequest', handleRequest)
    socket.on('get-join-passengers', ({ userId, rideId }) => {
      const _id = localStorage.getItem('_id')
      if (userId === _id && userLocation) {
        socket.emit('provide-location', { location: userLocation, rideId, userId: _id })
      }
    })

    socket.on("available_drivers", handleAvailableDrivers)

    socket.on("driverLocationChanged", ({ userId, location }: { userId: string, location: [number, number] }) => {
      if (drivers.length > 0) {
        const updatedDrivers = drivers.map(driver => {
          if (driver.userId === userId) {
            return { ...driver, location }
          }
          return driver
        })
        setDrivers(updatedDrivers)
      }
    })

    return () => {
      socket.off('join-passengers')
      socket.off('userRequest', handleRequest)
      socket.off("available_drivers", handleAvailableDrivers);
      socket.off("driverLocationChanged");

    }
  }, [userLocation])

  return <AuthContext.Provider value={{ user, setUser, fetchUser, userLocation, setUserLocation, drivers, setDrivers }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
