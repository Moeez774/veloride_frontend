'use client'
import { MapPinIcon, Navigation, Users2, CreditCard, EllipsisVertical, Trash, Users, CheckCircle, Star, Dot } from 'lucide-react'
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
import { useFetch } from '@/components/hooks/useHooks/useFetch'
import { fetchWalletDetails } from '@/components/hooks/useHooks/useWallet'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const Taken_Completed_Rides = ({ toggleTheme, user, rides, setRides }: { toggleTheme: boolean | undefined, user: any, rides: any[], setRides: Dispatch<SetStateAction<any[]>> }) => {
    const { data, loading, error } = useFetch(() => fetchWalletDetails({ id: user?._id }))
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)
    const [open, setOpen] = useState(false)
    const [hovered, setHovered] = useState(0)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [selectedRide, setSelectedRide] = useState<any>(null)

    const formatDate = (date: string) => {
        const dateObj = new Date(date);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const deleteRide = async (rideId: string) => {
        setLoader(true)
        try {

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/completed/rider/delete?rideId=${rideId}&userId=${user._id}`, {
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

    const rateDriver = async (driverId: string) => {
        setLoader(true)
        try {

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/completed/rider/rate/driver`, {
                driverId: driverId,
                userId: user._id,
                rating: rating,
                review: comment
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            setStatusCode(res.data.statusCode)
            setMessage(res.data.message)
            setShowMessage(true)

            if (res.data.statusCode === 200) {
                setOpen(false)
                setRating(0)
                setComment('')
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

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                </DialogTrigger>
                <DialogContent className={`inter max-h-[90vh] overflow-y-auto ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#f0f0f0] text-[#202020]'} border-none`}>
                    <DialogHeader>
                        <DialogTitle>Rate driver</DialogTitle>

                        <div className='mt-2 flex flex-col'>

                            <p className={`w-full ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} mt-1 text-[13px]`}>Your feedback is valuable in helping us improve our service. Please take a moment to rate your driver.</p>

                            <div className='mt-6 w-full'>

                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = hovered >= star || (!hovered && rating >= star)
                                        return (
                                            <Star
                                                key={star}
                                                onMouseEnter={() => setHovered(star)}
                                                onMouseLeave={() => setHovered(0)}
                                                onClick={() => setRating(star)}
                                                className={`w-6 h-6 cursor-pointer transition-colors ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}
                                                fill={isFilled ? '#00563c' : 'none'}
                                            />
                                        )
                                    })}
                                </div>

                                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Write a review' className={`w-full mt-4 resize-none border h-[10em] ${toggleTheme ? 'border-[#353535]' : ''}`} />
                            </div>

                        </div>
                    </DialogHeader>
                    <DialogFooter className='mt-6'>
                        <Button className={`border ${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] border-[#353535] text-white' : 'bg-[#fefefe] hover:bg-[#f0f0f0]/90 border-[#f0f0f0] text-[#202020]'} transition-all cursor-pointer duration-200`} onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className='bg-[#00563c] hover:bg-[#00563c]/90 cursor-pointer text-white' onClick={() => rateDriver(selectedRide.userId)}>Rate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className='mt-8'>
                {rides && rides.length > 0 && !loading && !error ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {rides.map((ride, index) => (
                            ride && <div key={index} className={`w-full py-4 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                                <div className='flex items-center justify-between px-4'>
                                    {!isToday(new Date(ride.rideDetails?.date)) ? <h1 className='font-medium flex items-center gap-1'><CheckCircle size={18} /> Completed on {formatDate(ride.rideDetails?.date)}</h1> : <h1 className='font-medium flex items-center gap-1'><CheckCircle size={18} /> Completed today</h1>}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={`outline-none cursor-pointer p-1 rounded-full ${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-[#f0f0f0]'} transition-all duration-200`}>
                                            <EllipsisVertical size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedRide(ride)
                                                setOpen(true)
                                            }} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Users size={18} /> Rate Driver</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteRide(ride._id)} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Trash size={18} /> Delete Ride</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                    <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                    <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                                </div>

                                <div className='py-2 text-sm px-3 mx-4 rounded-md bg-[#00563c34] text-[#fefefe] mt-4 w-fit'>
                                    {data?.pendingTransactions.find((transaction: any) => transaction.rideId === ride._id) ? <Link href={`/checkout?rideId=${ride._id}&amount=${Math.round(ride.budget.current_fare)}&by=${user?._id}&to=${ride.userId}`}><h1 className={`${toggleTheme ? 'text-[#009266]' : 'text-[#00563c]'} font-semibold cursor-pointer`}>Pay now</h1></Link> : (
                                        <h1 className={`${toggleTheme ? 'text-[#009266]' : 'text-[#00563c]'} font-semibold`}>Fare Paid: {Math.round(ride.budget.current_fare)}</h1>
                                    )}
                                </div>

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

export default Taken_Completed_Rides