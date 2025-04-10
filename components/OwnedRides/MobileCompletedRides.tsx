'use client'
import { MapPinIcon, ChevronDoubleUpIcon, UserGroupIcon, StarIcon } from '@heroicons/react/16/solid'
import { Delete, Edit2, MoreVertical, Navigation } from 'lucide-react'
import React, { Dispatch } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FaComment, FaMoneyCheck, FaSpinner } from 'react-icons/fa'
interface Details {
    myRides: any[],
    getImage: (e: string) => string | undefined,
    getDate: (e: string) => string,
    setShowPax: Dispatch<React.SetStateAction<boolean>>,
}

const MobileCompletedRides: React.FC<Details> = ({ myRides, getDate, getImage, setShowPax }) => {

    return (
        <>

            {myRides.length != 0 && myRides.map((e, index) => {
                return (
                    <div key={index} className='py-6 pl-2 sm:p-6 flex flex-col gap-4'>

                        {/* image and options */}
                        <div className='flex justify-between items-center w-full'>
                            <img key={index} className='w-32' src={getImage(e.rideDetails.vehicle) || undefined} alt="" />

                            <DropdownMenu>
                                <DropdownMenuTrigger className='outline-none'>
                                    <MoreVertical size={25} className='cursor-pointer' color='#202020' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='-translate-x-10 sm:-translate-x-16 w-48 font-medium p-2 inter'>
                                    <DropdownMenuItem onClick={() => setShowPax(true)}>
                                        <FaComment size={20} color='#757575' /> Comments & Rating</DropdownMenuItem>
                                    <DropdownMenuItem><StarIcon className='w-6 h-6' color='#757575' /> Rate passengers</DropdownMenuItem>
                                    <DropdownMenuItem><FaSpinner size={15} color='#757575' /> Repeat ride</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* // locations */}
                        <div className='flex gap-3 md:gap-4 text-sm md:text-base flex-col mt-4'>

                            <h1 className='font-semibold flex items-start sm:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{e.rideDetails.pickupLocation.pickupName}</h1>

                            <h1 className='font-semibold flex items-start sm:items-center gap-2'><Navigation size={20} color='#202020' />{e.rideDetails.dropoffLocation.dropoffName}</h1>
                        </div>

                        {/* time */}
                        <div className='flex flex-col gap-2 mt-1'>
                            <h1 className='text-sm font-normal flex items-center gap-1'>Distance: <p className='font-medium'>{Math.round(e.rideDetails.duration)} kilometers</p></h1>
                            <h1 className='text-sm font-normal flex items-center gap-1'>Duration: <p className='font-medium'>{e.rideDetails.duration} mins</p></h1>
                        </div>

                        <div className='w-full flex justify-center mt-6'>
                            <button className='py-3 text-[#fefefe] cursor-pointer font-medium text-[14px] md:text-[15px] px-4 rounded-lg bg-[#00b37e] flex items-center gap-2'><FaMoneyCheck size={20} color='#fefefe' /> View earnings</button>
                        </div>

                        <hr className='mt-4' style={{ borderColor: '#f0f0f0' }} />

                    </div>
                )
            })}
        </>
    )
}

export default MobileCompletedRides
