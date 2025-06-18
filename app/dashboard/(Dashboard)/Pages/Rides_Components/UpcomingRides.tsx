'use client'
import { useAuth } from '@/context/AuthProvider'
import { MapPinIcon, Navigation, Users2, CreditCard, EllipsisVertical, Pencil, XCircle } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const UpcomingRides = ({ toggleTheme, rides, setRides }: { toggleTheme: boolean | undefined, rides: any[], setRides: Dispatch<SetStateAction<any[]>> }) => {
    const [isHovered, setHovered] = useState(false)
    const authContext = useAuth()
    const user = authContext?.user

    useEffect(() => {
        if (!user) return
        const fetchRides = async () => {

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomings/rides?userId=${user._id}`, {
                    method: "GET", headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json()

                if (data.statusCode === 200) {
                    setRides(data.data)
                }
                else {
                    alert(data.message)
                }
            } catch (err: any) {
                alert(err.message)
            }
        }

        fetchRides()
    }, [user])

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
                        <div key={index} className={`w-full py-4 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                            <div className='flex items-center justify-between px-4'>
                                <h1 className='font-medium'>Starting on {formatDate(ride.rideDetails.date)} at {ride.rideDetails.time}</h1>

                                <DropdownMenu>
                                    <DropdownMenuTrigger className={`outline-none cursor-pointer p-1 rounded-full ${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-[#f0f0f0]'} transition-all duration-200`}>
                                        <EllipsisVertical size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                                        <DropdownMenuItem className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Pencil size={18} /> Edit Ride</DropdownMenuItem>
                                        <DropdownMenuItem className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><XCircle size={18} /> Cancel Ride</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                            </div>

                            <div className='py-2 text-sm px-3 mx-4 rounded-md bg-[#00563c34] text-[#fefefe] mt-4 w-fit'>
                                <h1 className={`${toggleTheme ? 'text-[#009266]' : 'text-[#00563c]'} font-semibold`}>Fare: {Math.round(ride.budget.current_fare)}</h1>
                            </div>

                            <hr className={`${toggleTheme ? 'border-[#202020]' : ''} mt-4`} />

                            <div className={`px-4 text-sm flex items-center gap-1 mt-4 justify-between ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>

                                <h1 className='flex items-center gap-1'><Users2 size={18} /> {ride.rideDetails.bookedSeats} booked seats</h1>

                                <h1 className='flex items-center gap-1'><CreditCard size={18} />Total: PKR {ride.budget.totalBudget}</h1>

                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div>No rides found</div>
            )}
        </div>
    )
}

export default UpcomingRides