import React, { useState } from 'react'
import { Navigation, History, Calendar, Car, Star, Map, Clock, User2, XCircle } from 'lucide-react'
import { FaCalendar } from 'react-icons/fa'
import { MapPinIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface RidesProps {
    toggleTheme: boolean | undefined,
    user: any
}

const Rides = ({ toggleTheme, user }: RidesProps) => {
    const [toggle, setToggle] = useState(false)
    const [takenIsHovered, setTakenIsHovered] = useState(false)
    const [currentTab, setCurrentTab] = useState('upcoming')
    const [isHovered, setHovered] = useState(false)

    return (
        <div className={`${toggleTheme ? 'text-[#fefefe] bg-[#0d0d0d]' : 'text-[#202020] bg-[#fefefe]'} w-full h-full overflow-y-auto px-6 md:px-8 pt-6 md:pt-8 pb-6 rounded-3xl`} style={{ scrollbarWidth: 'thin' }}>

            <div className='max-w-7xl mx-auto flex flex-col w-full'>

                <div className='flex items-center justify-between'>
                    <h1 className='text-[22px] font-medium'>Your Rides</h1>
                    <Link href='/dashboard/manage-rides'><button className={`${toggleTheme? 'text-[#fefefe] hover:text-[#fefefecc]': 'text-[#202020] hover:text-[#202020cc]'} cursor-pointer text-sm font-medium underline`}>Manage Active Rides</button></Link>
                </div>

                <div className='mt-8 flex items-center gap-10'>
                    <button onMouseEnter={() => {
                        if (toggle) setTakenIsHovered(true)
                    }} onMouseLeave={() => setTakenIsHovered(false)} onClick={() => {
                        setTakenIsHovered(false)
                        setToggle(false)
                    }} className={`relative cursor-pointer w-32 justify-center flex items-center gap-2 ${toggle && !toggleTheme ? 'text-[#414040]' : toggle && toggleTheme? 'text-[#b1b1b1]': toggleTheme? 'text-[#048c64]': 'text-[#00563c]'}`}>
                        <Navigation className='mb-3' size={16} />
                        <h1 className={`text-sm mb-3 mr-1.5 font-medium`}>Taken Rides</h1>
                        <hr className={`${toggle && takenIsHovered && !toggleTheme ? 'opacity-[1] border-[#f0f0f0]' : toggle && takenIsHovered && toggleTheme? 'opacity-[1] border-[#202020]' : !toggle && !toggleTheme ? 'opacity-[1] border-[#00563c]' : !toggle && toggleTheme? 'opacity-[1] border-[#048c64]': 'opacity-0'} absolute w-full border-[1.5px] bottom-0`} />
                    </button>
                    <button onMouseEnter={() => {
                        if (!toggle) setTakenIsHovered(true)
                    }} onMouseLeave={() => setTakenIsHovered(false)} onClick={() => {
                        setToggle(true)
                        setTakenIsHovered(false)
                    }} className={`${!toggle && !toggleTheme ? 'text-[#414040]' : !toggle && toggleTheme? 'text-[#b1b1b1]': toggleTheme? 'text-[#048c64]': 'text-[#00563c]'} relative cursor-pointer w-32 justify-center flex items-center gap-2`}>
                        <History className='mb-3' size={16} />
                        <h1 className='text-sm mb-3 mr-1.5 font-medium'>Offered Rides</h1>
                        <hr className={`${!toggle && takenIsHovered && !toggleTheme ? 'opacity-[1] border-[#f0f0f0]' : !toggle && takenIsHovered && toggleTheme? 'opacity-[1] border-[#202020]' : toggle && !toggleTheme ? 'opacity-[1] border-[#00563c]' : toggle && toggleTheme? 'opacity-[1] border-[#048c64]': 'opacity-0'} absolute w-full border-[1.5px] bottom-0`} />
                    </button>
                </div>

                <h1 className='text-lg font-semibold mt-8'>{toggle ? 'Offered Rides' : 'Taken Rides'}</h1>

                <div className='flex sm:flex-none items-center sm:grid text-sm overflow-x-auto whitespace-nowrap w-full sm:w-auto scrollbar-hide sm:grid-cols-3 gap-2 md:gap-4 mt-6'>
                    <button onClick={() => setCurrentTab('upcoming')} className={`py-2.5 cursor-pointer px-4 rounded-xl flex items-center gap-10 sm:gap-2 w-full sm:w-auto justify-between ${toggleTheme? 'bg-[#519ce6]': 'bg-[#a7c7e7]'}`}>
                        <h1 className='font-medium flex items-center gap-2'>UPCOMING <div className={`${toggleTheme? 'bg-[#fefefe]': 'bg-[#202020]'} w-1.5 h-1.5 mt-0.5 rounded-full`} style={{ display: currentTab === 'upcoming' ? 'block' : 'none' }}></div></h1>
                        <div className={`px-2.5 text-[13px] py-[2px] rounded-md ${toggleTheme? 'bg-[#a7c7e7] text-[#202020]': 'bg-[#519ce6] text-[#fefefe]'}`}>11</div>
                    </button>
                    <button onClick={() => setCurrentTab('past')} className={`py-2.5 ${toggleTheme? 'bg-[#969697]': 'bg-[#C0C0C0]'} cursor-pointer px-4 gap-20 sm:gap-2 w-full sm:w-auto rounded-xl flex items-center justify-between`}>
                        <h1 className='font-medium flex items-center gap-2'>PAST <div className={`${toggleTheme? 'bg-[#fefefe]': 'bg-[#202020]'} w-1.5 h-1.5 mt-0.5 rounded-full`} style={{ display: currentTab === 'past' ? 'block' : 'none' }}></div></h1>
                        <div className={`px-2.5 py-[2px] text-[13px] ${toggleTheme? 'bg-[#C0C0C0] text-[#202020]': 'bg-[#969697] text-[#fefefe]'} rounded-md`}>20</div>
                    </button>
                    <button onClick={() => setCurrentTab('cancelled')} className={`py-2.5 cursor-pointer px-4 rounded-xl flex items-center gap-10 sm:gap-2 w-full sm:w-auto justify-between ${toggleTheme? 'bg-[#FF7777]': 'bg-[#F4A7A7]'}`}>
                        <h1 className='font-medium flex items-center gap-2'> CANCELLED <div className={`bg-[#202020] w-1.5 h-1.5 ${toggleTheme? 'bg-[#fefefe]': 'bg-[#202020]'} mt-0.5 rounded-full`} style={{ display: currentTab === 'cancelled' ? 'block' : 'none' }}></div></h1>
                        <div className={`${toggleTheme? 'bg-[#f4a7a7] text-[#202020]': 'bg-[#ff7777] text-[#fefefe]'} px-2.5 py-[2px] text-[13px] rounded-md`}>05</div>
                    </button>
                </div>

                {/* //Upcoming rides */}
                {currentTab === 'upcoming' &&
                    <div className='mt-6 text-sm'>
                        <div className='shadow-md rounded-2xl border p-4'>
                            <div className='flex items-start sm:items-center justify-between'>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2'>
                                    <div className='flex items-center'>
                                        <div className='rounded-full bg-[#519CE6] w-10 md:w-11 h-10 md:h-11 flex items-center justify-center'><Calendar size={20} color='#fefefe' /></div>
                                        <div className='bg-[#048c64] relative -ml-3 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-xl text-[#fefefe] rounded-full'><h1>M</h1></div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h1 className='font-medium text-base flex items-center gap-x-1 sm:text-sm'><User2 className='sm:hidden' size={16} /> Moeez ur rehman</h1>
                                        <h1 className='flex text-xs mt-0.5 font-medium items-center gap-1'><Car size={16} /> Sedan</h1>
                                    </div>

                                    <hr className={`${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />
                                </div>

                                <div className='flex flex-col items-end sm:flex-row sm:items-center gap-2'>
                                <h1 className='font-semibold flex items-center gap-1 sm:text-[17px] lg:text-lg'>4.6 <Star size={16} fill={toggleTheme? '#fefefe': '#202020'} /></h1>
                                <div className='p-2 sm:hidden flex items-center gap-1 text-[13px] font-medium rounded-full shadow-md border'><Map size={16} /> Route</div>
                                </div>
                            </div>
                            <div className='mt-4 sm:mt-5 font-medium'>
                                <h1 className='flex items-center gap-1'><Navigation size={18} /> 221B Baker Street, London</h1>
                                <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> 742 Evergreen Terrace, Springfield</h1>
                            </div>
                            <div className='flex flex-col-reverse gap-y-4 sm:gap-y-0 sm:flex-row sm:items-end font-medium sm:justify-between mt-5 sm:mt-3'>

                                <h1 className='flex items-center gap-1'>Estimated Fare: <p className='font-semibold'>Rs.420</p></h1>
                                <div className='flex items-center gap-3'>
                                    <div className={`${isHovered ? 'w-[102px]' : 'w-[39px]'} px-[10px] py-[10px] h-fit transition-all hidden sm:flex duration-200 cursor-pointer text-[15px] font-medium border overflow-hidden rounded-full shadow-md items-center`}
                                    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
                                        <Map size={18} color={toggleTheme ? '#fefefe' : '#202020'} className="flex-shrink-0" />
                                        <h1 className={`${isHovered ? 'ml-1' : 'ml-3'} ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-xs transition-all duration-200 whitespace-nowrap flex-shrink`}>See Route</h1>
                                    </div>

                                    <h1 className='flex items-center text-xs gap-1'><FaCalendar size={15} /> March 03, 2025</h1>

                                    <div className={`${toggleTheme? 'bg-[#202020] text-[#b1b1b1]': 'text-[#5b5b5b] bg-[#f0f0f0]'} text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}>
                                        <Clock size={15} /> 10:30 AM
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }

                {/* //Past rides */}
                {currentTab === 'past' &&
                    <div className='mt-6 text-sm'>
                        <div className='shadow-md rounded-2xl border p-4'>
                            <div className='flex items-start sm:items-center justify-between'>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2'>
                                    <div className='flex items-center'>
                                        <div className='rounded-full bg-[#969697] w-10 md:w-11 h-10 md:h-11 flex items-center justify-center'><History size={22} color='#fefefe' /></div>
                                        <div className='bg-[#048c64] relative -ml-3 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-xl text-[#fefefe] rounded-full'><h1>M</h1></div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h1 className='font-medium text-base flex items-center gap-x-1 sm:text-sm'><User2 className='sm:hidden' size={16} /> Moeez ur rehman</h1>
                                        <h1 className='flex text-xs mt-0.5 font-medium items-center gap-1'><Car size={16} /> Sedan</h1>
                                    </div>

                                    <hr className={`${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />
                                </div>

                                <div className='flex flex-col items-end sm:flex-row sm:items-center gap-2'>
                                <button className={`font-medium cursor-pointer flex items-center py-1.5 px-3 sm:px-4 rounded-full ${toggleTheme? 'bg-[#202020] hover:bg-[#202020cc]': 'bg-[#f0f0f0] hover:bg-[#f7f7f7]'} bg-[#202020] text-sm gap-1`}>Rate <Star size={15} fill={toggleTheme? '#fefefe': '#202020'} /></button>
                                <div className='p-2 sm:hidden flex items-center gap-1 text-[13px] font-medium rounded-full shadow-md border'><Map size={16} /> Route</div>
                                </div>
                            </div>
                            <div className='mt-4 sm:mt-5 font-medium'>
                                <h1 className='flex items-center gap-1'><Navigation size={18} /> 221B Baker Street, London</h1>
                                <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> 742 Evergreen Terrace, Springfield</h1>
                            </div>
                            <div className='flex flex-col-reverse gap-y-4 sm:gap-y-0 sm:flex-row sm:items-end font-medium sm:justify-between mt-5 sm:mt-3'>

                                <h1 className='flex items-center gap-1'>Fare Paid: <p className='font-semibold'>Rs.420</p></h1>
                                <div className='flex items-center gap-3'>
                                    <div className={`${isHovered ? 'w-[102px]' : 'w-[39px]'} px-[10px] py-[10px] h-fit transition-all hidden sm:flex duration-200 cursor-pointer text-[15px] font-medium border overflow-hidden rounded-full shadow-md items-center`}
                                    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
                                        <Map size={18} color={toggleTheme ? '#fefefe' : '#202020'} className="flex-shrink-0" />
                                        <h1 className={`${isHovered ? 'ml-1' : 'ml-3'} ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-xs transition-all duration-200 whitespace-nowrap flex-shrink`}>See Route</h1>
                                    </div>

                                    <h1 className='flex items-center text-xs gap-1'><FaCalendar size={15} /> March 03, 2025</h1>

                                    <div className={`${toggleTheme? 'bg-[#202020] text-[#b1b1b1]': 'text-[#5b5b5b] bg-[#f0f0f0]'} text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}>
                                        <Clock size={15} /> 10:30 AM
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }

                {/* //Cncelled rides */}
                {currentTab === 'cancelled' &&
                    <div className='mt-6 text-sm'>
                        <div className='shadow-md rounded-2xl border p-4'>
                            <div className='flex items-start sm:items-center justify-between'>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2'>
                                    <div className='flex items-center'>
                                        <div className='rounded-full bg-[#ff7777] w-10 md:w-11 h-10 md:h-11 flex items-center justify-center'><XCircle size={22} color='#fefefe' /></div>
                                        <div className='bg-[#048c64] relative -ml-3 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-xl text-[#fefefe] rounded-full'><h1>M</h1></div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <h1 className='font-medium text-base flex items-center gap-x-1 sm:text-sm'><User2 className='sm:hidden' size={16} /> Moeez ur rehman</h1>
                                        <h1 className='flex text-xs mt-0.5 font-medium items-center gap-1'><Car size={16} /> Sedan</h1>
                                    </div>

                                    <hr className={`${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />
                                </div>

                                <div className='flex flex-col items-end sm:flex-row sm:items-center gap-2'>
                                <button className={`font-medium hidden sm:flex items-center py-1.5 px-3 sm:px-4 rounded-full ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]'} text-sm`}>Cancelled by You</button>
                                <div className='p-2 sm:hidden flex items-center gap-1 text-[13px] font-medium rounded-full shadow-md border'><Map size={16} /> Route</div>
                                </div>
                            </div>
                            <div className='mt-4 sm:mt-5 font-medium'>
                                <h1 className='flex items-center gap-1'><Navigation size={18} /> 221B Baker Street, London</h1>
                                <h1 className='mt-1 flex items-center gap-1'><MapPinIcon className='w-5 h-5' /> 742 Evergreen Terrace, Springfield</h1>
                            </div>
                            <div className='flex flex-col-reverse gap-y-4 sm:gap-y-0 sm:flex-row sm:items-end font-medium sm:justify-between mt-5 sm:mt-3'>

                                <button className='flex py-2 sm:py-1.5 justify-center cursor-pointer hover:bg-red-400 text-[#fefefe] px-4 bg-red-500 rounded-full items-center gap-1'>Reason</button>
                                <button className={`font-medium flex items-center py-1.5  w-fit sm:hidden px-3 sm:px-4 rounded-full ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]'} text-sm`}>Cancelled by You</button>
                                <div className='flex items-center gap-3'>
                                    <div className={`${isHovered ? 'w-[102px]' : 'w-[39px]'} px-[10px] py-[10px] h-fit transition-all hidden sm:flex duration-200 cursor-pointer text-[15px] font-medium border overflow-hidden rounded-full shadow-md items-center`}
                                    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} >
                                        <Map size={18} color={toggleTheme ? '#fefefe' : '#202020'} className="flex-shrink-0" />
                                        <h1 className={`${isHovered ? 'ml-1' : 'ml-3'} ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-xs transition-all duration-200 whitespace-nowrap flex-shrink`}>See Route</h1>
                                    </div>

                                    <h1 className='flex items-center text-xs gap-1'><FaCalendar size={15} /> March 03, 2025</h1>

                                    <div className={`${toggleTheme? 'bg-[#202020] text-[#b1b1b1]': 'text-[#5b5b5b] bg-[#f0f0f0]'} text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}>
                                        <Clock size={15} /> 10:30 AM
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}

export default Rides