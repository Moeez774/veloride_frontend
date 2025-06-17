'use client'
import React, { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react'
import "swiper/css"
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@/app/(HomePage)/Main.css'
import { Eye, X } from 'lucide-react'
import { drawRoute } from '@/functions/function'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

interface MapProps {
    selectedRide?: any;
    passengers?: any;
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
}

const Map = ({ selectedRide, passengers, setOpen, open }: MapProps) => {

    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const userLocation = authContext?.userLocation || null || undefined
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
    const [selectedTarget, setSelectedTarget] = useState<any>(null)
    const hasCenteredRef = useRef(false)
    const lastPositionRef = useRef<[number, number] | null>(null)
    const lastUpdateTimeRef = useRef<number>(0)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

     //adding destination marker
     useEffect(() => {
        if (!selectedRide || !map) return
        const destination = selectedRide.rideDetails.dropoffLocation.coordinates
        const destinationMarker = new mapboxgl.Marker({ color: "green" })

        destinationMarker.setLngLat(destination).addTo(map).getElement().addEventListener('click', () => {
            setSelectedTarget({ lng: destination[0], lat: destination[1] })
        })
    }, [selectedRide, map])

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

        mapInstance.on('style.load', () => {
            const layers = mapInstance.getStyle().layers
            layers.forEach(layer => {
                if (layer.type === 'symbol') {
                    mapInstance.removeLayer(layer.id)
                }
            })
        })

        return () => {
            mapInstance.remove()
        }
    }, [])

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
        if (!userLocation || !userMarker || !map) return

        const smoothedPosition = smoothPosition(userLocation)
        userMarker.setLngLat(smoothedPosition)
        if (!hasCenteredRef.current) {
            map.setCenter(smoothedPosition)
            hasCenteredRef.current = true
        }
    }, [userLocation, userMarker, map])

    //adding markers for passengers
    useEffect(() => {
        if (!selectedRide || !passengers || !map) return;

        const currentRidePassengers = passengers[selectedRide._id];
        const existingUserIds = new Set(currentRidePassengers ? Object.keys(currentRidePassengers) : []);

        if (currentRidePassengers) {
            Object.entries(currentRidePassengers).forEach(([userId, location]) => {
                if (!location || !Array.isArray(location) || location.length !== 2) return;

                if (markersRef.current[userId]) {
                    markersRef.current[userId].setLngLat(location as [number, number]);
                } else {
                    const el = document.createElement('div');
                    el.className = 'driver-location-dot';
                    const marker = new mapboxgl.Marker({ element: el })
                        .setLngLat(location as [number, number])
                        .addTo(map)

                    el.addEventListener('click', () => {
                        setSelectedTarget({ lng: location[0], lat: location[1] })
                    })

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
    }, [selectedRide, passengers, map]);

    useEffect(() => {
        if (!selectedTarget || !userLocation || !map) return;

        const interval = setInterval(() => {
            drawRoute({ lng: userLocation[0], lat: userLocation[1] }, selectedTarget, map, toggleTheme);
        }, 3000)

        return () => clearInterval(interval);
    }, [userLocation, selectedTarget, map])

    return (
        <>
            <div className={`inter relative flex flex-col gap-6 w-full h-full mx-auto ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                <div className={`relative flex justify-center w-full h-full overflow-x-hidden items-center`}>

                    <div id='map' className={`w-full h-full`} />
                </div>
                <div className='absolute p-2 m-3 rounded-full bg-white hover:bg-gray-200 cursor-pointer top-0 left-0' onClick={() => {
                    setOpen(!open)
                }}>
                    {!open ? <Eye color='#202020' size={20} /> : <X color='#202020' size={20} />}
                </div>
            </div>
        </>
    )
}

export default Map