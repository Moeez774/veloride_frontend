'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, HelpCircle } from 'lucide-react'
import Checkbox from '../FindARide/Checkbox'
import { ScrollArea } from '../ui/scroll-area'

const Budget = ({ recurring, negotiate, setNegotiate, setRecurring, recurringVal, setRecurringVal, budget, setBudget } : { recurring: boolean, negotiate: boolean, setNegotiate: Dispatch<SetStateAction<boolean>>, setRecurring: Dispatch<SetStateAction<boolean>>, recurringVal: string, setRecurringVal: Dispatch<SetStateAction<string>>, budget: string, setBudget: Dispatch<SetStateAction<string>> }) => {

    const [showTip, setShowTip] = useState(false)

    
    const [showRecurring, setShowRecurring] = useState(false)

    // all recurrings types
    const recurrings = ['One time', 'Daily', 'Weekly']

    return (
        <div className='inter w-[80vw] sm:w-[30rem] lg:w-[22rem] flex flex-col gap-5'>

            <div className='flex flex-col gap-3'>

                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="" className='inter font-medium text-[12px]'>Total budget</label>

                    <div className='flex items-center bg-[#EAEAEA] justify-between w-[80vw] sm:w-[30rem] lg:w-[22rem] rounded-md border-solid px-3 gap-1 shadow-md'>
                        <input type='text' value={budget} onChange={(e) => setBudget(e.target.value)} placeholder='Budget in PKR' className={`py-3 bg-transparent placeholder:text-[#a4a4a4] text-[14px] lg:text-base flex-1 outline-none inter`} />

                        <div>
                            <TooltipProvider>
                                <Tooltip open={showTip} onOpenChange={() => setShowTip(!showTip)}>
                                    <TooltipTrigger className='translate-y-[4px]'><HelpCircle onClick={() => setShowTip(true)} onFocus={() => setShowTip(true)} onBlur={() => setShowTip(false)} size={20} color='#202020' /></TooltipTrigger>
                                    <TooltipContent className='relative z-[200]'>
                                        <p className='inter w-32 text-center'>Enter your total budget. The fare will be split among passengers, reducing your cost as more people join.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <h1 className='text-[11px] inter text-[#202020]'>(Optional)</h1>
                <Checkbox text='Willing to negotiate' setter={setNegotiate} item={negotiate} />
            </div>

            <div className='flex flex-col gap-1'>
                <h1 className='text-[11px] inter text-[#202020]'>(Optional)</h1>
                <Checkbox text='Recurring ride' setter={setRecurring} item={recurring} />

                {recurring && <div className='relative mt-2'>

                    <div onClick={() => setShowRecurring(!showRecurring)} className='relative w-32 sm:w-36 cursor-pointer flex justify-between items-center bg-white p-3 rounded-md shadow-md'>

                        <div className='flex items-center text-sm inter gap-1'>

                            {recurringVal}

                        </div>

                        <ChevronDown size={17} className='transition-all duration-200' style={{ transform: showRecurring ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color='#202020' />

                    </div>

                    <div className='absolute mt-1' style={{ transition: 'all 0.1s ease-in-out', zIndex: showRecurring ? '30' : '-30', transform: showRecurring ? 'scale(1)' : 'scale(0.8)', opacity: showRecurring ? '1' : '0' }}>
                        <ScrollArea className='w-32 justify-center sm:w-36 p-1 flex flex-col bg-[#fefefe] shadow-md rounded-lg inter h-28'>
                            {recurrings.map((e, index) => {
                                return (
                                    <button key={index} className='p-1.5 hover:bg-gray-100 rounded-md w-full cursor-pointer text-sm text-start' onClick={() => {
                                        setRecurringVal(e)
                                        setShowRecurring(false)
                                    }}>{e}</button>
                                )
                            })}
                        </ScrollArea>
                    </div>

                </div>}
            </div>

        </div>
    )
}

export default Budget
