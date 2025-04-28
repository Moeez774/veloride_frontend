'use client'
import socket from "@/utils/socket";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export interface User {
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
    let a = await fetch('http://localhost:4000/users/user-data', {
      method: 'GET',
      credentials: 'include'
    })

    let response = await a.json()
    if (response.statusCode === 200) {
      setUser(response.data)
    }
  }

  // for fetching user's data on render and also driver's movement
  useEffect(() => {
    fetchUser()

    const watcherId = navigator.geolocation.watchPosition(position => {
      const { longitude, latitude } = position.coords

      setUserLocation([longitude, latitude])
      localStorage.setItem('long', longitude.toString())
      localStorage.setItem('lat', latitude.toString())

      const isDriver = drivers.some(driver => driver.userId === user?._id)
      if (isDriver) {
        socket.emit("driverMoved", { userId: user?._id, location: [longitude, latitude] })
      }
    })

    // detecting any driver's movement and changing its coordinates
    socket.on("driverLocationChanged", (data) => {
      const updatedData = drivers.map(driver => {
        return driver.userId === data.userId ? { ...driver, location: data.location } : driver
      })

      setDrivers(updatedData)
    })

    return () => {
      socket.off("driverLocationChanged")
      navigator.geolocation.clearWatch(watcherId)
    }
  }, [])

  // for checking user own any drive or not
  const checkRide = async () => {
    try {
      const response = await fetch('http://localhost:4000/rides/check-user-ride', {
        method: "GET",
        credentials: 'include'
      })

      const data = await response.json()
      if (data.statusCode === 200) {
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")
        const currLocation = [long? parseFloat(long) : 0, lat? parseFloat(lat): 0]
        const userInfo = {
          userId: data.data.userId,
          location: currLocation,
        }
        socket.emit("avl.driver", userInfo)
      }
    } catch (error) {
      console.error("Error checking ride:", error)
    }
  }

  // for getting and detetcing real time location
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        localStorage.setItem('long', longitude.toString());
      localStorage.setItem('lat', latitude.toString());
      },
      () => {
        alert("Unable to retrieve your location.");
      }
    )
  }, [])

  // for checking user is driver and if it is then sending user's location to all
  useEffect(() => {

    const handleRequest = () => checkRide()

    const handleAvailableDrivers = (data: any) => {
      if (setDrivers) {
        setDrivers((prev) => {
          const exists = prev.some(driver => driver.userId === data.userId);
          if (!exists) return [...prev, data]
          return prev;
        })
      }
    }

    socket.on('userRequest', handleRequest)
    socket.on("available_drivers", handleAvailableDrivers);

    return () => {
      socket.off('userRequest', handleRequest)
      socket.off("available_drivers", handleAvailableDrivers);
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser, fetchUser, userLocation, setUserLocation, drivers, setDrivers }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
