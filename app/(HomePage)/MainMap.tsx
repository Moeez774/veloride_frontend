'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAuth } from '@/context/AuthProvider'
import socket from '@/utils/socket'
import { X } from 'lucide-react'
import { getContacts } from '@/context/ContactsProvider'
interface Details {
    setShowMap: Dispatch<SetStateAction<boolean>>
}
mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

export const toggleTheme = () => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    return toggleTheme
}

const MainMap: React.FC<Details> = ({ setShowMap }) => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const user = authContext?.user || null
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers || null
    const hasCenteredRef = useRef(false)
    const lastPositionRef = useRef<[number, number] | null>(null)
    const lastUpdateTimeRef = useRef<number>(0)

    // Add position smoothing function
    const smoothPosition = (newPosition: [number, number]): [number, number] => {
        const now = Date.now()
        const timeDiff = now - lastUpdateTimeRef.current

        if (!lastPositionRef.current || timeDiff > 1000) {
            lastPositionRef.current = newPosition
            lastUpdateTimeRef.current = now
            return newPosition
        }

        const [lastLng, lastLat] = lastPositionRef.current
        const [newLng, newLat] = newPosition
        const distance = Math.sqrt(
            Math.pow(newLng - lastLng, 2) + Math.pow(newLat - lastLat, 2)
        )

        if (distance > 0.0001) {
            lastPositionRef.current = newPosition
            lastUpdateTimeRef.current = now
            return newPosition
        }

        const smoothingFactor = 0.3
        const smoothedLng = lastLng + (newLng - lastLng) * smoothingFactor
        const smoothedLat = lastLat + (newLat - lastLat) * smoothingFactor

        lastPositionRef.current = [smoothedLng, smoothedLat]
        lastUpdateTimeRef.current = now
        return [smoothedLng, smoothedLat]
    }

    useEffect(() => {
        if (!map) return
        setMap(map.setStyle(`mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`))
    }, [toggleTheme])

    useEffect(() => {
        if (!userLocation || !map || !userMarker || hasCenteredRef.current) return
        setMap(map?.setCenter(userLocation))
        setUserMarker(userMarker?.setLngLat(userLocation))
        hasCenteredRef.current = true
    }, [userLocation, map, userMarker])

    useEffect(() => {
        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: `mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`,
            center: [0, 0],
            zoom: 14.5
        })

        mapInstance.resize()
        mapInstance.addControl(new mapboxgl.NavigationControl())

        const blueDot = document.createElement('div')
        blueDot.className = 'user-location-dot'

        const marker = new mapboxgl.Marker({
            element: blueDot
        })
            .setLngLat([0, 0])
            .addTo(mapInstance)

        setMap(mapInstance)
        setUserMarker(marker)

        return () => {
            mapInstance.remove()
        }
    }, [])

    useEffect(() => {
        if (!userLocation || !userMarker || !map) return

        const smoothedPosition = smoothPosition(userLocation)
        userMarker.setLngLat(smoothedPosition)
        if (!hasCenteredRef.current) {
            map.setCenter(smoothedPosition)
            hasCenteredRef.current = true
        }
    }, [userLocation, userMarker, map])

    //for changing drivers location in realtime
    useEffect(() => {
        if (!map || !drivers || drivers.length === 0) return

        const existingUserIds = new Set(drivers ? Object.keys(drivers) : []);

        if (drivers) {
            Object.entries(drivers).forEach(([userId, location]) => {
                if (!location || !Array.isArray(location) || location.length !== 2) return;

                if (markersRef.current[userId]) {
                    markersRef.current[userId].setLngLat(location as [number, number]);
                } else {
                    const el = document.createElement('div');
                    el.className = 'driver-location-dot';
                    const marker = new mapboxgl.Marker({ element: el })
                        .setLngLat(location as [number, number])
                        .addTo(map)

                    markersRef.current[userId] = marker;
                }
            });
        }

        Object.keys(markersRef.current).forEach((userId) => {
            if (!existingUserIds.has(userId)) {
                markersRef.current[userId].remove();
                delete markersRef.current[userId];
            }
        });
    }, [drivers, map])

    useEffect(() => {
        console.log("drivers", drivers)
    }, [drivers])

    // for checking socket is connected or not becuase without it , it will run too early and will not execute
    useEffect(() => {
        if (socket.connected) {
            socket.emit('request', "User wants drivers location.")
        } else {
            socket.on('connect', () => {
                socket.emit('request', "User wants drivers location.")
            })
        }
    }, [])

    return (
        <>
            <div className={`fixed left-0 top-0 w-screen flex justify-center items-center z-[200] h-screen`}>
                <div className='absolute top-0 p-6 left-0 z-[100]'>
                    <div className='p-2.5 cursor-pointer transition-all duration-200 hover:bg-[#fefefead] rounded-full bg-[#fefefe]' onClick={() => setShowMap(false)}>
                        <X size={22} color='#202020' />
                    </div>
                </div>
                <div id="map" className={`w-full h-full z-[50]`} />
            </div>
        </>
    )
}

export default MainMap
