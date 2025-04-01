'use client'
import Completedrides from '@/components/OwnedRides/Completedrides'
import Performance from '@/components/OwnedRides/Performance'
import Support from '@/components/OwnedRides/Support'
import Upcomingrides from '@/components/OwnedRides/Upcomingrides'
import UpcomingRides from '@/components/TakenRides/UpcomingRides'
import { useAuth } from '@/context/AuthProvider'
import { PlusIcon } from '@heroicons/react/16/solid'
import { BarChart, CalendarCheck, ChevronRight, Dot, Flag, LifeBuoy } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'

const page = () => {

    const [takeRides, setTakeRides] = useState(false)
    const authContext = useAuth()
    const user = authContext?.user || null

    const [showUpcomings, setShowUpcomings] = useState(true)
    const [showCompleted, setShowCompleted] = useState(false)
    const [showPerformance, setShowPerformance] = useState(false)
    const [showSafety, setShowSafety] = useState(false)

    const [showOptions, setShowOptions] = useState(false)

    //for disbaling buttons
    const btns = [setShowUpcomings, setShowCompleted, setShowPerformance, setShowSafety]

    //for navigating from one section to other 
    const set = (setter: Dispatch<SetStateAction<boolean>>) => {
        btns.forEach(e => e(e === setter ? true : false))
        setShowOptions(false)
    }

    return (
        <>
            <div className='min-h-screen pt-28 px-3 lg:pl-3 lg:pr-6 max-w-7xl mx-auto flex flex-col gap-10 w-full' style={{ userSelect: 'none' }}>

                <div className='flex sm:flex-row flex-col exo2 text-[1.4rem] lg:text-[1.7rem] font-[600] justify-center items-start sm:items-center sm:gap-7 lg:gap-10'>
                    <div onClick={() => setTakeRides(false)} className={`flex rounded-xl transition-all pt-3 sm:px-3 hover:bg-[#00b37d17] duration-200 flex-col cursor-pointer ${!takeRides ? 'text-[#00b37e]' : 'text-[#202020]'} gap-1 lg:gap-1.5 sm:h-14 lg:h-16`}>
                        <h1 className='flex items-center'><ChevronRight className={`sm:hidden ${takeRides ? 'opacity-0' : 'opacity-[1]'}`} size={20} color='#00b37e' /> Rides You Own</h1>
                        <div className={`bg-[#00b37e] hidden sm:block ${takeRides ? 'translate-x-[13rem] lg:translate-x-[15.8rem]' : 'translate-x-0'} transition-all duration-200 w-full h-1 lg:h-1.5`}></div>
                    </div>
                    <div onClick={() => setTakeRides(true)} className={`sm:h-14 lg:h-16 rounded-xl sm:pt-3 sm:px-3 hover:bg-[#00b33c17] transition-all duration-200 cursor-pointer ${takeRides ? 'text-[#00b37e]' : 'text-[#202020]'}`}>
                        <h1 className='flex items-center'><ChevronRight size={20} className={`sm:hidden ${takeRides ? 'opacity-[1]' : 'opacity-0'}`} color='#00b37e' /> Rides You Take</h1>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto flex gap-4 xl:gap-16 w-full h-full'>

                    {/* Sidebar */}
                    <div className='bg-[#f0f0f0] sticky top-0 left-0 pl-2 pr-2 py-10 items-start hidden lg:flex flex-col justify-between inter h-[25em] shadow-lg w-52 xl:w-64 m-2 rounded-xl text-start text-[15px]'>

                        <div className='flex flex-col gap-6'>
                            <button className={`flex w-full cursor-pointer transition-all duration-200 text-start ${showUpcomings ? 'font-medium' : 'font-normal'}`} onClick={() => set(setShowUpcomings)} ><Dot style={{ strokeWidth: '3', opacity: showUpcomings ? '1' : '0' }} />Upcoming Rides</button>

                            <button className={`flex cursor-pointer transition-all duration-200 ${showCompleted ? 'font-medium' : 'font-normal'} w-full text-start`} onClick={() => set(setShowCompleted)}><Dot style={{ strokeWidth: '3', opacity: showCompleted ? '1' : '0' }} />Completed Rides</button>

                            <button className={`flex cursor-pointer transition-all duration-200 ${showPerformance ? 'font-medium' : 'font-normal'} w-full text-start`} onClick={() => set(setShowPerformance)}><Dot style={{ strokeWidth: '3', opacity: showPerformance ? '1' : '0' }} />Ride Insight & Performance</button>

                            <button className={`flex cursor-pointer transition-all duration-200 ${showSafety ? 'font-medium' : 'font-normal'} w-full text-start`} onClick={() => set(setShowSafety)}><Dot style={{ strokeWidth: '3', opacity: showSafety ? '1' : '0' }} />Safety & Security</button>
                        </div>

                        <div className='w-full flex justify-center px-4'>
                            <button className='bg-[#00b37e] transition-all duration-200 active:bg-[#00b35f] w-full py-3 exo2 font-semibold text-[16px] shadow-md rounded-lg text-[#fefefe] cursor-pointer hover:bg-[#00b37dda]'>Offer a ride</button>
                        </div>

                    </div>

                    {/* //main */}
                    <div className='flex-1 w-full flex flex-col gap-4'>
                        <hr className='w-full hidden lg:block' style={{ borderColor: '#f0f0f0' }} />

                        <h1 className='lg:hidden text-center text-[1rem] font-medium inter text-[#202020]'>{showUpcomings ? 'Upcoming Rides' : showCompleted ? 'Completed Rides' : showPerformance ? 'Ride Insight & Performance' : showSafety ? 'Safety & Support' : 'Upcoming Rides'}</h1>

                        {/* //owned rides info */}
                        {!takeRides && showUpcomings && <Upcomingrides user={user} />}

                        {!takeRides && showCompleted && <Completedrides user={user} />}

                        {!takeRides && showPerformance && <Performance user={user} />}

                        {!takeRides && showSafety && <Support />}

                        {/* //taken rides info */}
                        {takeRides && showUpcomings && <UpcomingRides user={user} />}

                        {takeRides && showCompleted && <Completedrides user={user} />}

                        {takeRides && showPerformance && <Performance user={user} />}

                        {takeRides && showSafety && <Support />}
                    </div>

                </div>
            </div>

            <div className='fixed bottom-0 lg:hidden right-0 my-28 md:my-12 mx-12'>
                <div onClick={() => setShowOptions(!showOptions)} className={`w-16 ${showOptions ? 'h-[20.5rem]' : 'h-16'} transition-all duration-200 flex flex-col justify-end gap-10 overflow-hidden items-center rounded-full bg-[#00b37e]`}>
                    <CalendarCheck className='-translate-y-[5rem] cursor-pointer' onClick={() => set(setShowUpcomings)} color='#fefefe' size={25} />
                    <Flag className='-translate-y-[5rem] cursor-pointer' onClick={() => set(setShowCompleted)} color='#fefefe' size={25} />
                    <BarChart className='-translate-y-[5rem] cursor-pointer' onClick={() => set(setShowPerformance)} color='#fefefe' size={25} />
                    <LifeBuoy className='-translate-y-[5rem] cursor-pointer' onClick={() => set(setShowSafety)} color='#fefefe' size={25} />

                    <div className='p-4 cursor-pointer -translate-y-0.5 absolute'>
                        <PlusIcon className={`w-7 h-7 ${showOptions ? 'rotate-45' : 'rotate-0'} transition-all duration-200`} color='#fefefe' />
                    </div>
                </div>
            </div>
        </>
    )
}

export default page
