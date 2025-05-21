'use client'
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { MapPinIcon, StarIcon, HeartIcon } from '@heroicons/react/16/solid'
import { Navigation, Eye, X } from 'lucide-react'
import Link from 'next/link'
interface Details {
    currentTab: number,
    recentSearches: any[],
    isFavoriteMap: Record<string, boolean>,
    setIsFavoriteMap: Dispatch<SetStateAction<Record<string, boolean>>>,
    checkFavorite: (rideId: string) => Promise<void>,
    getMap: (screen: string, pickupLocation: number[], dropoffLocation: number[]) => string
}

const Recents: React.FC<Details> = ({ currentTab, recentSearches, isFavoriteMap, setIsFavoriteMap, checkFavorite, getMap }) => {

    const [imageInView, setImageInView] = useState<any>()
    const [inView, setInView] = useState(false)
    const [showImage, setShowImage] = useState(false)

    //formatting date
    const getDate = (d: any) => {
        const date = new Date(d)
        const options = { year: "numeric", month: "long", day: "numeric" } as const
        const formattedDate = date.toLocaleDateString('en-US', options)

        return formattedDate
    }

    useEffect(() => {
        if (!recentSearches) return

        recentSearches.forEach((ride) => {
            checkFavorite(ride._id)
        })
    }, [recentSearches])

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

                {currentTab === 0 && recentSearches.length === 0 && <div className='flex mt-10 flex-col items-center justify-center w-full h-full col-span-4'>No recent searches found.</div>}

                {currentTab === 1 && !Object.keys(isFavoriteMap).some(key => isFavoriteMap[key]) && <div className='flex flex-col items-center mt-10 justify-center w-full h-full col-span-4'>No favorites rides found.</div>}

                {recentSearches.length != 0 && recentSearches.map((e, index) => {
                    return (
                        <div key={index}>
                            {((currentTab === 1 && isFavoriteMap[e._id]) || currentTab === 0) && <div className='relative flex w-full sm:w-fit h-fit flex-col gap-4'><img className='w-full hidden sm:block cursor-pointer rounded-xl' src={getMap("400x400", e.from.coordinates, e.to.coordinates)} />

                                <img className='w-full sm:hidden cursor-pointer' style={{ borderRadius: '50px' }} src={getMap("500x300", e.from.coordinates, e.to.coordinates)} />

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
                                        setIsFavoriteMap((prev: Record<string, boolean>) => ({
                                            ...prev,
                                            [e._id]: !prev[e._id]
                                        }))
                                        const isFavorite = !isFavoriteMap[e._id]

                                        //save to db
                                        await fetch('http://localhost:4000/saved-routes/set-favorite', {
                                            method: "POST", headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({ _id: e._id, isFavorite: isFavorite })
                                        })

                                    }} className='w-10 cursor-pointer transition-all duration-200 h-10' style={{ color: isFavoriteMap[e._id] ? '#00b37e' : 'rgba(0, 0, 0, 0.4)' }} /></button>

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
                                        <h1 className='text-[#717171] font-medium text-sm'>Searched at: {getDate(e.createdAt)}</h1>
                                    </div>

                                    {/* //currentFare */}
                                    <h1 className='font-semibold'>Rs.{Math.round(e.currentFare)}</h1>
                                </button></Link>
                            </div>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Recents