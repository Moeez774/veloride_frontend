'use client'
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { usePathname } from 'next/navigation'
import { MapPinIcon, StarIcon, HeartIcon } from '@heroicons/react/16/solid'
import { Navigation, Eye, X } from 'lucide-react'
import Link from 'next/link'
interface Details {
    currentTab: number,
    user: any,
    userLocation: number[] | null,
    nearRides: any[],
    setNearRides: Dispatch<SetStateAction<any[]>>,
    isNearMap: Record<string, boolean>,
    setIsNearMap: Dispatch<SetStateAction<Record<string, boolean>>>,
    getMap: (screen: string, pickupLocation: number[], dropoffLocation: number[]) => string
}

const Nearby: React.FC<Details> = ({ currentTab, user, getMap, nearRides, setNearRides, isNearMap, setIsNearMap }) => {

    const [imageInView, setImageInView] = useState<any>()
    const [distance, setDistance] = useState<{ [key: string]: any }>({})
    const [inView, setInView] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const pathname = usePathname()
    const long = localStorage.getItem("long")
    const lat = localStorage.getItem("lat")
    const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

    // for fetching distance of near rides from user
    useEffect(() => {
        const fetchRidesDistance = async () => {
            const distanceData: { [key: string]: any } = {}
            for (const ride of nearRides) {
                if (!distanceData[ride._id]) {
                    distanceData[ride._id] = await fetchDistance(ride)
                }
            }
            setDistance(distanceData)
        }
        if (nearRides && nearRides.length > 0) fetchRidesDistance()
    }, [nearRides])

    //fetching saved rides near user
    useEffect(() => {
        if (!user) return

        const fetchRides = async () => {
            let a = await fetch('http://localhost:4000/saved-routes/fetchNearRides', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userLocation: currLocation, userId: user._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) setNearRides(response.data)
            else alert(response.message)
        }

        fetchRides()
    }, [user])

    //for fetching distance of rides if they are near
    const fetchDistance = async (e: any) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currLocation[0]},${currLocation[1]};${e.from.coordinates[0]},${e.to.coordinates[1]}?access_token=pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw`

        const info = await fetch(url)
        const jsonInfo = await info.json()

        if (jsonInfo.code === 'Ok') {
            const route = jsonInfo.routes[0];
            const distance = (route.distance / 1000).toFixed(2)
            return distance
        }
    }

    // fetch favorite by rideId
    const checkFavorite = async (rideId: string) => {
        try {
            const res = await fetch('http://localhost:4000/saved-routes/get-favorite', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: rideId })
            })

            const data = await res.json()
            setIsNearMap(prev => ({
                ...prev,
                [rideId]: data.isFavorite
            }))
        } catch (error) {
            console.error("Failed to check favorite:", error)
        }
    }

    useEffect(() => {
        if (!nearRides || currentTab != 3) return

        nearRides.forEach((ride) => {
            checkFavorite(ride._id)
        })
    }, [nearRides, currentTab, pathname])

    return (
        <>

            {imageInView && inView && <div className='h-screen w-screen justify-center flex items-center z-50 fixed top-0 left-0 bg-[#000000]/40'>
                <div className='relative flex mx-4 items-center justify-center'>

                    <img className='hidden lg:block rounded-xl' style={{ transform: showImage ? 'scale(1)' : 'scale(0.8)', opacity: showImage ? '1' : '0', transition: 'all 0.2s ease-in-out' }} src={getMap("1280x620", imageInView?.pickupLocation, imageInView?.dropoffLocation)} />

                    <img className='hidden md:block lg:hidden rounded-xl' style={{ transform: showImage ? 'scale(1)' : 'scale(0.8)', opacity: showImage ? '1' : '0', transition: 'all 0.2s ease-in-out' }} src={getMap("1180x1000", imageInView?.pickupLocation, imageInView?.dropoffLocation)} />

                    <img className='hidden sm:block md:hidden rounded-xl' style={{ transform: showImage ? 'scale(1)' : 'scale(0.8)', opacity: showImage ? '1' : '0', transition: 'all 0.2s ease-in-out' }} src={getMap("700x1000", imageInView?.pickupLocation, imageInView?.dropoffLocation)} />

                    <img className='sm:hidden w-full rounded-xl' style={{ transform: showImage ? 'scale(1)' : 'scale(0.8)', opacity: showImage ? '1' : '0', transition: 'all 0.2s ease-in-out' }} src={getMap("500x800", imageInView?.pickupLocation, imageInView?.dropoffLocation)} />

                    <button className={`p-3 absolute ${showImage ? 'opacity-[1]' : 'opacity-0'} right-0 top-0 m-6 rounded-full bg-[#202020]/40 hover:bg-[#202020]/60 cursor-pointer transition-all duration-200`} onClick={() => {
                        setShowImage(false)
                        setTimeout(() => setInView(false), 200)
                    }} ><X size={22} style={{ color: '#fefefe' }} /></button>
                </div>
            </div>}

            <div className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10'>

                {nearRides.length === 0 && <div className='flex mt-10 flex-col items-center justify-center w-full h-full col-span-4'>No near saved ride found.</div>}

                {nearRides.length != 0 && nearRides.map((e, index) => {
                    return (
                        <div key={index}>
                            <div className='relative flex w-full sm:w-fit h-fit flex-col gap-4'><img className='w-full hidden sm:block cursor-pointer rounded-xl' src={getMap("400x400", e.from.coordinates, e.to.coordinates)} />

                                <img className='w-full sm:hidden cursor-pointer' style={{ borderRadius: '50px' }} src={getMap("1000x500", e.from.coordinates, e.to.coordinates)} />

                                <div className='absolute w-full p-5 sm:p-3 flex justify-between items-center'>

                                    {/* for seeing full map */}
                                    <button className='p-2 rounded-full bg-[#202020]/40 hover:bg-[#202020]/60 cursor-pointer transition-all duration-200' onClick={() => {
                                        const data = {
                                            screen: "1280x720",
                                            pickupLocation: e.from.coordinates,
                                            dropoffLocation: e.to.coordinates
                                        }

                                        setImageInView(data)
                                        setInView(true)
                                        setTimeout(() => setShowImage(true), 10)
                                    }} ><Eye size={20} style={{ color: '#fefefe' }} /></button>

                                    <button><HeartIcon onClick={async () => {
                                        setIsNearMap(prev => ({
                                            ...prev,
                                            [e._id]: !prev[e._id]
                                        }))
                                        const isFavorite = !isNearMap[e._id]

                                        //save to db
                                        await fetch('http://localhost:4000/saved-routes/set-favorite', {
                                            method: "POST", headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({ _id: e._id, isFavorite: isFavorite })
                                        })

                                    }} className='w-10 cursor-pointer transition-all duration-200 h-10' style={{ color: isNearMap[e._id] ? '#00b37e' : 'rgba(0, 0, 0, 0.4)' }} /></button>

                                </div>

                                <Link prefetch={false} href={`/ride-detail/${e._id.split("-")[1]}?from=${encodeURIComponent(e.from.name || '')}&long=${e.from.coordinates[0]}&lat=${e.from.coordinates[1]}&to=${encodeURIComponent(e.to.name || '')}&dropLong=${e.to.coordinates[0]}&dropLat=${e.to.coordinates[1]}&isCheaper=false`} ><button className='flex flex-col items-start w-full text-start cursor-pointer gap-1.5'>

                                    <div className='flex w-full justify-between gap-2'>
                                        <div className='flex gap-2 text-[15px] sm:text-sm flex-col'>

                                            <h1 className='font-medium flex items-start xl:items-center gap-1'><MapPinIcon className='w-5 h-5' color='#202020' />{e.from.name.split(",")[0]}</h1>

                                            <h1 className='font-medium flex xl:items-center gap-2'><Navigation size={17} color='#202020' />{e.to.name.split(",")[0]}</h1>
                                        </div>

                                        <h1 className='flex font-medium text-sm'><StarIcon className='w-[18px] h-[18px]' color='#202020' />4.5</h1>
                                    </div>

                                    <div className='flex flex-col gap-0.5'>
                                        <h1 className='text-[#717171] font-medium text-sm'>{e.vehicle}</h1>
                                        <h1 className='text-[#717171] font-medium text-sm'>{distance[e._id]} km away from you</h1>
                                    </div>

                                    {/* //currentFare */}
                                    <h1 className='font-semibold'>Rs.{Math.round(e.currentFare)}</h1>
                                </button></Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Nearby