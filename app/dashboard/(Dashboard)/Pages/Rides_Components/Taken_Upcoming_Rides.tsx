'use client'
import { MapPinIcon, Navigation, Users2, CreditCard, EllipsisVertical, Pencil, XCircle, Clock, Play, StopCircle } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { isToday } from 'date-fns'

const Taken_Upcoming_Rides = ({ toggleTheme, rides }: { toggleTheme: boolean | undefined, rides: any[] }) => {

    const formatDate = (date: string) => {
        const dateObj = new Date(date);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options)
        return formattedDate
    }
    return (
        <div className='mt-8'>
            {rides && rides.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {rides.map((ride, index) => (
                        <Link key={index} href={`/ride-detail/${ride._id}?from=${encodeURIComponent(ride.rideDetails.pickupLocation.pickupName || '')}&long=${ride.rideDetails.pickupLocation.coordinates[0]}&lat=${ride.rideDetails.pickupLocation.coordinates[1]}&to=${encodeURIComponent(ride.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${ride.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${ride.rideDetails.dropoffLocation.coordinates[1]}&isCheaper=false`}>
                            <div className={`w-full cursor-pointer py-4 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                                <div className='flex items-center justify-between px-4'>

                                   {!isToday(new Date(ride.rideDetails.date)) ? <h1 className='font-medium flex items-center gap-1'>{ride.status === 'ready' ? <Play size={18} /> : ride.status === 'started' ? <StopCircle size={18} /> : <Clock size={18} />} {ride.status === 'ready' ? 'Ready to Start' : ride.status === 'started' ? 'Started' : `Starting on ${formatDate(ride.rideDetails.date)} at ${ride.rideDetails.time}`}</h1> :  <h1 className='font-medium flex items-center gap-1'>{ride.status === 'ready' ? <Play size={18} /> : ride.status === 'started' ? <StopCircle size={18} /> : <Clock size={18} />} {ride.status === 'ready' ? 'Ready to Start' : ride.status === 'started' ? 'Started' : `Starting today at ${ride.rideDetails.time}`}</h1>}   

                                    <DropdownMenu>
                                        <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className={`outline-none cursor-pointer p-1 rounded-full ${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-[#f0f0f0]'} transition-all duration-200`}>
                                            <EllipsisVertical size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Pencil size={18} /> Edit Ride</DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><XCircle size={18} /> Cancel Ride</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                    <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                    <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                                </div>

                                <div className='py-2 text-sm px-3 mx-4 rounded-md bg-[#00563c34] text-[#fefefe] mt-4 w-fit'>
                                    <h1 className={`${toggleTheme ? 'text-[#009266]' : 'text-[#00563c]'} font-semibold`}>Your Fare: {Math.round(ride.budget.current_fare)}</h1>
                                </div>

                                <hr className={`${toggleTheme ? 'border-[#202020]' : ''} mt-4`} />

                                <div className={`px-4 text-sm flex items-center gap-1 mt-4 justify-between ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>

                                    <h1 className='flex items-center gap-1'><Users2 size={18} /> {ride.rideDetails.bookedSeats} booked seats</h1>

                                    <h1 className='flex items-center gap-1'>Duration: {Math.round(ride.rideDetails.duration)} mins</h1>

                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div>No rides found</div>
            )}
        </div>
    )
}

export default Taken_Upcoming_Rides