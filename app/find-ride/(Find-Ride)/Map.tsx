'use client'
import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import "swiper/css"
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client';
import 'mapbox-gl/dist/mapbox-gl.css'
import socket from '@/utils/socket'
import '@/app/(HomePage)/Main.css'
import { fetchEta } from '@/functions/function'

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

interface Driver {
    userId: string;
    location: [number, number];
}

interface MatchedRides {
    rides: Array<{
        userId: string;
    }>;
}

const Map = ({ matchedRides, driversTime, setDriversTime, currentDriver }: { matchedRides: MatchedRides, driversTime: Record<string, string>, setDriversTime: Dispatch<SetStateAction<Record<string, string>>>, currentDriver: string }) => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const [avgTime, setAvgTime] = useState<number>(0)
    const authContext = useAuth()
    const [foundDrivers, setFoundDrivers] = useState<any>([])
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers as Driver[] || null
    const user = authContext?.user || null
    const setUserLocation = authContext?.setUserLocation

    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    useEffect(() => {

        if (!drivers || drivers.length === 0 || !matchedRides) return

        const avlDrivers = drivers.filter((driver: Driver) => {
            return matchedRides.rides.some((ride) => ride.userId === driver.userId)
        })

        setFoundDrivers(avlDrivers)

    }, [drivers, matchedRides])

    useEffect(() => {
        if (!map) return
        setMap(map.setStyle(`mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`))
    }, [toggleTheme])

    useEffect(() => {
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")

        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

        const location: [number, number] = userLocation && userLocation.length === 2
            ? [userLocation[0], userLocation[1]]
            : [currLocation[0], currLocation[1]]

        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: `mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`,
            center: location,
            zoom: 14.5
        })

        mapInstance.resize()
        mapInstance.addControl(new mapboxgl.NavigationControl())

        const blueDot = document.createElement('div')
        blueDot.className = 'user-location-dot'

        const marker = new mapboxgl.Marker({
            element: blueDot
        })
            .setLngLat(location)
            .addTo(mapInstance)

        setMap(mapInstance)
        setUserMarker(marker)

        const watcherId = navigator.geolocation.watchPosition(
            (position) => {
                const { longitude, latitude } = position.coords
                userMarker?.setLngLat([longitude, latitude])
                if (setUserLocation) setUserLocation([longitude, latitude])
                localStorage.setItem('long', longitude.toString())
                localStorage.setItem('lat', latitude.toString())
            },
            (err) => console.error(err),
            {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 0
            }
        )

        return () => {
            mapInstance.remove()
            navigator.geolocation.clearWatch(watcherId)
        }
    }, [])

    //for changing drivers location in realtime
    useEffect(() => {
        if (!map || !drivers || drivers.length === 0 || !user || foundDrivers.length === 0) return

        const newMarkers: Record<string, mapboxgl.Marker> = {}

        foundDrivers.forEach((driver: Driver) => {
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

                el.addEventListener('click', () => {
                    if (map) {
                        map.flyTo({
                            center: location,
                            zoom: 14.5
                        })
                    }
                })

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
    }, [drivers, user, map])

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

    useEffect(() => {
        if (!drivers || drivers.length === 0 || !matchedRides) return

        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")

        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

        const foundDrivers = drivers.filter((driver: Driver) => {
            return matchedRides.rides.some((ride) => ride.userId === driver.userId)
        })

        const sources = foundDrivers.map((driver) => [driver.location[0], driver.location[1]])
        const targets = [currLocation]

        fetchEta({ sources, targets, setAvgTime, setDriversTime, drivers })

    }, [drivers])

    useEffect(() => {
        if (currentDriver === '' || !drivers || drivers.length === 0 || !matchedRides) return

        const foundDrivers = drivers.filter((driver: Driver) => {
            return matchedRides.rides.some((ride) => ride.userId === driver.userId)
        })

        foundDrivers.forEach((driver: Driver) => {
            const { userId, location } = driver

            if (userId === currentDriver) {
                if (map) {
                    map.flyTo({
                        center: location,
                        zoom: 14.5
                    })
                }
            }
        })
    }, [currentDriver])

    return (
        <div className={`inter flex flex-col gap-6 w-full mx-auto ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
            <div className={`relative flex justify-center w-full overflow-x-hidden items-center`}>
                <div id="map" className={`w-full h-[50em]`} />
            </div>
        </div>
    )
}

export default Map