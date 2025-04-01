'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { CheckIcon, Eye, EyeOff } from 'lucide-react'
import Buttons from './Buttons'
import Loader from '../Loader'
import { signUserUp } from '@/functions/function'
import Link from 'next/link'
import Password from './Password'

const SignUp = () => {

    const router = useRouter()

    const [fullname, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [number, setNumber] = useState('')
    const [city, setCity] = useState('')

    const [agree, setAgree] = useState(false)

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    // for live typing
    const [isFocused, setFocused] = useState(false)
    const [showPass, setShowPass] = useState(false)

    // sending signup request to backend
    const signUp = async () => await signUserUp(setLoader, setMessage, email, fullname, pass, confirmPass, number, city, agree, setShowMessage, router)

    return (

        <>

            {loader && <Loader setLoader={setLoader} message={message} showMessage={showMessage} setShowMessage={setShowMessage} />}

            <div>

                <div className='inter min-h-screen overflow-x-hidden text-[#202020] sm:px-10 justify-center w-full items-center gap-10 flex' style={{ userSelect: 'none' }}>

                    {/* form */}
                    <div className='flex flex-col h-screen shadow-2xl px-10 lg:px-0 max-w-5xl items-center justify-center w-full gap-5'>

                        {/* logo */}
                        <div className='flex justify-center'>
                            <img className='w-16 sm:w-20' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                        </div>

                        {/* //headings */}
                        <div className='flex text-center flex-col gap-2'>

                            <h1 className='exo2 font-semibold text-2xl sm:text-3xl'>Join VeloRide & Share the Journey Smarter!</h1>

                            <h1 className='inter font-normal text-base'>Sign up to ride, save, and connect—smarter travel starts here!</h1>

                        </div>

                        <div className='flex flex-col w-[82vw] sm:w-auto gap-5'>
                            {/* Inputs */}
                            <div className='flex flex-col w-full gap-2'>

                                <div className='flex flex-col lg:flex-row items-center gap-2'>
                                    <div>
                                        <input type="text" placeholder='Full name' value={fullname} onChange={(e) => setFullName(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] text-sm sm:text-base rounded-lg border-solid shadow-md pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                                    </div>

                                    <div className='flex flex-col gap-1.5'>
                                        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid text-sm sm:text-base shadow-md pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                                    </div>
                                </div>

                                <div className='flex flex-col lg:flex-row items-center gap-2'>

                                    <Password pass={pass} setPass={setPass} />

                                    <div className={`bg-[#fefefe] px-3 w-[82vw] sm:w-96 lg:w-[22rem] border-[1.5px] ${isFocused ? 'border-[#202020]' : 'border-[#979797]'} rounded-lg border-solid shadow-md flex items-center`}>
                                        <input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Confirm password" className={`py-3 text-sm sm:text-base flex-1 pr-1 outline-none`} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
                                        <Eye size={20} color={isFocused || confirmPass.length > 0 ? '#202020' : '#979797'} onClick={() => setShowPass(true)} className={`${!showPass ? 'block' : 'hidden'} cursor-pointer`} />
                                        <EyeOff size={20} color={isFocused || confirmPass.length > 0 ? '#202020' : '#979797'} onClick={() => setShowPass(false)} className={`${showPass ? 'block' : 'hidden'} cursor-pointer`} />
                                    </div>

                                </div>

                                <div className='flex flex-col lg:flex-row items-center gap-2'>
                                    <div>
                                        <input type="text" placeholder='Phone number' value={number} onChange={(e) => setNumber(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md  text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                                    </div>

                                    <div className='flex flex-col gap-1.5'>
                                        <input type="text" placeholder='City or Location' value={city} onChange={(e) => setCity(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                                    </div>
                                </div>

                            </div>

                            {/* //remember me */}
                            <div className='flex justify-start items-center gap-1.5'>
                                <div className='w-[23px] h-[23px] flex items-center cursor-pointer justify-center rounded-full shadow-md' onClick={() => setAgree(!agree)} style={{ border: '1.5px solid #979797' }}>
                                    <CheckIcon className={`${agree ? 'block' : 'hidden'}`} size={13} color='#202020' />
                                </div>
                                <div>
                                    <h1 className='text-xs flex items-center gap-1'>I agree to <p className='underline'>Terms</p> and <p className='underline'>Privacy Policy</p> </h1>
                                </div>
                            </div>

                            {/* buttons */}
                            <div className='flex flex-col items-center gap-2'>

                                <Buttons btText='Sign up' func={signUp} />

                                <div className='mt-1'>
                                    <h1 className='text-xs justify-center w-96 font-medium flex items-center gap-0.5 text-[#202020]'>Already have an account? <Link href='/auth/sign-in' ><p className='font-bold underline cursor-pointer' >Sign in here</p></Link> </h1>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default SignUp