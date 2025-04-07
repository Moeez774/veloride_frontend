import { ChevronDown, HelpCircle, Users } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Checkbox from './Checkbox'
import Vehicle from './Vehicle'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
interface Details {
    luggage: boolean,
    setLuggage: Dispatch<SetStateAction<boolean>>,
    petFriendly: boolean,
    setPetFriendly: Dispatch<SetStateAction<boolean>>,
    smoking: boolean,
    setSmoking: Dispatch<SetStateAction<boolean>>,
    needs: boolean,
    setNeeds: Dispatch<SetStateAction<boolean>>,
    showGender: boolean,
    setShowGender: Dispatch<SetStateAction<boolean>>,
    gender: any,
    setGender: Dispatch<SetStateAction<any>>,
    male: any,
    female: any,
    ride: string,
    setRide: Dispatch<SetStateAction<string>>,
    vehicle: string,
    setVehicle: Dispatch<SetStateAction<string>>,
    setGenderType: Dispatch<SetStateAction<string>>,
}

const Preferences: React.FC<Details> = ({ luggage, setLuggage, needs, setNeeds, petFriendly, setPetFriendly, showGender, setShowGender, smoking, setSmoking, gender, setGender, male, female, ride, setRide, setVehicle, vehicle, setGenderType }) => {

    const pathname = usePathname()
    const [showToolTip1, setShowToolTip1] = useState(false)
    const [showToolTip2, setShowToolTip2] = useState(false)

    return (
        <div className='flex w-[80vw] sm:w-[30rem] lg:w-[22rem] flex-col gap-6 text-[#202020]'>

            {/* inputs about ride type */}
            <div className='flex flex-col gap-1.5'>
                <label htmlFor="" className='inter font-medium text-[14px] flex items-end gap-1'>Ride type <p className='text-[11px] inter text-[#202020]'>(Optional)</p></label>
                <div className='bg-[#eaeaea] px-3 gap-1 w-[80vw] flex justify-between items-center sm:w-[30rem] lg:w-[22rem] rounded-md border-solid shadow-md'>
                    <input type='text' value={ride} onChange={(e) => setRide(e.target.value)} placeholder='Music friendly ride, Quiet ride etc.' className={`py-3 bg-[#EAEAEA] placeholder:text-[#a4a4a4] text-[14px] lg:text-base flex-1 outline-none inter`} />
                    <TooltipProvider>
                        <Tooltip open={showToolTip1} onOpenChange={() => setShowToolTip1(false)}>
                            <TooltipTrigger onMouseLeave={() => setShowToolTip1(false)} onMouseEnter={() => setShowToolTip1(true)} onClick={() => setShowToolTip1(true)} onBlur={() => setShowToolTip1(false)}><HelpCircle size={20} color='#202020' /></TooltipTrigger>
                            <TooltipContent className='inter w-48 text-center'>
                                <p>{pathname.startsWith('/offer-ride') ? 'Set your ride type, like music friendly, quiet, or social ride, to customize your offered ride.' : 'Select your preferred ride experience, like music-friendly, quiet, or kind & friendly.'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className='flex flex-col gap-3'>

                <div className='flex items-center justify-between gap-2'>
                    <h1 className='text-[14px] font-medium inter flex items-end gap-1'>Ride preferences <p className='text-[11px] inter text-[#202020]'>(Optional)</p></h1>
                    <TooltipProvider>
                        <Tooltip open={showToolTip2} onOpenChange={() => setShowToolTip2(false)}>
                            <TooltipTrigger onMouseLeave={() => setShowToolTip2(false)} onMouseEnter={() => setShowToolTip2(true)} onClick={() => setShowToolTip2(true)} onBlur={() => setShowToolTip2(false)}><HelpCircle size={20} color='#202020' /></TooltipTrigger>
                            <TooltipContent className='inter w-48 text-center'>
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

            <div className={`flex ${pathname.startsWith("/find-ride") ? 'flex-row-reverse' : 'flex-row'} justify-between w-full items-end`}>

                <div className='relative'>

                    <p className='text-[11px] inter text-[#202020]'>(Optional)</p>
                    <div onClick={() => setShowGender(!showGender)} className='relative w-32 sm:w-36 cursor-pointer flex justify-between items-center bg-white p-3 rounded-md shadow-md'>

                        <div className='flex items-center inter gap-1'>

                            {gender}

                        </div>

                        <ChevronDown size={17} className='transition-all duration-200' style={{ transform: showGender ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color='#202020' />

                    </div>

                    <div style={{ transition: 'all 0.1s ease-in-out', transform: showGender ? 'scale(1)' : 'scale(0.8)', opacity: showGender ? '1' : '0', userSelect: showGender ? 'auto' : 'none' }} className='inter absolute flex flex-col px-1.5 z-30 py-2.5 w-32 sm:w-36 mt-1 rounded-md bg-[#fefefe] shadow-md'>

                        <div onClick={() => {
                            if (showGender) {
                                setGender(male)
                                setGenderType("Male")
                                setShowGender(false)
                            }
                        }} className={`flex py-2 rounded-md ${showGender ? 'cursor-pointer' : 'cursor-default'} hover:bg-gray-100 transition-all duration-200 px-1.5 items-center gap-1.5`}>
                            {male}
                        </div>

                        <div onClick={() => {
                            if (showGender) {
                                setGender(female)
                                setGenderType("Female")
                                setShowGender(false)
                            }
                        }} className={`flex py-2 px-1.5 rounded-md ${showGender ? 'cursor-pointer' : 'cursor-default'} hover:bg-gray-100 transition-all duration-200 items-center gap-1.5`}>
                            {female}
                        </div>

                    </div>

                </div>
                {/* // for choosing type of vehicel */}
                {pathname.startsWith("/find-ride") && <Vehicle vehicle={vehicle} setVehicle={setVehicle} />}
            </div>

            <div className={`flex flex-col gap-3`}>

                <h1 className='text-[14px] font-medium inter flex items-center gap-1'>{pathname.startsWith('/find-ride') ? 'Accessability needs' : 'Accessability'}<p className='text-[11px] inter text-[#202020]'>(Optional)</p></h1>

                <div>
                    <Checkbox item={needs} setter={setNeeds} text={pathname.startsWith("'/find-ride") ? 'Wheelchair access' : 'Wheelchair available'} />
                </div>

            </div>


        </div>
    )
}

export default Preferences
