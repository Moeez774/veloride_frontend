import { Car, Earth, Users } from 'lucide-react'
import React from 'react'

const LiveTracker = () => {
    return (
        <div className='grid max-w-md sm:max-w-5xl gap-6 mx-auto grid-cols-1 px-6 sm:px-10 lg:grid-cols-3' style={{ userSelect: 'none' }}>


            <div className='h-48 sm:h-40 lg:h-60 flex flex-col justify-center sm:flex-row lg:flex-col sm:justify-between lg:justify-normal gap-4 sm:gap-6 items-center px-10 lg:p-6 rounded-2xl shadow-lg w-full bg-[#fefefe]'>

                <div className='flex flex-col gap-2 sm:gap-3 items-center sm:items-start lg:items-center'>
                    <div>
                        <Earth color='#00b37e' size={50} />
                    </div>

                    <div>
                        <h1 className='exo2 font-semibold sm:text-lg text-[#00b37e]'>Carbon Emissions Reduced</h1>
                    </div>
                </div>

                <div>
                    <h1 className='inter font-bold text-4xl md:text-5xl text-[#00b37e]'>15,325KG</h1>
                </div>

            </div>

            <div className='h-48 sm:h-40 lg:h-60 flex flex-col justify-center sm:flex-row lg:flex-col sm:justify-between lg:justify-normal gap-4 sm:gap-6 items-center px-10 lg:p-6 rounded-2xl w-full shadow-lg bg-[#fefefe]'>
            <div className='flex flex-col gap-2 sm:gap-3 items-center sm:items-start lg:items-center'>
                    <div>
                        <Car color='#00b37e' size={50} />
                    </div>

                    <div>
                        <h1 className='exo2 font-semibold sm:text-lg text-[#00b37e]'>Successfull Rides</h1>
                    </div>
                </div>

                <div>
                    <h1 className='inter font-bold text-4xl md:text-5xl text-[#00b37e]'>7,450</h1>
                </div>
            </div>

            <div className='h-48 sm:h-40 lg:h-60 flex flex-col justify-center sm:flex-row shadow-lg lg:flex-col sm:justify-between lg:justify-normal gap-4 sm:gap-6 items-center px-10 lg:p-6 rounded-2xl w-full bg-[#fefefe]'>
            <div className='flex flex-col gap-2 sm:gap-3 items-center sm:items-start lg:items-center'>
                    <div>
                        <Users color='#00b37e' size={50} />
                    </div>

                    <div>
                        <h1 className='exo2 font-semibold sm:text-lg text-[#00b37e]'>Happy Riders Connected</h1>
                    </div>
                </div>

                <div>
                    <h1 className='inter font-bold text-4xl md:text-5xl text-[#00b37e]'>5,200</h1>
                </div>
            </div>


        </div>
    )
}

export default LiveTracker
