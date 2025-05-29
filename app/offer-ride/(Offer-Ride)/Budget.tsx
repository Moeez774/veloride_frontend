'use client'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Checkbox from '@/components/hooks/Checkbox'
import Loader from '@/components/Loader'
import { getContacts } from '@/context/ContactsProvider'

const Budget = ({ negotiate, setNegotiate, budget, setBudget, vehicle, location, dropLocation, currStep }: { negotiate: boolean, setNegotiate: Dispatch<SetStateAction<boolean>>, budget: number, setBudget: Dispatch<SetStateAction<number>>, vehicle: string, location: { long: number, lat: number }, dropLocation: { long: number, lat: number }, currStep: number }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const [showToolTip, setShowToolTip] = useState(false)
    const [avgPrice, setAvgPrice] = useState(0)
    const [percentOff, setPercentOff] = useState(0)
    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    //sending request to server for fetching ride price whenever user goes to 3rd step
    const fetchPrice = async () => {
        let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/fetchPrice`, {
            method: "POST", headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pickupLocation: location, dropOffLocation: dropLocation, vehicle: vehicle })
        })
        const response = await a.json()
        if (response.statusCode === 200) {
            setLoader(false)
            setAvgPrice(response.price)
            setBudget(response.price)
            setPercentOff(response.price / 10)
        }
        else {
            setBudget(0)
            setLoader(true)
            setMessage(response.message)
            setShowMessage(true)
        }
    }

    useEffect(() => {
        if (currStep === 3) fetchPrice()
    }, [vehicle, currStep])

    useEffect(() => {
        fetchPrice()
    }, [location, dropLocation, vehicle])

    return (
        <>
            {loader && <Loader setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} />}

            <div className={`inter w-[80vw] sm:w-[30rem] lg:w-[22rem] flex flex-col gap-5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>

                {/* //showing prices */}
                <div className='flex flex-col gap-3'>

                    <div className='flex justify-between items-center'>
                        <h1 className='text-base font-medium'>Estimated Fare & Adjustments</h1>
                        <TooltipProvider>
                            <Tooltip open={showToolTip} onOpenChange={() => setShowToolTip(false)}>
                                <TooltipTrigger onMouseLeave={() => setShowToolTip(false)} onMouseEnter={() => setShowToolTip(true)} onClick={() => setShowToolTip(true)} onBlur={() => setShowToolTip(false)}>
                                    <HelpCircle size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                                </TooltipTrigger>
                                <TooltipContent className={`inter relative z-[100] w-48 text-center ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] text-[#fefefe]' : 'bg-white text-[#202020]'}`}>
                                    <p>Adjust your total budget as needed. The final split may vary based on passenger count.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className='flex justify-between mt-4 items-center gap-2'>
                        <h1 className='text-sm flex items-center'>
                            <div className={`w-1 mr-2 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'}`}></div>
                            Average price of this ride
                        </h1>
                        <div className={`bg-transparent border-2 ${toggleTheme ? 'border-[#048C64] text-[#fefefe]' : 'border-[#00b37e] text-[#202020]'} rounded-md px-2.5 py-1.5 text-[14px] font-medium shadow-md flex items-center gap-1`}>
                            PKR {avgPrice}
                        </div>
                    </div>

                    <div className='flex flex-col justify-center my-4 items-center gap-5'>
                        <h1 className='text-sm md:text-base font-medium flex items-center'>Adjust your budget</h1>

                        <div className='relative w-full justify-center flex items-center gap-1'>
                            <div className='relative'>
                                <h1 className='text-2xl md:text-3xl'>Rs.{budget}</h1>
                            </div>

                            <div className='absolute w-full items-end flex flex-col'>
                                <div className={`px-1.5 hover:${toggleTheme ? 'bg-[#2d2d2d]' : 'bg-[#f0f0f0]'} cursor-pointer transition-all duration-200 rounded-sm py-0.5`} onClick={() => {
                                    if (percentOff < ((avgPrice / 10) + (avgPrice / 10))) {
                                        setBudget(prev => prev + 1)
                                        setPercentOff(prev => prev + 1)
                                    }
                                }}>
                                    <ChevronUp size={22} className={toggleTheme ? 'text-[#048C64]' : 'text-[#00b37e]'} />
                                </div>
                                <div className={`px-1.5 py-0.5 hover:${toggleTheme ? 'bg-[#2d2d2d]' : 'bg-[#f0f0f0]'} cursor-pointer transition-all duration-200 rounded-sm`} onClick={() => {
                                    if (percentOff > 0) {
                                        setBudget(prev => prev - 1)
                                        setPercentOff(prev => prev - 1)
                                    }
                                }}>
                                    <ChevronDown size={22} color={toggleTheme ? '#048C64' : '#00b37e'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-1'>
                    <h1 className={`text-[11px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#202020]'}`}>(Optional)</h1>
                    <Checkbox text='Willing to negotiate' setter={setNegotiate} item={negotiate} />
                </div>
            </div>
        </>
    )
}

export default Budget
