'use client'
import { url } from '@/components/hooks/useHooks/useWallet';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, User } from './AuthProvider';
import socket from '@/utils/socket';

interface RideState {
    userId: string,
    photo: string,
    bookedSeats: number,
    paying: number,
    luggage: boolean,
    pet: boolean,
    smoking: boolean
}

export interface Notification {
    _id: string,
    message: string,
    userId: string,
    is_read: boolean,
    reference_url: string,
    type: string,
    createdAt: string,
    updatedAt: string
}

interface RideContextType {
    rideState: RideState;
    setRideState: React.Dispatch<React.SetStateAction<RideState>>;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    allUsers: any[];
    setAllUsers: React.Dispatch<React.SetStateAction<any[]>>;
    searchedUser: any;
    setSearchedUser: React.Dispatch<React.SetStateAction<any>>;
}

const defaultRideState: RideState = {
    userId: '',
    photo: '',
    bookedSeats: 0,
    paying: 0,
    luggage: false,
    pet: false,
    smoking: false
};

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rideState, setRideState] = useState<RideState>(defaultRideState);
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [allUsers, setAllUsers] = useState<any[]>([])
    const [searchedUser, setSearchedUser] = useState<any>('')
    const authContext = useAuth()
    const user = authContext?.user as User | null

    //fethcing notifications from the server
    useEffect(() => {
        const fetchNotifications = async () => {

            try {
                const res = await fetch(`${url}/notifications`, {
                    method: "GET",
                    credentials: "include"
                })

                const data = await res.json()

                if (res.ok) {
                    setNotifications(data.notifications)
                }
                else {
                    console.log(data.message)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchNotifications()
    }, [user?._id])

    useEffect(() => {
        if (!user) return

        const addStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets/add-monthly-updates`, {
                    method: "GET",
                    credentials: "include",
                })

                const data = await res.json()

            } catch (err) {
                console.log(err)
            }
        }

        addStats()
    }, [user])

    useEffect(() => {
        if (!user) return

        if (user?.activeRides.length > 0) {
            user?.activeRides.forEach((ride: any) => {
                socket.emit('join-ride', ride)
            })
        }

        if (user?.ownedRides.length > 0) {
            user?.ownedRides.forEach((ride: any) => {
                socket.emit('join-ride', ride)
            })
        }

        socket.on('ride-updated-by-driver', ({ ride, rideId, notificationsForPassengers }: { ride: any, rideId: string, notificationsForPassengers: any }) => {
            const isFound = user.activeRides.find((ride) => ride === rideId)
            if (isFound) {
                const notification = notificationsForPassengers.find((noti: any) => noti.userId === user?._id)
                setNotifications(prev => [notification, ...prev])
            }
        })

        socket.on('passenger-declined', ({ ride, notificationForPassenger }: { ride: any, notificationForPassenger: any }) => {
            const isFound = user.activeRides.find((r) => r === ride._id)
            if (isFound) {
                setNotifications(prev => [notificationForPassenger, ...prev])
            }
        })

        socket.on('ride-joined', ({ ride, notificationForDriver }) => {
            if (ride.userId === user?._id) {
                setNotifications(prev => [notificationForDriver, ...prev])
            }
        })

        socket.on('ride-cancelled', ({ ride, notificationForDriver }) => {
            if (user?._id === ride.userId) {
                setNotifications(prev => [notificationForDriver, ...prev])
            }
        })

        socket.on('global-passenger-dropped-off', ({ rideId, passengerId, ride, notification }) => {
            if (passengerId === user?._id) {
                setNotifications(prev => [notification, ...prev])
            }
        })

        return () => {
            socket.off('ride-joined')
            socket.off('global-passenger-dropped-off')
            socket.off('ride-cancelled')
            socket.off('ride-updated-by-driver')
            socket.off('passenger-declined')
        }
    }, [user])

    const fetchAllUsers = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/all-users?search=${searchedUser}`, {
                method: "GET",
                credentials: "include"
            })

            const data = await res.json()

            if (res.ok) {
                setAllUsers(data.users)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [searchedUser])

    return (
        <RideContext.Provider value={{ rideState, setRideState, notifications, setNotifications, allUsers, setAllUsers, searchedUser, setSearchedUser }}>
            {children}
        </RideContext.Provider>
    );
};

export const useRide = () => {
    const context = useContext(RideContext);
    if (context === undefined) {
        throw new Error('useRide must be used within a RideProvider');
    }
    return context;
};