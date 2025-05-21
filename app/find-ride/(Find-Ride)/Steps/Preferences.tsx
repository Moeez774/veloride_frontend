import { ChevronDown, HelpCircle, Users } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import Checkbox from '@/components/hooks/Checkbox'
import Vehicle from '@/components/hooks/Vehicle'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Radios from '@/components/Radios'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface Details {
    luggage: boolean,
    setLuggage: Dispatch<SetStateAction<boolean>>,
    petFriendly: boolean,
    setPetFriendly: Dispatch<SetStateAction<boolean>>,
    smoking: boolean,
    setSmoking: Dispatch<SetStateAction<boolean>>,
    showGender: boolean,
    setShowGender: Dispatch<SetStateAction<boolean>>,
    gender: any,
    setGender: Dispatch<SetStateAction<any>>,
    ride: string,
    setRide: Dispatch<SetStateAction<string>>,
    vehicle: string,
    setVehicle: Dispatch<SetStateAction<string>>,
}

const Preferences: React.FC<Details> = ({ luggage, setLuggage, petFriendly, setPetFriendly, showGender, setShowGender, smoking, setSmoking, gender, setGender, ride, setRide, setVehicle, vehicle }) => {

    const pathname = usePathname()
    const authContext = useAuth()
    const user = authContext?.user || null
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const [showToolTip1, setShowToolTip1] = useState(false)
    const [showToolTip2, setShowToolTip2] = useState(false)

    //rideTypes
    const [music, setMusic] = useState(false)
    const [quiet, setQuiet] = useState(false)
    const [social, setSocial] = useState(false)
    const [fast, setFast] = useState(false)
    const allTypes = [setMusic, setQuiet, setSocial, setFast]

    return (
        <div className={`flex w-[80vw] sm:w-[30rem] lg:w-[22rem] flex-col gap-6 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>

            {/* inputs about ride type */}
            <div className='flex flex-col w-full gap-4'>
                <div className='flex w-full items-center justify-between gap-1.5'>
                    <label htmlFor="" className={`inter font-medium text-[14px] flex items-end gap-1 ${toggleTheme ? 'text-[#fefefe]' : ''}`}>Ride type <p className={`text-[11px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#202020]'}`}>(Optional)</p></label>
                    <TooltipProvider>
                        <Tooltip open={showToolTip1} onOpenChange={() => {
                            if (window.matchMedia("(max-width: 1023px)").matches) setShowToolTip1(false)
                            else setShowToolTip1(!showToolTip1)
                        }}>
                            <TooltipTrigger
                                onFocus={() => {
                                    if (window.matchMedia("(max-width: 1023px)").matches) setShowToolTip1(true)
                                }}
                                onClick={() => {
                                    if (window.matchMedia("(max-width: 1023px)").matches) setShowToolTip1(true)
                                }}
                                onMouseEnter={() => {
                                    if (window.matchMedia("(min-width: 1024px)").matches) setShowToolTip1(true)
                                }}
                                onMouseLeave={() => {
                                    if (window.matchMedia("(min-width: 1024px)").matches) setShowToolTip1(false)
                                }}
                            >
                                <HelpCircle size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                            </TooltipTrigger>
                            <TooltipContent className={`inter relative z-[100] w-48 text-center text-[#fefefe] bg-[#00563c]`}>
                                <p>{pathname.startsWith('/offer-ride') ? 'Set your ride type, like music friendly, quiet, or social ride, to customize your offered ride.' : 'Select your preferred ride experience, like music-friendly, quiet, or kind & friendly.'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* //for selecting ride type */}
                <div className='w-full grid grid-cols-2 gap-2'>
                    <Radios text="Music friendly" item={music} setItemName={setRide} setter={setMusic} arr={allTypes} />
                    <Radios text="Social ride" item={social} setItemName={setRide} setter={setSocial} arr={allTypes} />
                    <Radios text="Quiet ride" item={quiet} setItemName={setRide} setter={setQuiet} arr={allTypes} />
                    <Radios text="Fast ride" item={fast} setItemName={setRide} setter={setFast} arr={allTypes} />
                </div>
            </div>

            <div className='flex flex-col gap-4'>

                <div className='flex items-center justify-between gap-2'>
                    <h1 className={`text-[14px] font-medium inter flex items-end gap-1 ${toggleTheme ? 'text-[#fefefe]' : ''}`}>Ride preferences <p className={`text-[11px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#202020]'}`}>(Optional)</p></h1>
                    <TooltipProvider>
                        <Tooltip open={showToolTip2} onOpenChange={() => setShowToolTip2(false)}>
                            <TooltipTrigger onMouseLeave={() => setShowToolTip2(false)} onMouseEnter={() => setShowToolTip2(true)} onClick={() => setShowToolTip2(true)} onBlur={() => setShowToolTip2(false)}>
                                <HelpCircle size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                            </TooltipTrigger>
                            <TooltipContent className={`inter relative z-[100] w-48 text-center bg-[#00563c] text-[#fefefe]`}>
                                <p>{pathname.startsWith('/offer-ride') ? 'Set ride preferences such as smoking, luggage, or pet-friendly options to let passengers know what to expect.' : 'Select ride preferences such as smoking, luggage, or pet-friendly options to match your ideal ride experience.'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className='flex flex-col gap-2'>

                    <div className='flex items-center justify-between'>
                        <Checkbox text='Luggage allowed' item={luggage} setter={setLuggage} />
                        <Checkbox text={pathname.startsWith("/find-ride") ? 'Pet friendly' : 'Pet allowed'} item={petFriendly} setter={setPetFriendly} />
                    </div>

                    <div>
                        <Checkbox item={smoking} setter={setSmoking} text='Smoking allowed' />
                    </div>

                </div>

            </div>

            <div className={`inter flex justify-between w-full items-end`}>

                {pathname.startsWith("/find-ride") && user?.gender === "female" && <div>
                    <label className={`text-xs ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>(Optional)</label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className={`${toggleTheme ? 'bg-[#202020] border border-[#202020]' : 'bg-[white] border-none'} w-[150px] py-5 shadow-md`}>
                            <SelectValue className={`placeholder:font-medium text-[#fefefe] ${toggleTheme ? 'placeholder:text-[#fefefe]' : 'placeholder:text-[#202020]'}`} placeholder='Gender' />
                        </SelectTrigger>
                        <SelectContent className={`${toggleTheme ? 'bg-[#0d0d0d] border text-[#fefefe] border-[#202020]' : 'bg-[#fefefe] text-[#202020]'} inter`}>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div> }

                {/* // for choosing type of vehicel */}
                {pathname.startsWith("/find-ride") && <Vehicle vehicle={vehicle} setVehicle={setVehicle} />}
            </div>
        </div>
    )
}

export default Preferences
