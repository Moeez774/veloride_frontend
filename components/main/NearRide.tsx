'use client'
import './Main.css'
import { FlagIcon, MapPinIcon } from '@heroicons/react/16/solid'
import { Flag, MapPin, Navigation, Tag } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ToolTip from './ToolTip'
import Link from 'next/link'

interface Details {
    nearRides: any[],
    ride: any
}

const NearRide: React.FC<Details> = ({ ride, nearRides }) => {

    const [image, setImage] = useState('')
    const [badge, setBadge] = useState(false)

    //setting cheapest ride badge
    useEffect(() => {
        const allPrices = nearRides.map(e => e.budget.totalBudget)
        allPrices.sort((a, b) => a-b)
        if(ride.budget.totalBudget===allPrices[0]) setBadge(true)
    }, [])

    //formatting date
    const date = new Date(ride.rideDetails.date);
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = date.toLocaleDateString('en-US', options)

    // setting image of vehicle
    useEffect(() => {
        if (ride.rideDetails.vehicle === 'Standard Car') setImage('/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon_-removebg-preview.png')
        switch (ride.rideDetails.vehicle) {
            case "Standard Car":
                setImage('/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon__1_-removebg-preview.png')
                break;
            case "SUV / Van":
                setImage('/Images/Screenshot_2025-03-23_090615_cleanup-removebg-preview.png')
                break;
            case "Luxury Car":
                setImage('/Images/vecteezy_luxury-car-side-view-silhouette-on-white-background_54072783_1_-removebg-preview.png')
                break;
            case "Electric Vehicle":
                setImage('/Images/Screenshot_2025-03-23_091233-removebg-preview.png')
                break;
        }
    }, [ride])

    return (
        <div className='inter text-[#202020] rounded-2xl overflow-auto p-6 bg-[#f0f0f0] w-full'>

          { badge && <div className='absolute flex -top-1 -left-3 gap-1 py-2 px-4 roudned-lg'>
                <ToolTip />
            </div> }

            <div className='w-full flex flex-col gap-6'>

                <div className='flex flex-col gap-6 sm:gap-4'>
                    <div className='flex w-full justify-between'>
                        <img className='w-28 sm:w-24' src={image || undefined} alt="" />
                    </div>

                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-1'>
                            <MapPinIcon className='w-6 h-6' color='#202020' />
                            <h1 className='font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap sm:text-[14px]'>{ride.rideDetails.pickupLocation.pickupName.split(', ')[0]}, {ride.rideDetails.pickupLocation.pickupName.split(', ')[1]}</h1>
                        </div>

                        <div className='flex gap-2'>
                            <Navigation size={20} color='#202020' />
                            <h1 className='font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis sm:text-[14px]'>{ride.rideDetails.dropoffLocation.dropoffName.split(', ')[0]}, {ride.rideDetails.dropoffLocation.dropoffName.split(', ')[1]}</h1>
                        </div>

                    </div>

                </div>

                {/* // ride info */}
                <div className='text-[13px] sm:text-sm w-full sm:w-[19rem] flex flex-col gap-3'>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            <h1 className='font-semibold'>Driver:</h1>
                            <h1 className='font-normal text-sm'>{ride.driverName}</h1>
                        </div>

                        <div className='flex gap-1'>
                            <h1 className='font-semibold'>Fare:</h1>
                            <h1 className='font-normal'>Rs.{ride.budget.totalBudget}</h1>
                        </div>
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='flex gap-1'>
                            <h1 className='font-semibold'>Date:</h1>
                            <h1 className='font-normal'>{formattedDate}</h1>
                        </div>

                        <div className='flex gap-1'>
                            <h1 className='font-semibold'>Time:</h1>
                            <h1 className='font-normal'>{ride.rideDetails.time}</h1>
                        </div>
                    </div>

                </div>

                {/* //button for ride details  */}
                <div className='flex mt-2 items-center'>
                    <div>
                        <Link prefetch={false} href={`/ride-detail/${ride._id}?from=${encodeURIComponent(ride.rideDetails.pickupLocation.pickupName || '')}&long=${ride.rideDetails.pickupLocation.coordinates[0]}&lat=${ride.rideDetails.pickupLocation.coordinates[0]}&to=${encodeURIComponent(ride.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${ride.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${ride.rideDetails.pickupLocation.coordinates[0]}&isBest=${badge? 'true': 'false'}`} ><button className='text-[14px] exo2 bg-[#fefefe] px-5 py-3 rounded-3xl cursor-pointer shadow-md transition-all font-semibold duration-200 text-[#202020] active:bg-[#fff7f7] hover:bg-[#f5f4f4]'>Ride Details</button></Link>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default NearRide
