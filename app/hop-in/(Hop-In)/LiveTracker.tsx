'use client'
import { Car, Navigation, ArrowUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Radios from '@/components/Radios'
import { getContacts } from '@/context/ContactsProvider'
import { MapPinIcon } from '@heroicons/react/16/solid'
import { useInView } from 'react-intersection-observer';

const LiveTracker = () => {

    const [isDriver, setDriver] = useState(false)
    const [isRider, setRider] = useState(false)
    const [isType, setType] = useState('')
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const types = [setDriver, setRider]
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    return (

        <>

            <div className='w-full flex flex-col gap-28 max-w-7xl mx-auto' style={{ userSelect: 'none' }}>

                {/* hero sec */}
                <div ref={ref} className='px-8 sm:px-14 md:pl-10 xl:pl-20 w-full gap-20 lg:gap-0 justify-between flex-col-reverse lg:flex-row pt-36 lg:pt-32 pb-28 flex items-center'>

                    {/* // content */}
                    <div className={`max-w-xl px-2 w-full lg:w-auto flex flex-col transition-all duration-300 gap-6 sm:gap-8`}>

                        <div className='w-full lg:w-auto flex flex-col gap-6'>
                            <h1 className={`inter ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-12 opacity-0'} text-[50px] md:text-[60px] lg:text-[56px] xl:text-[58px] delay-600 sm:delay-1400 lg:delay-0 w-full flex flex-row flex-wrap lg:flex-col gap-3 transition-all duration-1000 ease-out leading-[45px] md:leading-[57px] ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'} font-medium`}>Hop In, <p className='font-semibold'>Save Big,</p> Go Green!</h1>

                            <h1 className={`inter ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-12 opacity-0'} text-base sm:text-lg w-full lg:w-96 leading-[25px] font-normal ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'} transition-all ease-out delay-900 sm:delay-1700 lg:delay-300 duration-1000`}>Revolutionizing Carpooling with AI-Powered Convenience.</h1>
                        </div>

                        {/* CTA */}
                        <div className={`w-full lg:w-auto ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-12 opacity-0'} flex transition-all sm:flex-row flex-col ease-out duration-1000 delay-1200 sm:delay-2000 lg:delay-600 items-center gap-6 sm:gap-3 px-3 py-4 sm:p-1 rounded-xl border border-[#b1b1b1]`}>
                            <div className='flex-1 flex items-center gap-6 w-full px-2'>

                                <div className='flex items-center gap-2.5'>
                                    <Radios item={isRider} setter={setRider} text="I'm a rider" arr={types} setItemName={setType} />
                                    <Radios item={isDriver} setter={setDriver} text="I'm a driver" arr={types} setItemName={setType} />
                                </div>
                            </div>
                            <Link prefetch={true} className='w-full sm:w-auto' href={`/auth?role=${isRider ? 'rider' : isDriver ? 'driver' : 'Any'}`}><button className={`inter flex w-full items-center gap-1.5 active:duration-200 justify-center cursor-pointer text-[#fefefe] rounded-xl bg-[#00563c] font-medium hover:bg-[#00563ccc] text-sm px-5 py-[0.90rem] transition-all ease-out`} >Get Started <ArrowUp className='rotate-45' size={20} color='#fefefe' /> </button></Link>
                        </div>

                    </div>

                    {/* //car */}
                    <div className='lg:translate-x-6'>
                        <div className='flex'>
                            <div className='flex items-center'>
                                <div className={`h-14 w-14 hidden mr-2 sm:flex items-center justify-center bg-[#00563c] rounded-full ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-8 opacity-0'} transition-all ease-out duration-800 delay-500 lg:delay-1600`}><Car size={35} className='-rotate-30' style={{ strokeWidth: '1.5' }} color='#fefefe' /></div>

                                {!toggleTheme && <img className={`w-[400px] md:w-[500px] transition-all ease-out duration-1000 delay-0 lg:delay-1100 lg:w-[400px] xl:w-[450px] ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-12 opacity-0'}`} src='/Images/Order-ride-bro.svg' />}

                                {toggleTheme && <img className={`w-[400px] md:w-[500px] transition-all ease-out duration-1000 delay-0 lg:delay-1100 lg:w-[400px] xl:w-[450px] ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-12 opacity-0'}`} src='/Images/Untitled(2).svg' />}
                            </div>
                            <div className={`h-14 ${inView ? 'translate-y-12 opacity-[1]' : 'translate-y-20 opacity-0'} transition-all ease-out duration-800 delay-700 lg:delay-1800 -translate-x-7 w-14 hidden sm:flex items-center justify-center bg-transparent border border-[#b1b1b1] rounded-full`}><MapPinIcon className='w-8 h-8 sm:w-9 sm:h-9 -rotate-30' color={toggleTheme ? '#048C64' : '#00563c'} /> </div>
                        </div>

                        <div className={`h-14 ml-auto mr-20 pt-1 w-14 hidden sm:flex items-center justify-center bg-[#00563c] rounded-full ${inView ? 'translate-y-0 opacity-[1]' : 'translate-y-8 opacity-0'} transition-all ease-out duration-800 delay-900 lg:delay-2000`}><Navigation size={27} color='#fefefe' /></div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default LiveTracker
