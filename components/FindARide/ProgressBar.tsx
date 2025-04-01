import { Check, ClipboardCheck, DollarSign, MapPin, Pencil, Sliders } from 'lucide-react'
import React from 'react'

interface Details {
    step: number,
    currStep: number,
    pathname: any,
}

const ProgressBar: React.FC<Details> = ({ step, currStep, pathname }) => {


    const boxes = [
        { n: 1, icon: <MapPin className={`${currStep >= 1 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} fill={currStep >= 1 ? '#00b37e' : 'transparent'} size={25} />, name: "Ride Details" },

        { n: 2, icon: <Sliders className={`${currStep >= 2 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} delay-200 transition-all duration-200`} fill={currStep >= 2 ? '#00b37e' : 'transparent'} size={25} />, name: "Personal Preferences" },

        { n: 3, icon: <DollarSign className={`${currStep >= 3 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={25} />, name: "Budget & Frequency" },

        { n: 4, icon: <Pencil className={`${currStep >= 4 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={25} />, name: "Additional Information" },

        { n: 5, icon: <ClipboardCheck className={`${currStep >= 5 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={25} />, name: pathname.startsWith('/find-ride')? 'Review & Find': 'Review & Offer' }
    ]

    return (
        <div className='flex items-center gap-12 xl:gap-24'>

            {/* // all steps */}
            <div className='hidden lg:flex flex-col gap-8'>

                <div className='flex gap-2'>

                    <div>
                        <MapPin className={`${currStep >= 1 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} fill={currStep >= 1 ? '#00b37e' : 'transparent'} size={30} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-xs inter text-[#b7b7b7]/70'>Step 1</h1>
                        <h1 className={`transition-all delay-200 duration-200 exo2 font-semibold text-lg ${currStep >= 1 ? 'text-[#202020]' : 'text-[#b7b7b7]/70'}`}>Ride Details</h1>
                    </div>

                </div>

                <div className='flex gap-2'>

                    <div>
                        <Sliders className={`${currStep >= 2 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} delay-200 transition-all duration-200`} fill={currStep >= 2 ? '#00b37e' : 'transparent'} size={30} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-xs inter text-[#b7b7b7]/70'>Step 2</h1>
                        <h1 className={`transition-all delay-200 duration-200 exo2 font-semibold text-lg ${currStep >= 2 ? 'text-[#202020]' : 'text-[#b7b7b7]/70'}`}>Personal Preferences</h1>
                    </div>

                </div>

                <div className='flex gap-2'>

                    <div>
                        <DollarSign className={`${currStep >= 3 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={30} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-xs inter text-[#b7b7b7]/70'>Step 3</h1>
                        <h1 className={`transition-all delay-200 duration-200 exo2 font-semibold text-lg ${currStep >= 3 ? 'text-[#202020]' : 'text-[#b7b7b7]/70'}`}>Budget & Frequency</h1>
                    </div>

                </div>

                <div className='flex gap-2'>

                    <div>
                        <Pencil className={`${currStep >= 4 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={30} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-xs inter text-[#b7b7b7]/70'>Step 4</h1>
                        <h1 className={`transition-all delay-200 duration-200 exo2 font-semibold text-lg ${currStep >= 4 ? 'text-[#202020]' : 'text-[#b7b7b7]/70'}`}>Additional Information</h1>
                    </div>

                </div>

                <div className='flex gap-2'>

                    <div>
                        <ClipboardCheck className={`${currStep >= 5 ? 'text-[#00b37e]' : 'text-[#b7b7b7]/70'} transition-all duration-200 delay-200`} size={30} />
                    </div>

                    <div className='flex flex-col'>
                        <h1 className='text-xs inter text-[#b7b7b7]/70'>Step 5</h1>
                        <h1 className={`transition-all delay-200 duration-200 exo2 font-semibold text-lg ${currStep >= 5 ? 'text-[#202020]' : 'text-[#b7b7b7]/70'}`}>{pathname.startsWith("/find-ride")? 'Review & Find': 'Review & Offer'}</h1>
                    </div>


                </div>

            </div>

            <div className='w-[90vw] sm:w-[35rem] md:w-[40rem] h-1 lg:h-[25rem] lg:w-1 bg-[#b7b7b7]/70 -translate-y-1'>

                <div className='absolute w-[90vw] sm:w-[35rem] md:w-[40rem] lg:w-auto lg:h-[25rem] flex lg:flex-col justify-around -translate-y-[2.7rem] lg:translate-y-0 lg:-translate-x-[0.65rem]'>

                    {boxes.map((e, index) => {
                        return (
                            <div key={index} className='flex lg:block w-[8rem] gap-2 flex-col items-center'>

                                {/* //icons for mobile screens */}
                                <div className='lg:hidden'>
                                    {e.icon}
                                </div>

                                <div className={`w-[1.5rem] transition-all duration-200 delay-200 flex justify-center items-center ${index + 1 <= step ? 'bg-[#00b37e]' : index + 1 <= currStep ? 'bg-[#fefefe]' : 'bg-[#b7b7b7]'} h-[1.5rem] rounded-full`} style={{ border: index + 1 <= currStep ? '2px solid #00b37e' : 'none' }}>
                                    <Check color='#fefefe' style={{ transition: 'all 0.2s ease-in-out 0.2s', transform: index + 1 <= step ? 'scale(1)' : 'scale(0)' }} size={15} />
                                </div>

                                <div className='lg:hidden'>
                                    <h1 className='text-[10px] leading-[13px] sm:leading-normal sm:text-sm text-center font-semibold exo2 text-[#202020]'>{e.name}</h1>
                                </div>
                            </div>
                        )
                    })}

                </div>

                {/* // progress indicator */}
                <div className={`${currStep === 1 ? 'w-[8vw] sm:w-[4rem] lg:h-[3rem]' : currStep === 2 ? 'w-[26vw] sm:w-[10rem] md:w-[12rem] lg:h-[8rem]' : currStep === 3 ? 'w-[44vw] sm:w-[18rem] md:w-[20rem] lg:h-[13rem]' : currStep === 4 ? 'w-[63vw] sm:w-[24rem] md:w-[28rem] lg:h-[18rem]' : currStep === 5 ? 'w-[82vw] sm:w-[32rem] md:w-[36rem] lg:h-[23rem]' : currStep === 6 ? 'w-[91vw] sm:w-[35rem] md:w-[40rem] lg:h-[25rem]' : 'w-0 lg:h-0'} h-1 lg:w-1 transition-all duration-300 bg-[#00b37e]`}></div>

            </div>

        </div>
    )
}

export default ProgressBar
