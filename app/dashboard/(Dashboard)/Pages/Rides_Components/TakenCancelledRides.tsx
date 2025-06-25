import React, { Dispatch, SetStateAction, useState } from 'react'
import { isToday } from 'date-fns'
import { MapPinIcon, Navigation, Star, Trash, Users2, XCircle } from 'lucide-react'
import axios from 'axios'
import Loader from '@/components/Loader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Rate from '@/components/commonOnes/Rate'
import { rateUser } from '@/functions/function'

const TakenCancelledRides = ({ toggleTheme, user, rides, setRides }: { toggleTheme: boolean | undefined, user: any, rides: any, setRides: Dispatch<SetStateAction<any[]>> }) => {
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)
    const [open, setOpen] = useState(false)
    const [selectedRide, setSelectedRide] = useState<any>(null)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const formatDate = (date: string) => {
        const dateObj = new Date(date);

        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options)
        return formattedDate
    }

    const deleteRide = async (rideId: string) => {
        setLoader(true)
        try {

            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cancelled/rider/delete?rideId=${rideId}&userId=${user._id}`, {
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
                        {rides.map((ride: any, index: number) => (
                            <div key={index} className={`w-full pt-4 pb-2 rounded-xl ${toggleTheme ? 'border-[#202020] border' : 'border'} bg-transparent`}>

                                <div className='flex items-center justify-between px-4'>
                                    {!isToday(new Date(ride.rideDetails.date)) ? <h1 className='font-medium flex items-center gap-1'><XCircle size={18} /> Cancelled on {formatDate(ride.rideDetails.date)}</h1> : <h1 className='font-medium flex items-center gap-1'><XCircle size={18} /> Cancelled today</h1>}

                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        deleteRide(ride._id)
                                    }} className={`${toggleTheme ? 'text-[#fefefe] hover:bg-[#202020]' : 'text-[#202020] hover:bg-[#f0f0f0]'} p-1.5 rounded-full cursor-pointer transition-all duration-200`}><Trash size={18} /></button>
                                </div>

                                <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} px-4 flex flex-col gap-1 mt-4 text-sm font-medium`}>
                                    <h1 className='flex items-center gap-1'><Navigation size={18} /> {ride.rideDetails.pickupLocation.pickupName.split(',')[0] + ',' + ride.rideDetails.pickupLocation.pickupName.split(',')[1]}</h1>
                                    <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> {ride.rideDetails.dropoffLocation.dropoffName.split(',')[0] + ',' + ride.rideDetails.dropoffLocation.dropoffName.split(',')[1]}</h1>
                                </div>

                                <button className={`py-2 cursor-pointer text-sm px-3 mx-4 rounded-md bg-[#56000034] mt-4 w-fit ${toggleTheme ? 'text-[#ff7777]' : 'text-[#560000]'} font-semibold`}>Reason</button>

                                <hr className={`${toggleTheme ? 'border-[#202020]' : ''} mt-4`} />

                                <div className={`px-4 text-sm flex items-center mt-2 gap-1 justify-between ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                    <h1 className='flex items-center gap-1'><Users2 size={18} /> {ride.rideDetails.bookedSeats} joined</h1>
                                    <button
                                        className={`${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-[#f0f0f0]'} transition-all duration-200 cursor-pointer rounded-md flex items-center p-2 gap-1`}
                                        onClick={() => {
                                            setSelectedRide(ride)
                                            setOpen(true)
                                        }}
                                    >
                                        <Star color='yellow' fill='yellow' size={18} /> Rate Driver
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No rides found</div>
                )}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger />
                <DialogContent className={`max-h-[90vh] overflow-y-auto transition-all duration-500 ${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                    <DialogHeader>
                        <DialogTitle>Rate Driver</DialogTitle>
                        <div className='mt-4 min-h-[200px] flex flex-col transition-all duration-500'>
                            {selectedRide && (
                                <>
                                    <div className='flex items-center gap-3 mb-4'>
                                        {selectedRide.rideDetails.driverPhoto ? (
                                            <img className='w-9 h-9 rounded-full' src={selectedRide.rideDetails.driverPhoto} alt='' />
                                        ) : (
                                            <img src='/Images/user(1).png' alt='' className='w-9 h-9 rounded-full' />
                                        )}
                                        <div className='flex flex-col gap-0.5'>
                                            <h1 className='text-sm font-semibold'>{selectedRide.rideDetails.driverName || 'Driver'}</h1>
                                        </div>
                                    </div>
                                    <Rate toggleTheme={toggleTheme} rating={rating} setRating={setRating} comment={comment} setComment={setComment} />
                                    <div className='flex justify-end w-full gap-3 mt-6'>
                                        <Button className={`border ${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] border-[#353535] text-white' : 'bg-[#fefefe] hover:bg-[#f0f0f0]/90 border-[#f0f0f0] text-[#202020]'} transition-all cursor-pointer duration-200`} onClick={() => setOpen(false)}>Cancel</Button>
                                        <Button className='bg-[#00563c] hover:bg-[#00563c]/90 cursor-pointer text-white transition-all duration-300' onClick={() => rateUser({
                                            driverId: selectedRide.userId,
                                            userId: user._id,
                                            rating,
                                            review: comment,
                                            role: 'driver',
                                            setLoader,
                                            setMessage,
                                            setShowMessage,
                                            setStatusCode,
                                            onSuccess: () => {
                                                setOpen(false)
                                                setRating(0)
                                                setComment('')
                                            }
                                        })}>Rate</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TakenCancelledRides