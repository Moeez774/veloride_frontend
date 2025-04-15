'use client'
import { useRouter } from 'next/navigation'
import React, { useState, Dispatch, SetStateAction } from 'react'
import { Check, User2, Eye, EyeOff } from 'lucide-react'
import { signUserUp } from '@/functions/function'
interface Details {
    step: number,
    setStep: Dispatch<SetStateAction<number>>,
    toggleTheme: boolean | undefined,
    fullname: string,
    email: string
}

const SignUp: React.FC<Details> = ({ step, setStep, toggleTheme, email, fullname }) => {

    const router = useRouter()
    const [pass, setPass] = useState('')
    const [number, setNumber] = useState('')
    const [city, setCity] = useState('')
    const [rider, setRider] = useState(false)
    const [driver, setDriver] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [loader, setLoader] = useState(false)

    // sending signup request to backend
    const signUp = async () => await signUserUp(setLoader, email, fullname, pass, number, city, router)

    const delay = async (ms: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))

    const proceed = async () => {
        setStep(prev => prev + 1)
        await delay(400)
        setStep(prev => prev + 1)
        await delay(100)
        setStep(prev => prev + 1)
    }

    const back = async () => {
        setStep(prev => prev - 1)
        await delay(400)
        setStep(prev => prev - 1)
        await delay(100)
        setStep(prev => prev - 1)
    }

    return (
        <div className='w-full flex flex-col items-center h-full'>

            <div className='w-full flex items-center justify-between'>
                <img className='w-11' src='/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png' />

                <div className='p-2 rounded-full border border-[#b5b5b5]'><User2 size={18} color={toggleTheme ? '#fefefe' : '#202020'} /></div>
            </div>

            <div className='w-full flex px-8 md:mx-0 mt-12 sm:mt-10 md:mt-0 max-w-sm mx-auto items-center justify-center'>
                <div className={`p-[6px] transition-all duration-200 rounded-full ${step >= 4 ? 'bg-[#00563c]' : 'bg-[#b5b5b5]'}`}></div>
                <div className={`h-[2px] w-full ${toggleTheme ? 'bg-[#b1b1b1]' : 'bg-[#5b5b5b]'}`}><div className={`bg-[#00563c] transition-all duration-300 ${step >= 5 ? 'w-full' : 'w-0'} h-[2px]`}></div></div>
                <div className={`p-[6px] rounded-full ${step >= 5 ? 'bg-[#00563c]' : 'bg-[#b5b5b5]'}`}></div>
                <div className={`h-[2px] w-full ${toggleTheme ? 'bg-[#b1b1b1]' : 'bg-[#5b5b5b]'}`}><div className={`bg-[#00563c] transition-all duration-300 ${step >= 8 ? 'w-full' : 'w-0'} h-[2px]`}></div></div>
                <div className={`p-[6px] rounded-full ${step >= 8 ? 'bg-[#00563c]' : 'bg-[#b5b5b5]'}`}></div>
            </div>

            <div className='h-full md:max-w-xl w-full flex mx-auto'>

                {step < 6 && <div className={`flex h-full w-full ease-out transition-all duration-400 flex-col ${step === 5 ? '-translate-x-12 opacity-0' : 'translate-x-0 opacity-[1]'} justify-center gap-12`}>
                    <div className='flex flex-col gap-4'>
                        <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-3xl font-semibold`}>Choose Your Role</h1>
                        <h1 className={`font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-sm`}>Are you planning to drive or looking for a ride? Let us know to match you better.</h1>
                    </div>

                    <div className='w-full flex flex-col gap-5'>
                        <button onClick={() => {
                            setRider(true)
                            setDriver(false)
                        }} className={`${rider ? 'border border-[#00563c]' : 'border border-[#c7c7c7]'} cursor-pointer flex gap-3 items-center transition-all duration-300 rounded-md shadow-sm py-8 px-9 w-full`}>
                            <div className='flex items-center gap-5'>
                                <div className={`p-[4px] border transition-all duration-200 rounded-full ${rider ? 'bg-[#00563c] border-transparent' : 'border-[#b5b5b5] bg-transparent'}`}><Check className={`${rider ? 'opacity-[1]' : 'opacity-0'}`} size={14} color='#fefefe' /> </div>
                                <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>I'm looking for a ride</h1>
                            </div>
                        </button>

                        <button onClick={() => {
                            setDriver(true)
                            setRider(false)
                        }} className={`${driver ? 'border border-[#00563c]' : 'border border-[#c7c7c7]'} cursor-pointer flex gap-3 items-center rounded-md transition-all duration-300 shadow-sm py-8 px-9 w-full`}>
                            <div className='flex items-center gap-5'>
                                <div className={`p-[4px] border transition-all duration-200 rounded-full ${driver ? 'bg-[#00563c] border-transparent' : 'border-[#b5b5b5] bg-transparent'}`}><Check className={`${driver ? 'opacity-[1]' : 'opacity-0'}`} size={14} color='#fefefe' /> </div>
                                <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>I'm planning to drive</h1>
                            </div>
                        </button>
                    </div>

                    <div className='flex items-center justify-end gap-10 mt-4'>
                        <button className={`${toggleTheme ? 'text-[#048C64] hover:text-[#048C64ccc] active:text-[#048C64]' : 'text-[#00563c] hover:text-[#00563ccc] active:text-[#00563c]'} font-semibold cursor-pointer transition-all duration-200 text-sm`} onClick={() => proceed()}>Skip</button>
                        <button className='text-[#fefefe] active:bg-[#00563c] bg-[#00563c] cursor-pointer hover:bg-[#00563ccc] transition-all duration-200 px-12 sm:px-14 py-[0.90rem] sm:py-4 rounded-md font-medium text-sm' onClick={() => proceed()}>Continue</button>
                    </div>
                </div>}

                {step >= 6 && step < 9 && <div className={`flex w-full ease-out h-full ${step === 7 ? 'opacity-[1] translate-x-0' : step === 8 ? '-translate-x-12 opacity-0' : ' opacity-0 translate-x-12'} flex-col transition-all duration-400 justify-center ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-3xl font-semibold'>Complete Your Details</h1>
                        <h1 className={`font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-sm`}>Just a few more details to get you rolling, your city, phone, and a secure password.</h1>
                    </div>

                    <div className='flex flex-col mt-8 gap-1.5'>
                        <label className='text-[13px]'>Your city or location</label>
                        <input value={city} onChange={(e) => setCity(e.target.value)} className='border outline-none font-normal focus:shadow-lg transition-all duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm p-[0.90rem] w-full' />
                    </div>

                    <div className='flex flex-col mt-4 gap-1.5'>
                        <label className='text-[13px]'>Phone number</label>
                        <input value={number} onChange={(e) => setNumber(e.target.value)} className='border outline-none font-normal focus:shadow-lg transition-all duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm p-[0.90rem] w-full' />
                    </div>

                    <div className='flex flex-col mt-4 gap-1.5'>
                        <label className='text-[13px]'>Password</label>
                        <div className='w-full flex items-center gap-2'>
                            <input value={pass} type={showPass ? 'text' : 'password'} onChange={(e) => setPass(e.target.value)} className={`border outline-none font-normal focus:shadow-lg transition-all w-full duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm pl-[0.90rem] pr-12 py-[0.90rem] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} />
                            {!showPass && <Eye onClick={() => setShowPass(true)} size={20} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                            {showPass && <EyeOff size={20} onClick={() => setShowPass(false)} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-10 mt-10'>
                        <button className={`${toggleTheme ? 'text-[#048C64] hover:text-[#048C64ccc] active:text-[#048C64]' : 'text-[#00563c] hover:text-[#00563ccc] active:text-[#00563c]'} font-semibold cursor-pointer transition-all duration-200 text-sm`} onClick={() => back()}>Back</button>
                        <button className='text-[#fefefe] active:bg-[#00563c] bg-[#00563c] cursor-pointer hover:bg-[#00563ccc] transition-all duration-200 px-12 sm:px-14 py-[0.90rem] sm:py-4 rounded-md font-medium text-sm' onClick={() => proceed()}>Continue</button>
                    </div>

                </div>}

                {step >= 9 && <div className={`flex w-full ease-out h-full ${step === 10 ? 'opacity-[1] translate-x-0' : step === 11 ? '-translate-x-12 opacity-0' : ' opacity-0 translate-x-12'} flex-col transition-all duration-400 justify-center gap-12 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-3xl font-semibold'>You’re All Set!</h1>
                        <h1 className={`font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#b5b5b5]'} text-sm`}>Let’s get you on the road—whether you’re driving or riding.</h1>
                    </div>

                    <div className='w-full flex justify-center'>
                        <img className='w-[330px]' src='/Images/Front-car-cuate.svg' />
                    </div>

                    <div className='flex items-center justify-end mt-4 gap-10'>
                        <button className={`${toggleTheme ? 'text-[#048C64] hover:text-[#048C64ccc] active:text-[#048C64]' : 'text-[#00563c] hover:text-[#00563ccc] active:text-[#00563c]'} font-semibold cursor-pointer transition-all duration-200 text-sm`} onClick={() => back()}>Back</button>
                        <button className='text-[#fefefe] active:bg-[#00563c] bg-[#00563c] cursor-pointer hover:bg-[#00563ccc] transition-all duration-200 px-12 sm:px-14 py-[0.90rem] sm:py-4 rounded-md font-medium text-sm' onClick={() => signUp()}>{!loader ? 'Hop in' :
                            <svg className='authLoader' viewBox="25 25 50 50">
                                <circle className='authCircle' r="20" cy="50" cx="50"></circle>
                            </svg>}</button>
                    </div>

                </div>}
            </div>
        </div>
    )
}

export default SignUp