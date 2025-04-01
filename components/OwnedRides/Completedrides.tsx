'use client'
import { ChevronDoubleUpIcon, MapPinIcon, StarIcon, UserGroupIcon } from '@heroicons/react/16/solid'
import { MessageCircle, Navigation, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FaComment, FaMoneyCheck } from 'react-icons/fa'
import MobileCompletedRides from './MobileCompletedRides'
interface Details {
    user: any
}

const Completedrides: React.FC<Details> = ({ user }) => {

    const [myRides, setMyRides] = useState<any[]>([])
    const [showPax, setShowPax] = useState(false)

    useEffect(() => {
        if (!user) return

        const userRides = async () => {
            let a = await fetch('http://localhost:4000/rides/owned-rides', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user?._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) setMyRides(response.data)
            else alert(response.message)
        }

        userRides()
    }, [user])

    //for converting date string into valid format
    const getDate = (e: string) => {
        const date = new Date(e);
        const options = { year: "numeric", month: "long", day: "numeric" } as const;
        const formattedDate = date.toLocaleDateString('en-US', options)
        return formattedDate
    }

    //for taking image of specific ride vehicle
    const getImage = (e: string) => {
        switch (e) {
            case "Standard Car":
                return '/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon__1_-removebg-preview.png'
            case "SUV / Van":
                return '/Images/Screenshot_2025-03-23_090615_cleanup-removebg-preview.png'
            case "Luxury Car":
                return '/Images/vecteezy_luxury-car-side-view-silhouette-on-white-background_54072783_1_-removebg-preview.png'
            case "Electric Vehicle":
                return '/Images/Screenshot_2025-03-23_091233-removebg-preview.png'
        }
    }
    return (
        <>

            <div className='inter px-0 lg:px-2 xl:px-6 py-3'>
                {myRides.length === 0 && <div>
                    <div className='loader'></div>
                </div>}

                <div className='lg:hidden flex flex-col gap-6'>
                    <MobileCompletedRides setShowPax={setShowPax} getDate={getDate} getImage={getImage} myRides={myRides} />
                </div>

                <div className='hidden lg:flex flex-col gap-4'>
                    {myRides.length != 0 && myRides.map((e, index) => {
                        return (
                            <div key={index} className='flex flex-col gap-2'>

                                {/* //more detail */}
                                <div className='w-full flex items-center gap-2.5 justify-end'>
                                    <div className='inter flex items-center gap-2.5'>
                                        <h1 className='font-medium text-sm'>Comments & Rating</h1>

                                        {/* // for showing details of joined passengers */}
                                        <Dialog open={showPax} onOpenChange={() => setShowPax(!showPax)}>
                                            <DialogTrigger>
                                                <div onClick={() => setShowPax(true)} className='p-3 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#f7f3f3] bg-[#f0f0f0]'>
                                                    <FaComment size={20} color='#202020' />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className='inter'>Comments & Rating</DialogTitle>
                                                    <div className='mt-6 flex w-full justify-between items-start gap-2'>
                                                        <div className='inter flex gap-2'>
                                                            <div>
                                                                <div className='bg-[#00b37e] w-13 h-13 flex justify-center items-center rounded-full'>
                                                                    <h1 className='text-2xl text-[#fefefe]'>M</h1>
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-col gap-0'>
                                                                <h1 className='font-medium text-lg'>Moeez ur rehman</h1>
                                                                <h1 className='text-[13px]'>Seats reserved: 3</h1>

                                                                <div className='mt-2 flex items-center gap-2'>
                                                                    <h1 className='text-sm font-medium'>Rated: </h1>

                                                                    <div className='flex items-center gap-0.5'>
                                                                        <StarIcon className='w-4 h-4' color='#202020' />
                                                                        <StarIcon className='w-4 h-4' color='#202020' />
                                                                        <StarIcon className='w-4 h-4' color='#202020' />
                                                                        <StarIcon className='w-4 h-4' color='#202020' />
                                                                        <StarIcon className='w-4 h-4' color='#202020' />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='flex gap-4 items-center'>
                                                            <div className='p-3 cursor-pointer rounded-full bg-[#f0f0f0] transition-all duration-200 hover:bg-[#f7f3f3]'>
                                                                <Phone size='20' color='#202020' />
                                                            </div>
                                                            <div className='p-3 rounded-full transition-all duration-200 hover:bg-[#f7f3f3] cursor-pointer bg-[#f0f0f0]'>
                                                                <MessageCircle size='20' color='#202020' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>

                                    </div>
                                    <div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger><StarIcon color='#202020' className='cursor-pointer w-5 h-5' />
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-[#202020] text-[#fefefe] inter'>
                                                    Rate passengers</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between gap-2'>

                                    <div className='flex items-center gap-6'>
                                        <img className='w-28' src={getImage(e.rideDetails.vehicle)} alt="" />

                                        <div className='flex gap-4 text-sm flex-col'>

                                            <h1 className='font-semibold flex items-start xl:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{e.rideDetails.pickupLocation.pickupName}</h1>

                                            <h1 className='font-semibold flex xl:items-center gap-2'><Navigation size={20} color='#202020' />{e.rideDetails.dropoffLocation.dropoffName}</h1>
                                        </div>
                                    </div>

                                    <div className='flex text-[13px] xl:text-sm flex-col gap-4 items-end'>
                                        <h1 className='font-normal flex items-center gap-1'>Distance: <p className='font-medium'>{Math.round(e.rideDetails.distance)} km</p></h1>
                                        <h1 className='font-normal flex items-center gap-1'>Duration: <p className='font-medium'>{Math.round(e.rideDetails.duration)} mins</p></h1>
                                    </div>

                                </div>

                                {/* buttons */}
                                <div className='w-full mt-8 flex justify-between gap-4 items-center'>
                                    <button className='bg-[#fefefe] transition-all duration-200 active:bg-[#fefefe] px-10 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#00b37e] cursor-pointer  hover:bg-[#f0f0f0]'>Repeat ride</button>
                                    <button className='bg-[#00b37e] transition-all duration-200 active:bg-[#00b377] px-6 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#00b37dc2] flex items-center gap-2'><FaMoneyCheck size={20} color='#fefefe' /> View earnings</button>
                                </div>

                                <hr className='w-full mt-7' style={{ borderColor: '#f0f0f0' }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Completedrides
