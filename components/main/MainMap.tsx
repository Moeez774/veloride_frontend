'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAuth } from '@/context/AuthProvider'
import socket from '@/utils/socket'
import { X } from 'lucide-react'

interface Details {
    setShowMap: Dispatch<SetStateAction<boolean>>
}

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

const MainMap: React.FC<Details> = ({ setShowMap }) => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers || null

    useEffect(() => {
        if (!userLocation) return;

        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: userLocation,
            zoom: 14
        });

        mapInstance.addControl(new mapboxgl.NavigationControl());

        // Add a red marker for user's location
        const userMarker = new mapboxgl.Marker({ color: "red" })
            .setLngLat(userLocation)
            .setPopup(new mapboxgl.Popup().setHTML("<h3>You are here!</h3>"))
            .addTo(mapInstance);

        setMap(mapInstance)
        setUserMarker(userMarker)

        // for detecting user's location in realtime
        const watcherId = navigator.geolocation.watchPosition(position => {
            const { longitude, latitude } = position.coords

            userMarker.setLngLat([longitude, latitude])
        }, err => console.log(err),
            {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 0
            }
        )

        return () => {
            mapInstance.remove()
            navigator.geolocation.clearWatch(watcherId);
        }
    }, [])

    // showing drivers location on map
    useEffect(() => {
        if (!map || drivers?.length === 0) return

        drivers?.forEach(driver => {
            const { userId, location } = driver
            // Add a greeb marker for driver's location
            if (markers[userId]) {
                const driver = markers[userId]
                const updated = driver.setLngLat(location)
                setMarkers(prev => ({ ...prev, [userId]: updated }))
            }
            else {
                const driverMarker = new mapboxgl.Marker({ color: "green" })
                    .setLngLat(location)
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>Driver: ${userId}</h3>`))
                    .addTo(map);
                setMarkers(prev => ({ ...prev, [userId]: driverMarker }))
            }
        })
    }, [drivers, map])

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
            <div className={`fixed bg-[#fefefe] left-0 top-0 w-screen flex justify-center items-center z-[100] h-screen`}>
                <div className='absolute top-0 p-6 left-0 z-[100]'>
                    <div className='p-2.5 cursor-pointer transition-all duration-200 hover:bg-[#fefefead] rounded-full bg-[#fefefe]' onClick={() => setShowMap(false)}>
                        <X size={22} color='#202020' />
                    </div>
                </div>
                <div id="map" className={`w-full h-full z-[50]`} />

                {!userLocation && <p className='loader'></p>}
            </div>
        </>
    )
}

export default MainMap
