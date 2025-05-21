import { StarIcon } from '@heroicons/react/16/solid'
import { Car, CheckCircle, Timer } from 'lucide-react'
import React from 'react'
import { Component } from './Chart'
interface Details {
    user: any
}

const Performance: React.FC<Details> = ({ user }) => {

    const performances = [{ heading: 'Total rides completed', value: 21, icon: <Car className='w-13 lg:w-14 h-20' color='#202020' /> }, { heading: 'Ride acceptance rate', value: 4.6, icon: <CheckCircle className='w-10 lg:w-12 h-20' color='#202020' /> }, { heading: 'On-time pickup rate', value: 3.9, icon: <Timer className='w-11 lg:w-12 h-20' color='#202020' /> }]

    return (
        <div className='inter my-4 flex flex-col gap-5 text-[#202020] sm:max-w-full w-full max-w-2xl mx-auto sm:w-full'>

            {/* //performance */}
            <div className='grid gap-6 grid-cols-1 px-4 sm:px-0 sm:grid-cols-3'>

                {performances.map((e, index) => {
                    return (
                        <div key={index} className='bg-[#f0f0f0] py-4 px-6 sm:px-4 flex items-center sm:items-start sm:flex-col justify-between shadow-lg rounded-xl w-full gap-3 sm:gap-0 h-[7.2em]'>
                            <h1 className='font-semibold text-[16px] sm:text-sm lg:text-[15px]'>{e.heading}</h1>

                            <div className='flex items-center gap-3 sm:gap-5'>
                                {e.icon}
                                <h1 className='font-medium text-3xl lg:text-4xl'>{e.value}</h1>
                            </div>
                        </div>
                    )
                })}

            </div>

            {/* //ratings */}
            <div className='bg-[#f0f0f0] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:px-4 :py-3 rounded-xl shadow-lg w-full'>

                <div className='flex items-center gap-3 font-medium'>
                    <h1 className='text-sm lg:text-base'>Your rating: </h1>
                    <div className='flex items-center gap-1'>
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <StarIcon className='text-[#202020] w-5 h-5' />
                        <h1 className='text-sm ml-1.5 translate-y-[1px] sm:translate-y-[0px] sm:ml-3 font-semibold'>5</h1>
                    </div>
                </div>

                <div className='h-6 bg-[#202020] hidden sm:block w-[2px]'></div>

                <div className='flex sm:items-center gap-2 font-medium'>
                    <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[#00b37e] text-[#fefefe] font-medium'>M</div>
                    <h1 className='flex flex-col sm:flex-row sm:items-center text-sm gap-0.5 sm:gap-2 font-medium'>Marcus said <p className='font-normal'>"His ride was very smooth for traveling."</p></h1>
                </div>
            </div>

            {/* //chart */}
            <div>
                <Component />
            </div>
        </div>
    )
}

export default Performance
