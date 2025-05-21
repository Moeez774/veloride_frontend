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
    const setUserLocation = authContext?.setUserLocation
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
    const hasCenteredRef = useRef(false)
    const [mainMapId, setMainMapId] = useState('map')
    const [dialogMapId, setDialogMapId] = useState('')
    const [selectedTarget, setSelectedTarget] = useState<any>(null)

    const context = getContacts()
    const toggleTheme = context?.toggleTheme

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

    //adding markers for passengers
    useEffect(() => {
        if (!selectedRide || !passengers || !map) return;

        const currentRidePassengers = passengers[selectedRide._id];
        const existingUserIds = new Set(currentRidePassengers ? Object.keys(currentRidePassengers) : []);

        // Add or update markers
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

        // Remove markers that no longer exist
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