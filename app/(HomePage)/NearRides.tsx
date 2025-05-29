'use client'
import React, { useEffect, useState, useRef } from 'react'
import "swiper/css"
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import socket from '@/utils/socket'
import './Main.css'
import { MapPinIcon } from '@heroicons/react/16/solid'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaCar, FaCoins, FaStar } from 'react-icons/fa'
import { Star, Car, Sliders, Clock, ArrowRight, Navigation } from 'lucide-react'

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw'

const NearRides = () => {

    const [nearRides, setNearRides] = useState<any[]>([])
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<Record<string, mapboxgl.Marker>>({})
    const [userMarker, setUserMarker] = useState<mapboxgl.Marker | null>(null)
    const [driversTime, setDriversTime] = useState<any>({})
    const [showRatedDrivers, setShowRatedDrivers] = useState(false)
    const [avgTime, setAvgTime] = useState<number>(0)
    const [details, setDetails] = useState<any>(null)
    const [showDetails, setShowDetails] = useState(false)
    const authContext = useAuth()
    const [mostRatedDrivers, setMostRatedDrivers] = useState<any[]>([])
    const userLocation = authContext?.userLocation || null || undefined
    const drivers = authContext?.drivers || null
    const setUserLocation = authContext?.setUserLocation
    const nearRidesRef = useRef(nearRides)
    const user = authContext?.user || null
    const detailsRef = useRef<HTMLDivElement>(null)
    const hasCenteredRef = useRef(false)

    //hiding details popup on outside click of popup
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
                setShowDetails(false)
            }
        }

        window.addEventListener("mousedown", handleClick)

        return () => {
            window.removeEventListener("mousedown", handleClick)
        }
    }, [])

    useEffect(() => {
        nearRidesRef.current = nearRides
    }, [nearRides])

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

                el.addEventListener('click', () => {
                    const driverRide = nearRidesRef.current.find((ride: any) => ride.userId === userId)
                    setDetails(driverRide)
                    setShowDetails(true)
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
    }, [drivers, user])

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

    //fetching rides near user
    useEffect(() => {
        if (!user) return
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")

        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

        const fetchRides = async () => {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/fetchRides`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userLocation: currLocation, userId: user._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                const rides = response.data

                const onlineNearRides = rides.filter((ride: { userId: string }) => {
                    return drivers?.some((driver) => driver.userId === ride.userId) ?? false
                })

                const mostRated = onlineNearRides.filter((ride: { driver_rating: number }) => ride.driver_rating <= 4.5)

                setMostRatedDrivers(mostRated)
                setNearRides(onlineNearRides)
            }
            else alert(response.message)
        }

        fetchRides()
    }, [user, drivers])

    useEffect(() => {
        if (!drivers || drivers.length === 0) return
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")

        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

        const sources = drivers.map((driver) => [driver.location[0], driver.location[1]])
        const targets = [currLocation]

        const body = {
            mode: 'drive',
            sources: sources,
            targets: targets
        }

        const fetchAvgTime = async () => {
            let a = await fetch(`https://api.geoapify.com/v1/routematrix?apiKey=7c961581499544e085f28a826bf9ebeb`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            let data = await a.json()
            const times = data.sources_to_targets.map((item: any) => item[0].time)
            const avgTime = Math.round(
                times.reduce((a: number, b: number) => a + b, 0) / times.length / 60
            )
            setAvgTime(avgTime)

            // for getting ETA of drivers separately
            times.forEach((t: any, i: any) => {
                const time = `${Math.round(t / 60)} min`

                setDriversTime((prev: Record<string, number>) => ({
                    ...prev,
                    [drivers[i].userId]: time
                }))
            })

        }

        fetchAvgTime()

    }, [drivers])

    return (
        <div className={`inter flex flex-col my-10 gap-6 max-w-[76rem] sm:px-4 lg:px-8 xl:px-0 w-full mx-auto ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
            <h1 className='text-3xl font-semibold mx-4 sm:mx-0'>Rides Near You</h1>

            <div className='relative w-full flex flex-col gap-4'>
                <div className={`relative flex justify-center w-full overflow-x-hidden items-center`}>
                    <div id="map" className={`w-full h-[50em]`} />
                    <div ref={detailsRef} className={`${toggleTheme ? 'bg-[#1e1e1e]' : 'bg-[#fefefe]'} rounded-lg p-4 transition-all ease-out duration-500 shadow-lg ${showDetails ? 'translate-x-0' : 'translate-x-[28rem]'} -translate-y-16 right-3 w-[20em] sm:w-[25em] absolute z-[30]`}>

                        {details && <div className='inter w-full flex gap-6 flex-col justify-between'>

                            <div className='flex items-center justify-between gap-3'>

                                <div className='flex items-center gap-1.5'>
                                    <img className='w-9 rounded-full' src={details.additionalInfo.photo === "" ? '/Images/user(1).png' : details.additionalInfo.photo} />

                                    <div>
                                        <h1 className='text-[15px]'>{details.driverName}</h1>
                                        <h1 className='text-[13px] flex items-center gap-1 font-normal text-[gray]'>Rated: {details.driver_rating} <FaStar size={13} color='gray' /> </h1>
                                    </div>
                                </div>

                                <div className={`bg-[#00563c] hover:bg-[#00563ccc] p-2 cursor-pointer transition-all duration-200 rounded-full`}><ArrowRight size={20} color='#fefefe' className='-rotate-45' /></div>
                            </div>

                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end w-full gap-2'>
                                <div className='flex gap-2 w-full sm:w-4/5 font-medium text-sm flex-col'>
                                    <h1 className='flex items-start sm:items-center gap-1'><MapPinIcon className='w-6 h-6' color={toggleTheme ? '#fefefe' : '#202020'} />{details.rideDetails.pickupLocation.pickupName.split(",").slice(0, 2).join(", ")}</h1>
                                    <h1 className='flex gap-2'><Navigation size={20} color={toggleTheme ? '#fefefe' : '#202020'} />{details.rideDetails.dropoffLocation.dropoffName.split(",").slice(0, 2).join(", ")}</h1>
                                    <h1 className='flex mt-1 items-center gap-1'><FaCoins size={17} color={toggleTheme ? '#048c64' : '#00563c'} className='mt-1' /> Fare: Rs.{details.budget.totalBudget} </h1>
                                </div>

                                <div className='flex mt-1 sm:mt-0 sm:flex-row-reverse gap-1 items-center'>
                                    <div className={`py-1 px-3 ${toggleTheme ? 'bg-[#2a2a2a]' : 'bg-[#f7f7f7]'} text-sm rounded-full flex items-center gap-1 text-[gray]`}><Clock size={13} color='gray' /> {driversTime?.[details.userId].split(" ")[0]}m</div>

                                    <h1 className='text-[gray] text-[13px] font-medium'>ETA</h1>
                                </div>
                            </div>
                        </div>}

                    </div>
                </div>

                <div className={`${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} rounded-xl w-full py-6 px-2 md:p-6 lg:px-2 lg:h-[10em] flex items-center justify-center`}>

                    <div className='max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:justify-between items-center gap-6 w-full'>
                        <div className='lg:w-fit flex sm:flex-col items-start gap-1'>
                            <div className={`${toggleTheme ? 'bg-[#2A2A2A]' : 'bg-[#e2e2e2]'} p-3 rounded-full w-fit`}>
                                <FaCar size={25} color={toggleTheme ? '#fefefe' : '#202020'} />
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='mt-0.5 ml-1 text-lg font-semibold'>Total {nearRides.length == 1 ? `${nearRides.length} Ride` : `${nearRides.length} Rides`}</h1>
                                <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} ml-1 text-[13px] sm:text-sm`}>near you now</p>
                            </div>
                        </div>

                        <div className='lg:w-fit flex justify-between items-start gap-2'>

                            <div className='flex sm:flex-col items-start gap-1'>
                                <div className={`${toggleTheme ? 'bg-[#2A2A2A]' : 'bg-[#e2e2e2]'} p-3 rounded-full w-fit`}>
                                    <FaStar size={24} color={toggleTheme ? '#fefefe' : '#202020'} />
                                </div>

                                <div>
                                    <h1 className='mt-0.5 ml-1 text-lg font-semibold'>Top Rated Nearby</h1>
                                    <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} ml-1 text-[13px] sm:text-sm`}>4.5+ rated drivers near you</p>
                                </div>
                            </div>

                            <TooltipProvider>
                                <Tooltip open={showRatedDrivers} onOpenChange={() => {
                                    if (window.matchMedia("(max-width: 1023px)").matches) setShowRatedDrivers(false)
                                    else setShowRatedDrivers(!showRatedDrivers)
                                }}>
                                    <TooltipTrigger
                                        onFocus={() => {
                                            if (window.matchMedia("(max-width: 1023px)").matches) setShowRatedDrivers(true)
                                        }}
                                        onClick={() => {
                                            if (window.matchMedia("(max-width: 1023px)").matches) setShowRatedDrivers(true)
                                        }}
                                        onMouseEnter={() => {
                                            if (window.matchMedia("(min-width: 1024px)").matches) setShowRatedDrivers(true)
                                        }} className='bg-[#00563c] py-1.5 rounded-full px-2.5 cursor-pointer text-[#fefefe] text-xs'>View</TooltipTrigger>
                                    <TooltipContent className='inter flex flex-col bg-[#00563c] gap-2 py-3'>

                                        {mostRatedDrivers.map((driver, i) => {
                                            return (
                                                <div className='py-2.5 px-3 hover:bg-[#202020] transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 flex flex-col rounded-lg' key={i}>

                                                    <div className='flex items-start gap-1.5'>
                                                        <img className='w-10 rounded-full' src={driver.additionalInfo.photo === "" ? '/Images/user(1).png' : driver.additionalInfo.photo} />

                                                        <div className='flex flex-col gap-1'>
                                                            <h1 className='flex font-medium text-sm text-[#fefefe] items-center'>{driver.driverName}</h1>
                                                            <h1 className='text-xs flex items-center text-[#b1b1b1] gap-1'><Star size={15} color='#b1b1b1' />{driver.driver_rating + 4.6}</h1>
                                                        </div>

                                                    </div>

                                                    <div className='flex mt-4 items-center gap-2'>
                                                        <h1 className='py-1 px-2 w-fit bg-[#fefefe] rounded-full text-[#202020] flex font-medium items-center gap-1 text-xs'><Car size={15} color='#202020' /> {driver.rideDetails.vehicle}</h1>
                                                        <button className='text-[#fefefe] bg-[#00563c] rounded-full p-1.5 text-start w-fit cursor-pointer text-sm font-medium flex items-center'><ArrowRight className='-rotate-45' size={15} color='#fefefe' /></button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className='lg:w-fit flex justify-between items-start gap-2'>
                            <div className='flex sm:flex-col items-start gap-1'>

                                <div className={`${toggleTheme ? 'bg-[#2A2A2A]' : 'bg-[#e2e2e2]'} p-3 rounded-full w-fit`}>
                                    <Sliders size={25} color={toggleTheme ? '#fefefe' : '#202020'} />
                                </div>

                                <div>
                                    <h1 className='mt-0.5 ml-1 text-lg font-semibold'>5 Music Friendly Rides</h1>
                                    <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} ml-1 text-sm`}>near you now</p>
                                </div>

                            </div>

                            <button className='bg-[#00563c] py-1.5 rounded-full px-2.5 cursor-pointer text-[#fefefe] text-xs'>View</button>
                        </div>

                        <div className='lg:w-fit flex justify-between items-start gap-2'>
                            <div className='flex sm:flex-col items-start gap-1'>
                                <div className={`${toggleTheme ? 'bg-[#2A2A2A]' : 'bg-[#e2e2e2]'} p-3 rounded-full w-fit`}>
                                    <Clock size={25} color={toggleTheme ? '#fefefe' : '#202020'} />
                                </div>
                                <div>
                                    <h1 className='mt-0.5 ml-1 text-lg font-semibold'>ETA: {avgTime}m</h1>
                                    <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} ml-1 text-sm`}>nearby driver average</p>
                                </div>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className='bg-[#00563c] py-1.5 rounded-full px-2.5 cursor-pointer text-[#fefefe] text-xs'>View</TooltipTrigger>
                                    <TooltipContent className='inter flex bg-[#00563c] flex-col gap-2 py-3'>

                                        {mostRatedDrivers.map((driver, i) => {
                                            return (
                                                <div className='py-2.5 px-3 hover:bg-[#202020] transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5 flex flex-col rounded-lg' key={i}>

                                                    <div className='flex items-start gap-1.5'>
                                                        <img className='w-10 rounded-full' src={driver.additionalInfo.photo === "" ? '/Images/user(1).png' : driver.additionalInfo.photo} />

                                                        <div className='flex flex-col gap-1'>
                                                            <h1 className='flex font-medium text-sm text-[#fefefe] items-center'>{driver.driverName}</h1>
                                                            <h1 className='text-xs text-[#b1b1b1] flex items-center gap-1'> ETA: {driversTime[driver.userId]}</h1>
                                                        </div>

                                                    </div>


                                                </div>
                                            )
                                        })}

                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default NearRides
