'use client'
import { MapPinIcon, ChevronDoubleUpIcon, UserGroupIcon, StarIcon } from '@heroicons/react/16/solid'
import { Car, Delete, Edit2, MessageCircle, MoreVertical, Navigation, Phone, Share2 } from 'lucide-react'
import React, { Dispatch } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
interface Details {
    myRides: any[],
    getImage: (e: string) => string | undefined,
    getDate: (e: string) => string,
    drivers: any
}

const MobileUpcomingRides: React.FC<Details> = ({ myRides, getDate, getImage, drivers }) => {

    return (
        <>

            {myRides.length != 0 && myRides.map((e, index) => {
                return (
                    <div key={index} className='py-6 px-1.5 sm:p-6 flex flex-col gap-4'>

                        {/* driver's info */}
                        <div className='flex justify-between gap-2 mb-2 items-center'>
                            <div className='flex gap-2'>
                                {drivers[e.userId]?.photo?.startsWith("hsl") && (
                                    <div className={`rounded-full flex justify-center items-center text-white w-9 h-9`} style={{ background: drivers[e.userId]?.photo }}>
                                        <h1 className='inter md:text-lg'>{drivers[e.userId]?.fullname?.charAt(0).toUpperCase()}</h1>
                                    </div>
                                )}

                                {/* user with profile */}
                                {!drivers[e.userId]?.photo?.startsWith("hsl") && (
                                    <div>
                                        <img className={`w-9 transition-all duration-200 rounded-full`} src={drivers[e.userId]?.photo || undefined} alt="" />
                                    </div>
                                )}

                                <div className='flex flex-col'>
                                    <h1 className='text-base font-medium flex items-center gap-1'>Driver <p className='text-xs font-normal'>({drivers[e.userId]?.fullname})</p></h1>

                                    <div className='flex items-center gap-2'>
                                        <div className='flex items-center gap-0.5'>
                                            <h1 className='text-xs font-medium'>Rated: 5</h1>
                                            <StarIcon className='w-3 h-3' color='#202020' />
                                        </div>
                                        <div className='w-[1px] h-4 bg-[#202020]'></div>
                                        <div>
                                            <h1 className='flex items-center text-xs font-medium gap-0.5'><Car size={20} color='#202020' /> {e.rideDetails.vehicle} </h1>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className='flex gap-2 ml-1.5 items-center'>
                                <div className='p-2.5 cursor-pointer rounded-full bg-[#f0f0f0] transition-all duration-200 hover:bg-[#f7f3f3]'>
                                    <Phone size='18' color='#202020' />
                                </div>
                                <div className='p-2.5 rounded-full transition-all duration-200 hover:bg-[#f7f3f3] cursor-pointer bg-[#f0f0f0]'>
                                    <MessageCircle size='18' color='#202020' />
                                </div>
                            </div>

                        </div>

                        {/* image and options */}
                        <div className='flex justify-between items-center w-full'>
                            <img key={index} className='w-32' src={getImage(e.rideDetails.vehicle) || undefined} alt="" />
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

                        <div className='w-full mt-8 flex justify-between gap-4 items-center'>
                            <div className='flex gap-2 items-center'>
                                <div className='bg-[#e0e0e0] cursor-pointer hover:bg-[#e9e9e9] transition-all duration-200 p-2.5 rounded-full'>
                                    <Share2 size={18} color='#202020' />
                                </div>
                                <h1 className='text-sm font-medium'>Share ride</h1>
                            </div>
                            <button className='bg-[#fd2020] transition-all duration-200 active:bg-[#fd2020e3] px-6 sm:px-8 py-2.5 sm:py-3 exo2 font-semibold text-sm sm:text-[15px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#fd2020c5]'>Cancel ride</button>
                        </div>


                        <hr className='mt-4' style={{ borderColor: '#f0f0f0' }} />

                    </div>
                )
            })}
        </>
    )
}

export default MobileUpcomingRides
