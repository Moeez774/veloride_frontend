'use client'
import { MapPinIcon, ChevronDoubleUpIcon, UserGroupIcon, StarIcon } from '@heroicons/react/16/solid'
import { Car, Delete, Edit2, MessageCircle, MoreVertical, Navigation, Phone, Share2 } from 'lucide-react'
import React, { Dispatch } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Checkbox from '@/components/hooks/Checkbox'
interface Details {
    myRides: any[],
    getImage: (e: string) => string | undefined,
    drivers: any,
    isPreferred: boolean[],
    setIsPreferred: Dispatch<React.SetStateAction<boolean[]>>
}

const MobileUpcomingRides: React.FC<Details> = ({ myRides, getImage, drivers, isPreferred, setIsPreferred }) => {

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

                                <div className='flex flex-col gap-1'>
                                    <h1 className='text-base font-medium flex items-center gap-1'>Driver <p className='text-xs font-normal'>({drivers[e.userId]?.fullname})</p></h1>

                                    <div className='flex items-center gap-2'>
                                        <Checkbox
                                            text='Mark as preferred driver'
                                            item={isPreferred[index]}
                                            setter={(value) =>
                                                setIsPreferred((prev) => {
                                                    const updated = [...prev];
                                                    updated[index] = Boolean(value);
                                                    return updated;
                                                })
                                            }
                                        />
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
                            <h1 className='text-sm font-normal flex items-center gap-1'>Distance: <p className='font-medium'>{Math.round(e.rideDetails.distance)} km</p></h1>
                            <h1 className='text-sm font-normal flex items-center gap-1'>Duraction: <p className='font-medium'>{Math.round(e.rideDetails.duration)} mins</p></h1>
                        </div>

                        <div className='w-full mt-8 flex justify-between gap-4 items-center'>
                            <h1 className='font-medium flex items-center gap-1 text-sm'>Cost: <p className='font-semibold text-[15px]'>Rs.430</p></h1>

                            <div className='flex items-center gap-2'>
                                <button className='bg-[#f0f0f0] transition-all duration-200 active:bg-[#00b377] w-10 h-10 rounded-full exo2 font-semibold shadow-md cursor-pointer hover:bg-[#f7f3f3] flex justify-center items-center'><StarIcon className='w-5 h-5' color='#202020' /></button>
                                <h1 className='text-[#202020] text-[15px] font-medium'>Rate driver</h1>
                            </div>
                        </div>


                        <hr className='mt-4' style={{ borderColor: '#f0f0f0' }} />

                    </div>
                )
            })}
        </>
    )
}

export default MobileUpcomingRides
