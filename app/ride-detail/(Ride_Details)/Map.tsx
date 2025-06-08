'use client'
import React, { useEffect, useState, useRef } from 'react'
import "swiper/css"
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
import mapboxgl from 'mapbox-gl'
import { X, Minimize2, Maximize2, LocateFixed, Navigation, Info } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import socket from '@/utils/socket'
import '@/app/(HomePage)/Main.css'

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

interface Driver {
    userId: string;
    location: [number, number];
}

const LocalMap = ({ ride, isOpen, onClose }: { ride: any, isOpen: boolean, onClose: () => void }) => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const authContext = useAuth()
    const [rideDriver, setRideDriver] = useState<any>(null)
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers as Driver[] || null
    const user = authContext?.user || null
    const hasCenteredRef = useRef(false)
    const lastPositionRef = useRef<[number, number] | null>(null)
    const lastUpdateTimeRef = useRef<number>(0)
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [showControls, setShowControls] = useState(true)

    const context = getContacts()
    const toggleTheme = context?.toggleTheme

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
        if (!drivers || drivers.length === 0 || !ride) return
        const rideDriver = drivers.find((driver: Driver) => driver.userId === ride.userId)
        setRideDriver(rideDriver)
    }, [drivers, ride, isOpen])

    useEffect(() => {
        if (!map) return
        setMap(map.setStyle(`mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`))
    }, [toggleTheme, map])

    useEffect(() => {
        if (!userLocation || !map || !userMarker || hasCenteredRef.current) return
        setMap(map?.setCenter(userLocation))
        setUserMarker(userMarker?.setLngLat(userLocation))
        hasCenteredRef.current = true
    }, [userLocation, map, userMarker])

    useEffect(() => {
        if (!isOpen || !mapContainerRef.current) return

        const timer = setTimeout(() => {
            const mapInstance = new mapboxgl.Map({
                container: mapContainerRef.current!,
                style: `mapbox://styles/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}`,
                center: [0, 0],
                zoom: 14.5,
                attributionControl: false
            })

            mapInstance.resize()
            mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
            mapInstance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

            // Create user location marker
            const blueDot = document.createElement('div')
            blueDot.className = 'user-location-dot'

            const marker = new mapboxgl.Marker({
                element: blueDot
            })
                .setLngLat([0, 0])
                .addTo(mapInstance)

            setMap(mapInstance)
            setUserMarker(marker)

            // Add driver marker if exists
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

            // Add pickup and dropoff markers
            if (ride && ride.rideDetails) {
                if (ride.rideDetails.pickupLocation.coordinates && ride.rideDetails.dropoffLocation.coordinates) {
                    const start = ride.rideDetails.pickupLocation.coordinates;
                    const end = ride.rideDetails.dropoffLocation.coordinates;

                    mapInstance.on('load', () => {
                        mapInstance.addSource('route', {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': [
                                        start,
                                        end
                                    ]
                                }
                            }
                        })

                        mapInstance.addLayer({
                            'id': 'route',
                            'type': 'line',
                            'source': 'route',
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            'paint': {
                                'line-color': '#00563c',
                                'line-width': 4,
                                'line-opacity': 0.8
                            }
                        });

                        const size = 150;

                        const pulsingDot = {
                            width: size,
                            height: size,
                            data: new Uint8Array(size * size * 4),

                            onAdd: function () {
                                const canvas = document.createElement('canvas');
                                canvas.width = this.width;
                                canvas.height = this.height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    (this as any).context = ctx;
                                }
                            },

                            render: function () {
                                const duration = 1000;
                                const t = (performance.now() % duration) / duration;

                                const radius = (size / 2) * 0.3;
                                const outerRadius = (size / 2) * 0.7 * t + radius;
                                const context = (this as any).context;

                                context.clearRect(0, 0, this.width, this.height);
                                context.beginPath();
                                context.arc(
                                    this.width / 2,
                                    this.height / 2,
                                    outerRadius,
                                    0,
                                    Math.PI * 2
                                );
                                context.fillStyle = `rgba(0, 86, 60, ${1 - t})`;
                                context.fill();

                                // draw inner circle
                                context.beginPath();
                                context.arc(
                                    this.width / 2,
                                    this.height / 2,
                                    radius,
                                    0,
                                    Math.PI * 2
                                );
                                context.fillStyle = 'rgba(0, 86, 60, 1)';
                                context.strokeStyle = 'white';
                                context.lineWidth = 2;
                                context.fill();
                                context.stroke();

                                this.data = context.getImageData(0, 0, this.width, this.height).data;

                                mapInstance.triggerRepaint();

                                return true;
                            }
                        };

                        mapInstance.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });

                        // Create pickup marker
                        const pickupEl = document.createElement('div')
                        pickupEl.className = 'pickup-location-marker'

                        const pickupMarker = new mapboxgl.Marker({
                            element: pickupEl,
                            color: '#00563c'
                        })
                            .setLngLat(start)
                            .setPopup(new mapboxgl.Popup({
                                offset: 25,
                                className: toggleTheme ? 'dark-popup' : 'light-popup'
                            }).setHTML(`<h3 class="font-bold">Pickup</h3><p>${ride.rideDetails.pickupLocation.pickupName}</p>`))
                            .addTo(mapInstance)

                        // Create dropoff marker
                        const dropoffEl = document.createElement('div')
                        dropoffEl.className = 'dropoff-location-marker'

                        const dropoffMarker = new mapboxgl.Marker({
                            element: dropoffEl,
                            color: '#e74c3c'
                        })
                            .setLngLat(end)
                            .setPopup(new mapboxgl.Popup({
                                offset: 25,
                                className: toggleTheme ? 'dark-popup' : 'light-popup'
                            }).setHTML(`<h3 class="font-bold">Dropoff</h3><p>${ride.rideDetails.dropoffLocation.dropoffName}</p>`))
                            .addTo(mapInstance)

                        // Fit bounds to include all markers
                        const bounds = new mapboxgl.LngLatBounds()
                        bounds.extend(start)
                        bounds.extend(end)
                        if (userLocation) bounds.extend(userLocation)
                        if (rideDriver) bounds.extend(rideDriver.location)

                        mapInstance.fitBounds(bounds, { padding: { top: 100, bottom: 100, left: 50, right: 50 } })
                    });
                }
            }

            // Hide controls when map is being interacted with
            mapInstance.on('dragstart', () => {
                setShowControls(false);
            });

            mapInstance.on('dragend', () => {
                setTimeout(() => setShowControls(true), 1500);
            });

            // Handle window resize
            const handleResize = () => {
                if (mapInstance) {
                    mapInstance.resize();
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                mapInstance.remove()
                setMarkers({})
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [isOpen, rideDriver, ride, userLocation, toggleTheme])

    useEffect(() => {
        if (!userLocation || !userMarker || !map) return

        const smoothedPosition = smoothPosition(userLocation)
        userMarker.setLngLat(smoothedPosition)
        if (!hasCenteredRef.current) {
            map.setCenter(smoothedPosition)
            hasCenteredRef.current = true
        }
    }, [userLocation, userMarker, map])

    useEffect(() => {
        if (!map || !rideDriver || !isOpen) return;

        const { userId, location } = rideDriver;
        const marker = markers[userId];

        if (marker) {
            marker.setLngLat(location);
        }
    }, [rideDriver?.location, markers, rideDriver?.userId])

    // Check socket connection
    useEffect(() => {
        if (socket.connected) {
            socket.emit('request', "User wants drivers location.")
        } else {
            socket.on('connect', () => {
                socket.emit('request', "User wants drivers location.")
            })
        }
    }, [])

    // Hide controls when clicking on map
    const handleMapClick = () => {
        setShowControls(false);
        setTimeout(() => setShowControls(true), 3000);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
            <div
                className={`absolute inset-0 backdrop-blur-sm ${toggleTheme ? 'bg-black/70' : 'bg-black/30'}`}
                onClick={onClose}
            />

            <div
                className={`absolute transition-all duration-300 ease-in-out inset-4 sm:inset-8 md:inset-16 rounded-2xl
                    overflow-hidden shadow-2xl ${toggleTheme ? 'bg-[#121212] border border-[#252525]' : 'bg-white'}`}
            >
                {/* Map Container - Place this first in the DOM so it doesn't get covered */}
                <div className="h-full w-full">
                    <div
                        id="map"
                        ref={mapContainerRef}
                        className="w-full h-full"
                        onClick={handleMapClick}
                    />
                </div>

                {/* Map UI Overlay - Now using fixed positioning with transition */}
                <div
                    className={`absolute top-0 left-0 right-0 z-10 px-4 py-3 flex justify-between items-center
                    ${toggleTheme ? 'bg-[#121212]/80' : 'bg-white/80'} backdrop-blur-md border-b
                    ${toggleTheme ? 'border-[#252525]' : 'border-gray-200'}
                    transition-transform duration-300 ease-in-out ${showControls ? 'translate-y-0' : '-translate-y-full'}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f5f5f5]/80'}`}>
                            <Navigation size={16} className="text-[#00563c]" />
                        </div>
                        <span className={`font-medium text-sm ${toggleTheme ? 'text-white' : 'text-black'}`}>
                            {ride?.rideDetails?.distance ? `${Math.round(ride.rideDetails.distance)} km` : 'Route'}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className={`h-8 w-8 cursor-pointer rounded-full flex items-center justify-center ${toggleTheme ? 'bg-[#202020]/80 text-white hover:bg-[#252525]' : 'bg-[#f5f5f5]/80 text-black hover:bg-gray-100'} transition-all`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Bottom UI - Using fixed positioning with transition */}
                <div
                    className={`absolute bottom-0 left-0 right-0 z-10 p-4
                    ${toggleTheme ? 'bg-[#121212]/80' : 'bg-white/80'} backdrop-blur-md border-t
                    ${toggleTheme ? 'border-[#252525]' : 'border-gray-200'}
                    transition-transform duration-300 ease-in-out ${showControls ? 'translate-y-0' : 'translate-y-full'}`}
                >
                    <div className={`w-full rounded-xl p-3 ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f5f5f5]/80'} backdrop-blur-md flex justify-between items-center`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-[#00563c]`}>
                                <LocateFixed size={18} className="text-white" />
                            </div>
                            <div>
                                <p className={`text-xs opacity-70 ${toggleTheme ? 'text-white' : 'text-black'}`}>Duration</p>
                                <p className={`font-medium ${toggleTheme ? 'text-white' : 'text-black'}`}>
                                    {ride?.rideDetails?.duration ? `${Math.round(ride.rideDetails.duration)} mins` : 'Calculating...'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                className={`h-10 w-10 rounded-full flex items-center justify-center
                                ${toggleTheme ? 'bg-[#252525] hover:bg-[#303030]' : 'bg-white hover:bg-[#e5e5e5]'}
                                transition-all`}
                                onClick={() => {
                                    if (map) {
                                        const bounds = new mapboxgl.LngLatBounds();
                                        bounds.extend(ride.rideDetails.pickupLocation.coordinates);
                                        bounds.extend(ride.rideDetails.dropoffLocation.coordinates);
                                        map.fitBounds(bounds, { padding: { top: 100, bottom: 100, left: 50, right: 50 } });
                                    }
                                }}
                            >
                                <Info size={18} className={`${toggleTheme ? 'text-white' : 'text-black'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocalMap