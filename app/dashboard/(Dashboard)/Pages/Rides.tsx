import React, { useEffect, useState } from 'react'
import { Navigation, History } from 'lucide-react'
import Link from 'next/link'
import UpcomingRides from './Rides_Components/UpcomingRides'
import CompletedRides from './Rides_Components/CompletedRides'
import CancelledRides from './Rides_Components/CancelledRides'
import Taken_Upcoming_Rides from './Rides_Components/Taken_Upcoming_Rides'
import axios from 'axios'
import TakenCancelledRides from './Rides_Components/TakenCancelledRides'
import Taken_Completed_Rides from './Rides_Components/Taken_Completed_Rides'

interface RidesProps {
    toggleTheme: boolean | undefined,
    user: any
}

const Rides = ({ toggleTheme, user }: RidesProps) => {
    const [toggle, setToggle] = useState(false)
    const [takenIsHovered, setTakenIsHovered] = useState(false)
    const [currentTab, setCurrentTab] = useState('upcoming')
    const [upcomingRides, setUpcomingRides] = useState<any[]>([])
    const [completedRides, setCompletedRides] = useState<any[]>([])
    const [cancelledRides, setCancelledRides] = useState<any[]>([])
    const [takenCancelledRides, setTakenCancelledRides] = useState<any[]>([])
    const [takenUpcomingRides, setTakenUpcomingRides] = useState<any[]>([])
    const [takenCompletedRides, setTakenCompletedRides] = useState<any[]>([])
    const fetchUpcomingRides = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upcomings/rides?userId=${user._id}`, {
                method: "GET", headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json()

            if (data.statusCode === 200) {
                setUpcomingRides(data.data)
            }
            else {
                alert(data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    const fetchCompletedRides = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/completed/rides?userId=${user._id}`, {
                method: "GET", headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json()

            if (data.statusCode === 200) {
                setCompletedRides(data.data)
            }
            else {
                alert(data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    const fetchCancelledRides = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancelled/rides?userId=${user._id}`, {
                method: "GET", headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.json()

            if (data.statusCode === 200) {
                setCancelledRides(data.data)
            }
            else {
                alert(data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    const fetchTakenCancelledRides = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cancelled/rides/rider?userId=${user._id}`)
            if (response.status === 200) {
                setTakenCancelledRides(response.data.data)
            }
            else {
                alert(response.data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    const fetchTakenUpcomingRides = async() => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/upcomings/rides/rider?userId=${user._id}`)
            if (response.status === 200) {
                setTakenUpcomingRides(response.data.data)
            }
            else {
                alert(response.data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    const fetchTakenCompletedRides = async() => {

        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/completed/rides/rider?userId=${user._id}`)
            if (response.status === 200) {
                setTakenCompletedRides(response.data.data)
            }
            else {
                alert(response.data.message)
            }
        } catch (err: any) {
            alert(err.message)
        }
    }

    useEffect(() => {
        if (!user) return
        fetchUpcomingRides()
        fetchCompletedRides()
        fetchCancelledRides()
        fetchTakenCancelledRides()
        fetchTakenUpcomingRides()
        fetchTakenCompletedRides()
    }, [user])

    return (
        <div className={`${toggleTheme ? 'text-[#fefefe] bg-[#0d0d0d]' : 'text-[#202020] bg-[#fefefe]'} w-full h-full overflow-y-auto px-6 md:px-8 pt-6 md:pt-8 pb-6 rounded-3xl`} style={{ scrollbarWidth: 'thin' }}>

            <div className='max-w-7xl mx-auto flex flex-col w-full'>

                <div className='flex items-center justify-between'>
                    <h1 className='text-[22px] font-medium'>Your Rides</h1>
                    {upcomingRides.length > 0 && <Link href='/dashboard/manage-rides'><button className={`${toggleTheme ? 'text-[#fefefe] hover:text-[#fefefecc]' : 'text-[#202020] hover:text-[#202020cc]'} cursor-pointer text-sm font-medium underline`}>Manage Active Rides</button></Link>}

                    {upcomingRides.length === 0 && <button title='No Active Rides' className={`${toggleTheme ? 'text-[gray]' : 'text-[#202020cc]'} cursor-pointer text-sm font-medium underline`}>No Active Rides</button>}
                </div>

                <div className='mt-8 flex items-center gap-10'>
                    <button onMouseEnter={() => {
                        if (toggle) setTakenIsHovered(true)
                    }} onMouseLeave={() => setTakenIsHovered(false)} onClick={() => {
                        setTakenIsHovered(false)
                        setToggle(false)
                    }} className={`relative cursor-pointer w-32 justify-center flex items-center gap-2 ${toggle && !toggleTheme ? 'text-[#414040]' : toggle && toggleTheme ? 'text-[#b1b1b1]' : toggleTheme ? 'text-[#048c64]' : 'text-[#00563c]'}`}>
                        <Navigation className='mb-3' size={16} />
                        <h1 className={`text-sm mb-3 mr-1.5 font-medium`}>Taken Rides</h1>
                        <hr className={`${toggle && takenIsHovered && !toggleTheme ? 'opacity-[1] border-[#f0f0f0]' : toggle && takenIsHovered && toggleTheme ? 'opacity-[1] border-[#202020]' : !toggle && !toggleTheme ? 'opacity-[1] border-[#00563c]' : !toggle && toggleTheme ? 'opacity-[1] border-[#048c64]' : 'opacity-0'} absolute w-full border-[1.5px] bottom-0`} />
                    </button>
                    <button onMouseEnter={() => {
                        if (!toggle) setTakenIsHovered(true)
                    }} onMouseLeave={() => setTakenIsHovered(false)} onClick={() => {
                        setToggle(true)
                        setTakenIsHovered(false)
                    }} className={`${!toggle && !toggleTheme ? 'text-[#414040]' : !toggle && toggleTheme ? 'text-[#b1b1b1]' : toggleTheme ? 'text-[#048c64]' : 'text-[#00563c]'} relative cursor-pointer w-32 justify-center flex items-center gap-2`}>
                        <History className='mb-3' size={16} />
                        <h1 className='text-sm mb-3 mr-1.5 font-medium'>Offered Rides</h1>
                        <hr className={`${!toggle && takenIsHovered && !toggleTheme ? 'opacity-[1] border-[#f0f0f0]' : !toggle && takenIsHovered && toggleTheme ? 'opacity-[1] border-[#202020]' : toggle && !toggleTheme ? 'opacity-[1] border-[#00563c]' : toggle && toggleTheme ? 'opacity-[1] border-[#048c64]' : 'opacity-0'} absolute w-full border-[1.5px] bottom-0`} />
                    </button>
                </div>

                <h1 className='text-lg font-semibold mt-8'>{toggle ? 'Offered Rides' : 'Taken Rides'}</h1>

                <div className='flex sm:flex-none items-center sm:grid text-sm overflow-x-auto whitespace-nowrap w-full sm:w-auto scrollbar-hide sm:grid-cols-3 gap-2 md:gap-4 mt-6'>
                    <button onClick={() => setCurrentTab('upcoming')} className={`py-2.5 cursor-pointer px-4 rounded-xl flex items-center gap-10 sm:gap-2 w-full sm:w-auto justify-between ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}>
                        <h1 className='font-medium flex items-center gap-2'>UPCOMING <div className={`bg-[#519ce6] w-1.5 h-1.5 mt-0.5 rounded-full`} style={{ display: currentTab === 'upcoming' ? 'block' : 'none' }}></div></h1>
                        <div className={`px-2.5 text-[13px] py-[2px] rounded-md bg-[#519ce6] text-[#fefefe]`}>{!toggle ? takenUpcomingRides.length : upcomingRides.length}</div>
                    </button>
                    <button onClick={() => setCurrentTab('completed')} className={`py-2.5 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} cursor-pointer px-4 gap-20 sm:gap-2 w-full sm:w-auto rounded-xl flex items-center justify-between`}>
                        <h1 className='font-medium flex items-center gap-2'>Completed <div className={`bg-[#969697] w-1.5 h-1.5 mt-0.5 rounded-full`} style={{ display: currentTab === 'completed' ? 'block' : 'none' }}></div></h1>
                        <div className={`px-2.5 py-[2px] text-[13px] bg-[#969697] text-[#fefefe] rounded-md`}>{!toggle ? takenCompletedRides.length : completedRides.length}</div>
                    </button>
                    <button onClick={() => setCurrentTab('cancelled')} className={`py-2.5 cursor-pointer px-4 rounded-xl flex items-center gap-10 sm:gap-2 w-full sm:w-auto justify-between ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}>
                        <h1 className='font-medium flex items-center gap-2'> CANCELLED <div className={`bg-[#ff7777] w-1.5 h-1.5 ${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'} mt-0.5 rounded-full`} style={{ display: currentTab === 'cancelled' ? 'block' : 'none' }}></div></h1>
                        <div className={`bg-[#ff7777] text-[#fefefe] px-2.5 py-[2px] text-[13px] rounded-md`}>{!toggle ? takenCancelledRides.length : cancelledRides.length}</div>
                    </button>
                </div>

                {/* Upcoming rides */}
                {toggle ? (
                    <>
                        {currentTab === 'upcoming' &&
                            <UpcomingRides toggleTheme={toggleTheme} rides={upcomingRides} />
                        }

                        {/* Past rides */}
                        {currentTab === 'completed' &&
                            <CompletedRides toggleTheme={toggleTheme} user={user} setRides={setCompletedRides} rides={completedRides} />
                        }

                        {/* Cancelled rides */}
                        {currentTab === 'cancelled' &&
                            <CancelledRides toggleTheme={toggleTheme} setRides={setCancelledRides} rides={cancelledRides} />
                        }
                    </>
                ) : (
                    <>
                        {currentTab === 'upcoming' &&
                            <Taken_Upcoming_Rides toggleTheme={toggleTheme} rides={takenUpcomingRides} />
                        }

                        {/* Past rides */}
                        {currentTab === 'completed' &&
                            <Taken_Completed_Rides toggleTheme={toggleTheme} user={user} rides={takenCompletedRides} setRides={setTakenCompletedRides} />
                        }

                        {/* Cancelled rides */}
                        {currentTab === 'cancelled' &&
                            <TakenCancelledRides user={user} toggleTheme={toggleTheme} setRides={setTakenCancelledRides} rides={takenCancelledRides} />
                        }
                    </>
                )}
            </div>

        </div>
    )
}

export default Rides