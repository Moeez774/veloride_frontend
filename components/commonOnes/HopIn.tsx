'use client'
import React, { useEffect, useState } from 'react'
import './Commons.css'
import Link from 'next/link'

const HopIn = () => {


    const [isStart, setStart] = useState(false)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setStart(true)

            setTimeout(() => setShowButton(true), 300)
        }, 800)
    }, [])
  return (
    <div className='w-full flex flex-col gap-28 min-h-screen' style={{ userSelect: 'none' }}>

        {/* hero sec */}
        <div className='hopIn bg-[#00B37E] px-8 sm:px-14 md:px-20 w-full justify-between h-[95vh] flex pt-36 items-center'>

            {/* // content */}
            <div className={`content flex flex-col transition-all duration-300 gap-6 sm:gap-8`}>

                <div className='hopText flex flex-col gap-2.5'>
                    <h1 className={`exo2 firstHead text-4xl sm:text-5xl sm:w-96 ${isStart? 'translate-y-0 opacity-[1]': 'opacity-0 translate-y-5'} transition-all duration-300 leading-[45px] sm:leading-[57px] text-white font-bold`} style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>Hop In, Save Big, Go Green!</h1>

                    <h1 className={`poppins secondHead text-base sm:text-lg sm:w-96 leading-[25px] font-normal text-white ${isStart? 'translate-y-0 opacity-[1]': 'opacity-0 translate-y-5'} transition-all delay-150 duration-300`} style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}>Revolutionizing Carpooling with AI-Powered Convenience.</h1>
                </div>

                {/* CTA */}
                <div className='btn sm:w-96'>
                    <Link prefetch={true} href='/auth/sign-in'><button className={`exo2 transition-all active:translate-y-0.5 active:duration-200 text-[#00B37E] text-lg rounded-md bg-white shadow-lg font-bold hover:bg-[#f3f0f0] px-10 py-3 ${showButton? 'translate-y-0 opacity-[1] cursor-pointer': 'opacity-0 translate-y-5 cursor-default'} transition-all duration-300`} >Hop in</button></Link>
                </div>

            </div>

            {/* //car */}
            <div>
                <img className='w-96 -rotate-y-180' style={{ transform: 'rotateY(-180deg)', animation: 'car 1.5s ease-in-out' }} src="/Images/Untitled-design-unscreen.gif" alt="" />
            </div>

        </div>

        <div className='flex flex-col gap-3 mx-6 text-[#00b37e]'>

            <h1 className='exo2 text-center text-3xl sm:text-4xl md:text-5xl font-bold'>Welcome to VeloRide!</h1>

            <h1 className='poppins text-center text-lg font-normal'>Smarter Carpooling for Easy & Affordable Rides</h1>

        </div>

    </div>
  )
}

export default HopIn
