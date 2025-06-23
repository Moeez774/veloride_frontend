'use client'
import { MapPinIcon, Navigation, Users2, CreditCard, EllipsisVertical, Trash, Users, XCircle } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios'
import Loader from '@/components/Loader'
import { isToday } from 'date-fns'

const CancelledRides = ({ toggleTheme, rides, setRides }: { toggleTheme: boolean | undefined, rides: any[], setRides: Dispatch<SetStateAction<any[]>> }) => {
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)

    const formatDate = (date: string) => {
        const dateObj = new Date(date);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const deleteRide = async (rideId: string) => {
        setLoader(true)
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cancelled/delete?rideId=${rideId}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            setStatusCode(res.data.statusCode)
            setMessage(res.data.message)
            setShowMessage(true)

            if (res.data.statusCode === 200) {
                setRides(res.data.data)
            }
        } catch (err: any) {
            setStatusCode(err.response.data.statusCode)
            setMessage(err.response.data.message)
            setShowMessage(true)
        }
    }

    return (
        <>

            {loader && <Loader setLoader={setLoader} message={message} showMessage={showMessage} setShowMessage={setShowMessage} statusCode={statusCode} />}

            <div className='mt-8'>
                {rides && rides.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {rides.map((ride, index) => (
                            <div key={index} className={`w-full py-4 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                                <div className='flex items-center justify-between px-4'>
                          { !isToday(new Date(ride.rideDetails.date)) ? <h1 className='font-medium flex items-center gap-1'><XCircle size={18} /> Cancelled on {formatDate(ride.rideDetails.date)}</h1> : <h1 className='font-medium flex items-center gap-1'><XCircle size={18} /> Cancelled today</h1>}

                            <button onClick={(e) => {
                                e.stopPropagation()
                                deleteRide(ride._id)
                            }} className={`${toggleTheme? 'text-[#fefefe] hover:bg-[#202020]': 'text-[#202020] hover:bg-[#f0f0f0]'} p-1.5 rounded-full cursor-pointer transition-all duration-200`}><Trash size={18} /></button>
                                </div>

                                <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                    <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                    <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                                </div>

                                <button className={`py-2 cursor-pointer text-sm px-3 mx-4 rounded-md bg-[#56000034] mt-4 w-fit ${toggleTheme ? 'text-[#ff7777]' : 'text-[#560000]'} font-semibold`}>Provide Reason</button>

                                <hr className={`${toggleTheme ? 'border-[#202020]' : ''} mt-4`} />

                                <div className={`px-4 text-sm flex items-center gap-1 mt-4 justify-between ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>

                                    <h1 className='flex items-center gap-1'><Users2 size={18} /> {ride.rideDetails.bookedSeats} joined</h1>

                                    <h1 className='flex items-center gap-1'><CreditCard size={18} />Total: PKR {ride.budget.totalBudget}</h1>

                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No rides found</div>
                )}
            </div>
        </>
    )
}

export default CancelledRides