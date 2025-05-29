'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const user = authContext?.user || null
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers || null

    useEffect(() => {
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")
        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

        const location: [number, number] = userLocation && userLocation.length === 2
            ? [userLocation[0], userLocation[1]]
            : [currLocation[0], currLocation[1]]

        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: toggleTheme ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v11',
            center: location,
            zoom: 14
        })

        mapInstance.resize()
        mapInstance.addControl(new mapboxgl.NavigationControl());
        const blueDot = document.createElement('div')
        blueDot.className = 'user-location-dot'

        // Add a red marker for user's location
        const userMarker = new mapboxgl.Marker({
            element: blueDot
        })
            .setLngLat(location)
            .addTo(mapInstance)

        setMap(mapInstance)
        setUserMarker(userMarker)

        // for detecting user's location in realtime
        const watcherId = navigator.geolocation.watchPosition(position => {
            const { longitude, latitude } = position.coords

            userMarker.setLngLat([longitude, latitude])
            localStorage.setItem('long', longitude.toString())
            localStorage.setItem('lat', latitude.toString())
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
    }, [toggleTheme])

    //for changing drivers location in realtime
    useEffect(() => {
        if (!map || !drivers || drivers.length === 0 || !user) return

        const newMarkers: Record<string, mapboxgl.Marker> = {}

        drivers.forEach(driver => {
            const { userId, location } = driver

            if (userId === user?._id) {
                return
            }

            if (markers[userId]) {
                const existingMarker = markers[userId]
                existingMarker.setLngLat(location)
                newMarkers[userId] = existingMarker
            } else {
                const el = document.createElement('div')
                el.className = 'driver-location-dot'

                const marker = new mapboxgl.Marker({ element: el })
                    .setLngLat(location)
                    .addTo(map)

                newMarkers[userId] = marker
            }
        })

        Object.keys(markers).forEach(userId => {
            if (!newMarkers[userId]) {
                markers[userId].remove()
            }
        })

        setMarkers(newMarkers)
    }, [drivers, user])

    // for updating drivers markers on theme change
    useEffect(() => {
        if (!map || !drivers || drivers.length === 0 || !user) return

        Object.values(markers).forEach(marker => marker.remove())

        const newMarkers: Record<string, mapboxgl.Marker> = {}

        drivers.forEach(driver => {
            const { userId, location } = driver

            if (userId === user?._id) {
                return
            }
            const el = document.createElement('div')
            el.className = 'driver-location-dot'

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat(location)
                .addTo(map)


            newMarkers[userId] = marker
        })

        setMarkers(newMarkers)
    }, [map, user])

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
