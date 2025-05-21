'use client'
import { Car, ChevronDown } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
    vehicle: string,
    setVehicle: Dispatch<SetStateAction<string>>
}

const Vehicle: React.FC<Details> = ({ vehicle, setVehicle }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const [showType, setShowType] = useState(false)
    // all vehicle's types
    const vehicles = ['Compact Car', 'Sedan', 'SUVs', 'Luxury Cars']

    return (
        <div className='relative'>
            <div onClick={() => setShowType(!showType)} className={`relative w-[9.5rem] sm:w-44 cursor-pointer flex justify-between items-center ${toggleTheme ? 'bg-[#202020] border border-[#2d2d2d]' : 'bg-white'} p-3 rounded-md shadow-md`}>
                <div className={`flex items-center text-[13px] sm:text-sm inter gap-1 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                    <Car size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                    {vehicle === '' ? 'Vehicle' : vehicle}
                </div>
                <ChevronDown size={17} className='transition-all duration-200' style={{ transform: showType ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color={toggleTheme ? '#fefefe' : '#202020'} />
            </div>

            <div className='absolute mt-1' style={{ transition: 'all 0.1s ease-in-out', zIndex: showType ? '30' : '-30', transform: showType ? 'scale(1)' : 'scale(0.8)', opacity: showType ? '1' : '0' }}>
                <ScrollArea className={`w-[9.5rem] sm:w-44 p-1 flex flex-col ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe]'} shadow-md rounded-lg inter h-36`}>
                    {vehicles.map((e, index) => {
                        return (
                            <button key={index} className={`p-1.5 ${toggleTheme ? 'hover:bg-[#202020] text-[#fefefe]' : 'hover:bg-gray-100 text-[#202020]'} rounded-md w-full cursor-pointer text-sm text-start`} onClick={() => {
                                setVehicle(e)
                                setShowType(false)
                            }}>{e}</button>
                        )
                    })}
                </ScrollArea>
            </div>
        </div>
    )
}

export default Vehicle
