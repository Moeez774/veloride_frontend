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
    const hasCenteredRef = useRef(false)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const mapContainerRef = useRef<HTMLDivElement>(null)

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
        if (!userLocation || !map || !userMarker || hasCenteredRef.current) return
        setMap(map?.setCenter(userLocation))
        setUserMarker(userMarker?.setLngLat(userLocation))
        hasCenteredRef.current = true
    }, [userLocation, map, userMarker])

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: `mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`,
            center: [0, 0],
            zoom: 14.5
        })

        // Handle window resize to ensure map fills container properly
        const handleResize = () => {
            if (mapInstance) {
                mapInstance.resize();
            }
        };

        window.addEventListener('resize', handleResize);
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

        mapInstance.on('style.load', () => {
            const layers = mapInstance.getStyle().layers
            layers.forEach(layer => {
                if (layer.type === 'symbol') {
                    mapInstance.removeLayer(layer.id)
                }
            })
        })

        return () => {
            window.removeEventListener('resize', handleResize);
            mapInstance.remove()
        }
    }, [])

    useEffect(() => {
        if (!userLocation || !userMarker || !map) return

        userMarker.setLngLat(userLocation)
        if (!hasCenteredRef.current) {
            map.setCenter(userLocation)
            hasCenteredRef.current = true
        }
    }, [userLocation, userMarker, map])

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
        <div className={`h-full w-full`}>
            <div id="map" className="w-full h-full absolute inset-0" ref={mapContainerRef} />
        </div>
    )
}

export default Map