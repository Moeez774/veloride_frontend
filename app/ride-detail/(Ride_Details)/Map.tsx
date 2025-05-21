'use client'
import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import "swiper/css"
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
import mapboxgl from 'mapbox-gl'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Map } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import socket from '@/utils/socket'
import '@/app/(HomePage)/Main.css'

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

interface Driver {
    userId: string;
    location: [number, number];
}

const LocalMap = ({ ride }: { ride: any }) => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const [rideDriver, setRideDriver] = useState<any>(null)
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers as Driver[] || null
    const user = authContext?.user || null
    const setUserLocation = authContext?.setUserLocation
    const [opened, setOpened] = useState(false)
    const [selectedTarget, setSelectedTarget] = useState<any>(null)

    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    useEffect(() => {
        if (!drivers || drivers.length === 0 || !ride) return
        const rideDriver = drivers.find((driver: Driver) => driver.userId === ride.userId)
        setRideDriver(rideDriver)
    }, [drivers, ride, opened])

    useEffect(() => {
        if (!map) return
        setMap(map.setStyle(`mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`))
    }, [toggleTheme, map])

    useEffect(() => {
        if (!opened) return

        const timer = setTimeout(() => {
            const mapContainer = document.getElementById("map")
            if (!mapContainer) return

            const long = localStorage.getItem("long")
            const lat = localStorage.getItem("lat")

            const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

            const location: [number, number] = userLocation && userLocation.length === 2
                ? [userLocation[0], userLocation[1]]
                : [currLocation[0], currLocation[1]]

            const mapInstance = new mapboxgl.Map({
                container: mapContainer,
                style: `mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`,
                center: location,
                zoom: 14.5
            })

            mapInstance.resize()
            mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-left')

            const blueDot = document.createElement('div')
            blueDot.className = 'user-location-dot'

            const marker = new mapboxgl.Marker({
                element: blueDot
            })
                .setLngLat(location)
                .addTo(mapInstance)

            setMap(mapInstance)
            setUserMarker(marker)

            if (rideDriver && rideDriver.userId !== user?._id) {
                const driverEl = document.createElement('div')
                driverEl.className = 'driver-location-dot'

                driverEl.addEventListener('click', () => {
                    if (mapInstance) {
                        mapInstance.flyTo({
                            center: rideDriver.location,
                            zoom: 14.5
                        })
                    }
                })

                const driverMarker = new mapboxgl.Marker({ element: driverEl })
                    .setLngLat(rideDriver.location)
                    .addTo(mapInstance)

                setMarkers((prev) => ({
                    ...prev,
                    [rideDriver.userId]: driverMarker
                }))
            }

            const watcherId = navigator.geolocation.watchPosition(
                (position) => {
                    const { longitude, latitude } = position.coords
                    marker.setLngLat([longitude, latitude])
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
                setMarkers({})
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [opened, rideDriver])

    //for changing drivers location in realtime
    useEffect(() => {
        if (!map || !rideDriver || !opened) return;

        const { userId, location } = rideDriver;
        const marker = markers[userId];

        if (marker) {
            marker.setLngLat(location);
        }
    }, [rideDriver?.location, markers, rideDriver?.userId])

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
        <Sheet open={opened} onOpenChange={setOpened}>
            <SheetTrigger className={`p-2 cursor-pointer rounded-md font-medium ${toggleTheme ? 'text-[#fefefe] border hover:bg-[#202020cc] border-[#202020]' : 'text-[#202020] border hover:bg-[#f0f0f0cc]'}`}><Map size={20} />
            </SheetTrigger>
            <SheetContent className={`${toggleTheme ? 'text-[#fefefe] border border-[#202020]' : 'text-[#202020] border border-[#f0f0f0]'} w-screen p-0`}>
                <SheetHeader className='p-0'>
                    <SheetTitle className='p-0 absolute'></SheetTitle>
                    <div className={`inter flex flex-col gap-6 w-full mx-auto ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                        <div className={`relative flex justify-center w-full overflow-hidden items-center`}>
                            <div id="map" className={`w-full h-screen`} style={{ position: 'relative' }} />
                        </div>
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default LocalMap