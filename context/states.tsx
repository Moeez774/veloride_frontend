'use client'
import { url } from '@/components/hooks/useHooks/useWallet';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    }, [])

    return (
        <RideContext.Provider value={{ rideState, setRideState, notifications, setNotifications }}>
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