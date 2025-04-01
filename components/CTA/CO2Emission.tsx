import Link from 'next/link'
import React from 'react'

const CO2Emission = () => {

    return (
        <>
            <div className='flex flex-col items-center gap-24 mx-6 sm:mx-12 md:mx-16 lg:mx-28'>

                <div className='w-full flex flex-col-reverse md:flex-row text-[#202020] md:justify-between gap-6 md:gap-16 items-center'>

                    <div className='flex-1 max-w-xl items-center md:items-start flex flex-col gap-8 md:gap-10'>

                        <div className='flex flex-col items-center md:items-start w-full gap-2'>

                            <h1 className='exo2 text-3xl lg:text-4xl font-semibold text-center md:text-start flex items-center gap-2'>Find Your Perfect Ride, Instantly!</h1>

                            <h1 className='text-sm text-center text-[#202020] md:text-start inter'>Our advanced AI-powered system matches you with the best drivers based on your location, preferences, and real-time traffic. Enjoy rides that fit your style!</h1>
                        </div>

                        <div className='md:w-64 lg::w-96'>
                            <Link href='/auth/sign-in' ><button className={`exo2 active:duration-200 text-[#fefefe] rounded-md bg-[#00B37E] shadow-lg font-bold hover:bg-[#00b37dde] active:bg-[#00b368de] text-sm lg:text-base px-10 py-3 cursor-pointer transition-all duration-300`} >Find Your Ride Now!</button></Link>
                        </div>

                    </div>

                    <div>
                        <img loading='lazy' className='max-w-lg w-full' src="/Images/Flux_Dev_An_engaging_futuristic_illustration_showcasing_a_smar_2.jpeg" alt="" />
                    </div>

                </div>

                <div className='flex justify-center items-center mb-32 flex-col mx-4 md:mx-10 max-w-xl'>

                    <div>
                        <svg width="200" height="200" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" fill="none">

                            <circle cx="150" cy="150" r="80" fill="#FFFFFF" stroke="#202020" strokeWidth="8" />
                            <rect x="135" y="110" width="30" height="70" rx="15" fill="#202020" />
                            <rect x="140" y="180" width="20" height="30" rx="10" fill="#202020" />

                            <path d="M170 120 Q180 130 170 140" stroke="#202020" strokeWidth="4" fill="none" />
                            <path d="M180 110 Q200 130 180 150" stroke="#202020" strokeWidth="4" fill="none" />
                            <path d="M190 100 Q220 130 190 160" stroke="#202020" strokeWidth="4" fill="none" />

                            <path d="M130 120 Q120 130 130 140" stroke="#202020" strokeWidth="4" fill="none" />
                            <path d="M120 110 Q100 130 120 150" stroke="#202020" strokeWidth="4" fill="none" />
                            <path d="M110 100 Q80 130 110 160" stroke="#202020" strokeWidth="4" fill="none" />

                        </svg>
                    </div>

                    <div className='flex flex-col gap-3'>
                        <h1 className='exo2 text-center text-xl md:text-2xl font-semibold'>Try our future-ready Voice Booking! Just say where you want to go, and we'll handle the rest.</h1>

                        <h1 className='text-center inter md:text-lg'>Coming Soon: Talk. Ride. Go!</h1>
                    </div>

                </div>

            </div>

            <div className='flex flex-col gap-32 mx-6 sm:mx-12 md:mx-16 lg:mx-28'>

                <div className='w-full flex flex-col md:flex-row justify-between items-center text-[#202020] gap-6 md:gap-16'>

                    <div>
                        <img loading='lazy' className='max-w-lg w-full' src="/Images/Flux_Dev_A_dynamic_futuristic_illustration_featuring_an_intell_1.jpeg" alt="" />
                    </div>

                    <div className='flex-1 max-w-xl items-center md:items-start flex flex-col gap-8 md:gap-10'>

                        <div className='flex flex-col items-center md:items-start w-full gap-2'>

                            <h1 className='exo2 text-center md:text-start text-3xl lg:text-4xl font-semibold flex items-center gap-2'>Efficient Rides, Every Time!</h1>

                            <h1 className='text-sm text-center md:text-start text-[#202020] inter'>Skip the traffic with our intelligent routing system! We constantly check real-time data to guide you through the fastest, most efficient routes.</h1>
                        </div>

                        <div className='md:w-64 lg::w-96'>
                            <Link href='/auth/sign-in' ><button className={`exo2 active:duration-200 text-[#fefefe] rounded-md bg-[#00B37E] hover:bg-[#00b37dde] active:bg-[#00b368de] shadow-lg font-bold text-sm lg:text-base px-10 py-3 cursor-pointer transition-all duration-300`} >Travel Smart Now!</button></Link>
                        </div>

                    </div>

                </div>

            </div>
            <div className='max-w-5xl sm:px-7 md:px-10 mx-auto items-center mb-10 flex flex-col gap-4 md:gap-6'>

                <img loading='lazy' className='smartMatching w-full' src="/Images/Flux_Dev_A_sleek_futuristic_illustration_depicting_a_smart_rid_1.jpeg" alt="" />

                <div className='text-[#202020] items-center px-6 sm:mx-0 w-full flex flex-col gap-8'>

                    <div className='text-center flex flex-col gap-2 max-w-4xl'>
                        <h1 className='text-2xl md:text-3xl text-center font-semibold exo2'>Multi-Destination & Flexible Carpooling</h1>

                        <h1 className='inter text-[#202020] text-sm'>Enjoy Seamless Ride-Sharing with Multiple Stops and Smart Pricing, Making Your Commute Convenient, Affordable, and Eco-Friendly.</h1>
                    </div>

                    <div>
                        <Link href='/auth/sign-in' ><button className={`exo2 active:duration-200 text-[#fefefe] rounded-md bg-[#00B37E] hover:bg-[#00b37dde] active:bg-[#00b368de] shadow-lg font-bold px-10 py-3 cursor-pointer text-sm md:text-base transition-all duration-300`} >Try Flexible Carpooling Now!</button></Link>
                    </div>

                </div>

            </div>
        </>
    )
}

export default CO2Emission
