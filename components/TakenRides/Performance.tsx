import { StarIcon } from '@heroicons/react/16/solid'
import { Car, CheckCircle, ChevronDown, HelpCircle, Star, Timer } from 'lucide-react'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Component } from './Chart'
interface Details {
    user: any
}

const UserPerformance: React.FC<Details> = ({ user }) => {
    return (
        <div className='inter my-4 flex flex-col gap-5 text-[#202020] md:max-w-full w-full max-w-2xl mx-auto md:w-full'>

            {/* //performance */}
            <div className='gap-6 flex flex-col md:flex-row items-center'>
                <div className='bg-[#f0f0f0] w-full py-4 px-6 md:px-4 flex items-center md:items-start md:flex-col justify-between shadow-lg rounded-xl md:w-56 gap-3 sm:gap-0 h-[7.2em]'>
                    <h1 className='font-semibold text-[16px] sm:text-sm lg:text-[15px]'>Total rides taken</h1>

                    <div className='flex items-center gap-3 sm:gap-5'>
                        <Car className='w-13 lg:w-14 h-20' color='#202020' />
                        <h1 className='font-medium text-3xl lg:text-4xl'>15</h1>
                    </div>
                </div>

                <div className='bg-[#f0f0f0] flex-1 py-4 px-6 md:px-4 flex items-start flex-col justify-between shadow-lg rounded-xl w-full gap-3 md:gap-0 h-[7.2em]'>
                    <div className='flex justify-between w-full items-cneter gap-2'>
                        <h1 className='font-semibold text-start text-[15px] sm:text-sm lg:text-[15px]'>Favourite drivers</h1>

                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle size={20} color='#202020' />
                                    </TooltipTrigger>
                                    <TooltipContent className='w-36 text-center inter'>
                                        <p className='text-center'>List of drivers you’ve rated highly.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger className='w-full'>
                            <div className='flex justify-between cursor-pointer shadow-md items-center bg-[#ffffff] w-full pl-3 pr-6 py-2 rounded-3xl sm:items-center gap-2 font-medium'>
                                <div className='flex gap-2 items-center'>
                                    <div className='w-8 h-8 flex items-center justify-center rounded-full bg-[#00b37e] text-[#fefefe] font-medium'>M</div>
                                    <h1 className='flex flex-col sm:flex-row sm:items-center text-[13px] md:text-sm gap-0.5 sm:gap-2 font-medium'>Marcus Thompson <p className='font-normal flex items-center gap-0.5'>5<StarIcon className='w-4 h-4' color='#202020' /></p></h1>
                                </div>

                                <div>
                                    <h1 className='text-[#202020] text-[13px] md:text-sm'>See all</h1>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className='inter'>
                            <DialogHeader>
                                <DialogTitle className='inter'>Your favourite drivers</DialogTitle>

                            </DialogHeader>
                        </DialogContent>
                    </Dialog>

                </div>
            </div >

            {/* //ratings */}
            < div className='bg-[#f0f0f0] flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 sm:px-4 :py-3 rounded-xl shadow-lg w-full' >

                <div className='flex items-center gap-3 font-medium'>
                    <h1 className='text-[13px] md:text-sm lg:text-base'>Your rating: </h1>
                    <div className='flex items-center gap-1'>
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <Star className='w-[1.15rem] h-[1.15rem] text-[#202020]' />
                        <h1 className='text-sm ml-1.5 translate-y-[1px] md:translate-y-[0px] sm:ml-3 font-semibold'>4</h1>
                    </div>
                </div>

                <div className='h-6 bg-[#202020] hidden md:block w-[2px]'></div>

                <div className='flex md:items-center gap-2 font-medium'>
                    <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[#007ab3] text-[#fefefe] font-medium'>M</div>
                    <h1 className='flex flex-col sm:flex-row sm:items-center text-sm gap-0.5 sm:gap-2 font-medium'>Midona said <p className='font-normal'>"He was very kind during ride."</p></h1>
                </div>

            </div >

            {/* //chart */}
            <div>
                <Component />
            </div>

        </div >
    )
}

export default UserPerformance
