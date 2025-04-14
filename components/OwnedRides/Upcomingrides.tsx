'use client'
import { ChevronDoubleUpIcon, MapPinIcon, StarIcon, UserGroupIcon } from '@heroicons/react/16/solid'
import { MessageCircle, Navigation, Phone, Delete, Edit2, MoreVertical } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
interface Details {
    user: any,
    getImage: (e: string) => string | undefined
}

const Upcomingrides: React.FC<Details> = ({ user, getImage }) => {

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

    return (
        <>

            <div className='inter lg:px-2 xl:px-6 py-3'>
                {myRides.length === 0 && <div>
                    <div className='loader'></div>
                </div>}

                {/* //for mobiles */}
                <div className='lg:hidden flex flex-col gap-6'>
                    {myRides.length != 0 && myRides.map((e, index) => {
                        return (
                            <div key={index} className='py-6 px-1.5 sm:p-6 flex flex-col gap-4'>

                                {/* image and options */}
                                <div className='flex justify-between items-center w-full'>
                                    <img key={index} className='w-32' src={getImage(e.rideDetails.vehicle) || undefined} alt="" />

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className='outline-none'>
                                            <MoreVertical size={25} className='cursor-pointer' color='#202020' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='-translate-x-10 sm:-translate-x-16 w-36 font-medium p-2 inter'>
                                            <DropdownMenuItem onClick={() => setShowPax(true)}>
                                                <UserGroupIcon className='w-6 h-6' color='#202020' /> Joined pax</DropdownMenuItem>
                                            <DropdownMenuItem><Edit2 size={15} color='#757575' /> Edit ride</DropdownMenuItem>
                                            <DropdownMenuItem><Delete size={15} color='#757575' /> Delete ride</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* // locations */}
                                <div className='flex gap-3 md:gap-4 text-sm md:text-base flex-col mt-2'>

                                    <h1 className='font-semibold flex items-start sm:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{e.rideDetails.pickupLocation.pickupName}</h1>

                                    <h1 className='font-semibold flex items-start sm:items-center gap-2'><Navigation size={20} color='#202020' />{e.rideDetails.dropoffLocation.dropoffName}</h1>
                                </div>

                                {/* time */}
                                <div className='flex flex-col gap-2 mt-1'>
                                    <h1 className='text-sm font-normal flex items-center gap-1'>Date: <p className='font-medium'>{getDate(e.rideDetails.date) || ''}</p></h1>
                                    <h1 className='text-sm font-normal flex items-center gap-1'>Time: <p className='font-medium'>{e.rideDetails.time}</p></h1>
                                </div>

                                <div className='w-full flex justify-center mt-6'>
                                    <Link prefetch={false} href={`/ride-detail/${e._id}?from=${encodeURIComponent(e.rideDetails.pickupLocation.pickupName || '')}&long=${e.rideDetails.pickupLocation.coordinates[0]}&lat=${e.rideDetails.pickupLocation.coordinates[0]}&to=${encodeURIComponent(e.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${e.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${e.rideDetails.pickupLocation.coordinates[0]}&isBest=false`} ><button className='py-3 font-medium text-[14px] md:text-[15px] px-4 rounded-lg bg-[#e6e6e6] flex items-center cursor-pointer gap-1'>Ride Details <ChevronDoubleUpIcon className='w-5 h-5 rotate-45' color='#202020' /> </button></Link>
                                </div>
                                <hr className='mt-4' style={{ borderColor: '#f0f0f0' }} />
                            </div>
                        )
                    })}
                </div>

                {/* //for pcs */}
                <div className='hidden lg:flex flex-col gap-4'>
                    {myRides.length != 0 && myRides.map((e, index) => {
                        return (
                            <div key={index} className='flex flex-col gap-2'>

                                {/* //more detail */}
                                <div className='w-full flex items-center gap-2.5 justify-end'>
                                    <div className='inter flex items-center gap-2.5'>
                                        <h1 className='font-medium text-sm'>Joined pax</h1>

                                        {/* // for showing details of joined passengers */}
                                        <Dialog open={showPax} onOpenChange={() => setShowPax(!showPax)}>
                                            <DialogTrigger>
                                                <div onClick={() => setShowPax(true)} className='p-3 rounded-full cursor-pointer transition-all duration-200 hover:bg-[#f7f3f3] bg-[#f0f0f0]'>
                                                    <UserGroupIcon color='#202020' className='w-6 h-6' />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className='inter'>Joined Passengers</DialogTitle>
                                                    <div className='mt-6 flex w-full justify-between items-start gap-2'>
                                                        <div className='inter flex gap-2'>
                                                            <div>
                                                                <div className='bg-[#00b37e] w-13 h-13 flex justify-center items-center rounded-full'>
                                                                    <h1 className='text-2xl text-[#fefefe]'>M</h1>
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-col gap-0'>
                                                                <h1 className='font-medium text-lg'>Moeez ur rehman</h1>
                                                                <h1 className='text-[13px] text-start'>Seats reserved: 3</h1>

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

                                                        <div className='flex flex-col gap-4 items-center'>
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
                                                <Link prefetch={false} href={`/ride-detail/${e._id}?from=${encodeURIComponent(e.rideDetails.pickupLocation.pickupName || '')}&long=${e.rideDetails.pickupLocation.coordinates[0]}&lat=${e.rideDetails.pickupLocation.coordinates[0]}&to=${encodeURIComponent(e.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${e.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${e.rideDetails.pickupLocation.coordinates[0]}&isBest=false`} ><TooltipTrigger><ChevronDoubleUpIcon color='#202020' className='cursor-pointer w-6 h-6 rotate-45' />
                                                </TooltipTrigger></Link>
                                                <TooltipContent className='bg-[#202020] text-[#fefefe] inter'>
                                                    Ride details</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between gap-2'>

                                    <div className='flex items-center gap-6'>
                                        <img className='w-28' src={getImage(e.rideDetails.vehicle)} alt="" />

                                        <div className='flex gap-4 text-sm flex-col'>

                                            <h1 className='font-semibold flex xl:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{e.rideDetails.pickupLocation.pickupName}</h1>

                                            <h1 className='font-semibold flex xl:items-center gap-2'><Navigation size={20} color='#202020' />{e.rideDetails.dropoffLocation.dropoffName}</h1>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-4 items-end'>
                                        <h1 className='text-sm font-normal flex items-center gap-1'>Date: <p className='font-medium'>{getDate(e.rideDetails.date)}</p></h1>
                                        <h1 className='text-sm font-normal flex items-center gap-1'>Time: <p className='font-medium'>{e.rideDetails.time}</p></h1>
                                    </div>

                                </div>

                                {/* buttons */}
                                <div className='w-full mt-8 flex justify-between gap-4 items-center'>
                                    <button className='bg-[#fefefe] transition-all duration-200 active:bg-[#fefefe] px-10 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#00b37e] cursor-pointer  hover:bg-[#f0f0f0]'>Edit ride</button>
                                    <button className='bg-[#fd2020] transition-all duration-200 active:bg-[#fd2020e3] px-8 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#fd2020c5]'>Delete ride</button>
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

export default Upcomingrides
