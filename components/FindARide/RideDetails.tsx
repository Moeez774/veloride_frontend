'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import DatePicker from './DatePicker'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import MyTimePicker from './TimePicker'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Suggestions from '../main/Suggestions'
interface Details {
    passengers: number,
    setPassengers: Dispatch<SetStateAction<number>>,
    date: string | undefined,
    setDate: Dispatch<SetStateAction<string | undefined>>,
    time: string,
    setTime: Dispatch<SetStateAction<string>>,
    drop: string | null,
    setDrop: Dispatch<SetStateAction<string | null>>,
    pickup: string | null,
    setPickup: Dispatch<SetStateAction<string | null>>,
    setLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>,
    setDropLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>
}

const RideDetails: React.FC<Details> = ({ passengers, setPassengers, date, setDate, time, setTime, drop, setDrop, setPickup, pickup, setLocation, setDropLocation }) => {

    const [showPickupTip, setShowPickupTip] = useState(false)
    const [showDropoffTip, setShowDropoffTip] = useState(false)
    const [showSearch1, setShowSearch1] = useState(false)
    const [showSearch2, setShowSearch2] = useState(false)
    const inputRef = useRef<any>(null)
    const inputRef2 = useRef<any>(null)

    // for setting suggestions for both fields
    const [suggestions1, setSuggestions1] = useState<any[]>([])
    const [suggestions2, setSuggestions2] = useState<any[]>([])
    const [loader, setLoader] = useState(false)

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, setter: Dispatch<SetStateAction<string | null>>, setSuggestions: Dispatch<SetStateAction<any[]>>) => {
        const inputValue = e.target.value;
        setter(inputValue)

        if (inputValue.length > 1) {
            setLoader(true)  // Use the new value directly
            try {
                const requestOptions = {
                    method: 'GET',
                }

                const a = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=7c961581499544e085f28a826bf9ebeb`, requestOptions)

                const response = await a.json()
                setLoader(false)
                setSuggestions(response.features)

            } catch (err) {
                setLoader(false)
                alert("Error fetching locations: " + err)
            }
        } else {
            setLoader(false)
            setSuggestions([])
        }
    }

    return (
        <div className='inter w-[80vw] sm:w-[30rem] lg:w-[22rem] flex flex-col gap-5'>

            {/* inputs about location */}
            <div className='flex flex-col gap-3'>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="" className='inter font-medium text-[12px]'>Pickup Location</label>

                    <div className='flex items-center bg-[#EAEAEA] justify-between w-[80vw] sm:w-[30rem] lg:w-[22rem] rounded-md border-solid px-3 gap-1 shadow-md'>
                        <input type='text' ref={inputRef} value={pickup ? pickup : ''} onChange={async (e) => await (handleInputChange(e, setPickup, setSuggestions1))} placeholder='Pickup Location' className={`py-3 bg-transparent placeholder:text-[#a4a4a4] text-[14px] lg:text-base flex-1 outline-none inter`} onFocus={() => setShowSearch1(true)} />

                        <div className='relative z-[200]'>
                            <TooltipProvider>
                                <Tooltip open={showPickupTip} onOpenChange={() => setShowPickupTip(!showPickupTip)}>
                                    <TooltipTrigger className='translate-y-[4px]'><HelpCircle onClick={() => setShowPickupTip(true)} onFocus={() => setShowPickupTip(true)} onBlur={() => setShowPickupTip(false)} size={20} color='#202020' /></TooltipTrigger>
                                    <TooltipContent className='relative z-[200]'>
                                        <p className='inter w-24 text-center'>Enter the location where you want to be picked up.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                </div>

                <div className='-mt-2 relative'>
                    <Suggestions setLocation={setLocation} inputRef={inputRef} showSearch={showSearch1} setShowSearch={setShowSearch1} suggestions={suggestions1} loader={loader} setValue={setPickup} />
                </div>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="" className='inter font-medium text-[12px]'>Drop-off Location</label>
                    <div className='flex items-center bg-[#EAEAEA] justify-between w-[80vw] sm:w-[30rem] lg:w-[22rem] rounded-md border-solid px-3 gap-1 shadow-md'>
                        <input type='text' value={drop ? drop : ''} ref={inputRef2} onChange={async (e) => await (handleInputChange(e, setDrop, setSuggestions2))} placeholder='Drop-off Location' className={`py-3 bg-transparent placeholder:text-[#a4a4a4] text-[14px] lg:text-base flex-1 outline-none inter`} onFocus={() => setShowSearch2(true)} />

                        <div>
                            <TooltipProvider>
                                <Tooltip open={showDropoffTip} onOpenChange={() => setShowDropoffTip(!showDropoffTip)}>
                                    <TooltipTrigger className='translate-y-[4px]'><HelpCircle onClick={() => setShowDropoffTip(true)} onFocus={() => setShowDropoffTip(true)} onBlur={() => setShowDropoffTip(false)} size={20} color='#202020' /></TooltipTrigger>
                                    <TooltipContent className='relative z-[200]'>
                                        <p className='inter w-24 text-center'>Enter the location where you want to be dropped off.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            <div className='-mt-4 relative'>
                {/* // for showing suggestions */}
                <Suggestions setLocation={setDropLocation} inputRef={inputRef2} showSearch={showSearch2} setShowSearch={setShowSearch2} suggestions={suggestions2} loader={loader} setValue={setDrop} />
            </div>

            {/* Time & Datepicker */}
            <div className='w-full flex flex-col gap-6'>

                <DatePicker date={date} setDate={setDate} />

                <div className='w-full flex items-center justify-between'>

                    <div className='w-[6.5rem] flex items-center gap-2 sm:gap-4 justify-between'>
                        <h1 className='text-[14px] sm:text-sm font-normal' style={{ userSelect: 'none' }}>Passengers</h1>

                        <div className='flex gap-2 items-center'>
                            <h1 className='text-[14px] sm:text-sm w-4'>{passengers < 10 ? `0${passengers}` : passengers}</h1>

                            <div className='flex flex-col gap-1'>

                                <div onClick={() => {
                                    if (passengers < 4) setPassengers(passengers + 1)
                                }} className='p-1 cursor-pointer bg-[#eaeaea] rounded-full shadow-md'><ChevronUp size={15} strokeWidth={3} /></div>

                                <div onClick={() => {
                                    if (passengers > 1) setPassengers(passengers - 1)
                                }} className='p-1 cursor-pointer bg-[#eaeaea] rounded-full shadow-md'><ChevronDown size={15} strokeWidth={3} /></div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <MyTimePicker value={time} setValue={setTime} />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default RideDetails
