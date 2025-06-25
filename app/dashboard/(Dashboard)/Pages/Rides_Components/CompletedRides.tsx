'use client'
import { MapPinIcon, Navigation, Users2, CreditCard, EllipsisVertical, Trash, Users, CheckCircle, Star } from 'lucide-react'
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import Rate from '@/components/commonOnes/Rate'
import { rateUser } from '@/functions/function'

const CompletedRides = ({ toggleTheme, rides, setRides, user }: { toggleTheme: boolean | undefined, rides: any[], setRides: Dispatch<SetStateAction<any[]>>, user: any }) => {
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)
    const [open, setOpen] = useState(false)
    const [selectedRide, setSelectedRide] = useState<any>(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [selectedPassenger, setSelectedPassenger] = useState<any>(null)

    const formatDate = (date: string) => {
        const dateObj = new Date(date);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const deleteRide = async (rideId: string) => {
        setLoader(true)
        try {

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/completed/delete?rideId=${rideId}`, {
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

            <div className='absolute'>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                    </DialogTrigger>
                    <DialogContent className={`max-h-[90vh] overflow-y-auto transition-all duration-500 ${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                        <DialogHeader>
                            <DialogTitle>Rate Passengers</DialogTitle>
                            <div className='mt-4 min-h-[300px] flex flex-col transition-all duration-500'>
                                {!selectedPassenger && selectedRide && (
                                    <div className='w-full transition-all duration-500'>
                                        {selectedRide.passengers.map((passenger: any, index: number) => (
                                            <div key={index} className={`flex justify-between border-b pb-4 ${toggleTheme ? 'border-[#353535]' : ''} transition-all duration-500`}>
                                                <div className='flex items-center gap-2'>
                                                    {passenger.photo !== "" ? (
                                                        <div>
                                                            <img className={`w-9 transition-all duration-200 rounded-full`} src={passenger.photo || undefined} alt="" />
                                                        </div>
                                                    ) : (
                                                        <img src="/Images/user(1).png" alt="" className='w-9 transition-all duration-200 rounded-full' />
                                                    )}
                                                    <div className='flex flex-col gap-0.5'>
                                                        <h1 className='text-sm font-medium'>{passenger.fullname}</h1>
                                                        <p className='flex items-center gap-1 text-xs'><Star size={15} color='yellow' fill='yellow' /> {passenger.rating.toFixed(1)}</p>
                                                    </div>
                                                </div>
                                                <Button className='bg-[#00563c] cursor-pointer text-sm text-white mt-2 hover:bg-[#00563c]/80 transition-all duration-300' onClick={() => setSelectedPassenger(passenger)}>Rate</Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedPassenger && (
                                    <div className='w-full flex flex-col animate-fade-in transition-all duration-500'>
                                        <div className='flex items-center gap-3 mb-4'>
                                            {selectedPassenger.photo !== "" ? (
                                                <img className={`w-9 transition-all duration-200 rounded-full`} src={selectedPassenger.photo || undefined} alt="" />
                                            ) : (
                                                <img src="/Images/user(1).png" alt="" className='w-9 transition-all duration-200 rounded-full' />
                                            )}
                                            <div className='flex flex-col gap-0.5'>
                                                <h1 className='text-sm font-semibold'>{selectedPassenger.fullname}</h1>
                                                <p className='flex items-center gap-1 text-xs'><Star size={15} color='yellow' fill='yellow' /> {selectedPassenger.rating.toFixed(1)}</p>
                                            </div>
                                        </div>
                                        <Rate toggleTheme={toggleTheme} rating={rating} setRating={setRating} comment={comment} setComment={setComment} />
                                        <div className='flex justify-end w-full gap-3 mt-6'>
                                            <Button className={`border ${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] border-[#353535] text-white' : 'bg-[#fefefe] hover:bg-[#f0f0f0]/90 border-[#f0f0f0] text-[#202020]'} transition-all cursor-pointer duration-200`} onClick={() => setSelectedPassenger(null)}>Back to all passengers</Button>
                                            <Button className='bg-[#00563c] hover:bg-[#00563c]/90 cursor-pointer text-white transition-all duration-300' onClick={() => rateUser({
                                                driverId: selectedPassenger.userId,
                                                userId: user._id,
                                                rating,
                                                review: comment,
                                                role: 'passenger',
                                                setLoader,
                                                setMessage,
                                                setShowMessage,
                                                setStatusCode,
                                                onSuccess: () => {
                                                    setSelectedPassenger(null);
                                                    setRating(0);
                                                    setComment('');
                                                }
                                            })}>Rate</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='mt-8'>
                {rides && rides.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {rides.map((ride, index) => (
                            <div key={index} className={`w-full py-4 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                                <div className='flex items-center justify-between px-4'>
                                    {!isToday(new Date(ride.rideDetails.date)) ? <h1 className='font-medium flex items-center gap-1'><CheckCircle size={18} /> Completed on {formatDate(ride.rideDetails.date)}</h1> : <h1 className='font-medium flex items-center gap-1'><CheckCircle size={18} /> Completed today</h1>}

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className={`outline-none cursor-pointer p-1 rounded-full ${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-[#f0f0f0]'} transition-all duration-200`}>
                                            <EllipsisVertical size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedRide(ride)
                                                setOpen(true)
                                            }} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Users size={18} /> Rate Passengers</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteRide(ride._id)} className={`cursor-pointer ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'} flex items-center gap-1`}><Trash size={18} /> Delete Ride</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                    <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                    <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                                </div>

                                <div className='py-2 text-sm px-3 mx-4 rounded-md bg-[#00563c34] text-[#fefefe] mt-4 w-fit'>
                                    <h1 className={`${toggleTheme ? 'text-[#009266]' : 'text-[#00563c]'} font-semibold`}>Fare Paid: {Math.round(ride.budget.current_fare)} (per seat)</h1>
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

export default CompletedRides