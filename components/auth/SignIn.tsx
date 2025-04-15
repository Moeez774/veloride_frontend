'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import './Auth.css'
import SignUp from './SignUp'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from 'next/link'
import { getContacts } from '@/context/ContactsProvider'
import { Eye, EyeOff } from 'lucide-react'
import Loader from '../Loader'

const SignIn = () => {

    const router = useRouter()
    const [email, setEmail] = useState('')
    const [value, setValue] = useState('')
    const [toggleForm, setToggle] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [step, setStep] = useState(0)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [showSteps, setShowSteps] = useState(false)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    // sending signin request to backend
    const signIn = async () => {
        setMessage('')
        try {
            let a = await fetch('http://localhost:4000/users/sign-in', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, pass: value, remember: false })
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                router.push('/authorization')
            }
            else {
                setShowMessage(true)
                setMessage(response.message)
            }
        }
        catch (err: unknown) {
            setShowMessage(true)
            setMessage(String(err))
        }
    }

    const delay = async (ms: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))

    // for proceeding next
    const proceed = async () => {
        setShowSteps(true)
        if (!toggleForm) signIn()
        else if (email != '' && value != '') {
            setStep(prev => prev + 1)

            setTimeout(async () => {
                let a = await fetch('http://localhost:4000/users/user-existance', {
                    method: "POST", headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: email })
                })

                let response = await a.json()
                if (response.statusCode === 200) {
                    setStep(prev => prev + 1)
                    setShowSteps(false)

                    await delay(400)
                    setStep(prev => prev + 1)
                    await delay(50)
                    setStep(prev => prev + 1)
                }
                else {
                    setStep(0)
                    setShowSteps(false)
                    // setMessage(response.message)
                    // setShowMessage(true)
                }
            }, 800)
        }
        else {
            setShowMessage(true)
            setMessage("Please fill in all the requied fields.")
        }
    }

    return (
        <>
            {showSteps && <Loader setLoader={setShowSteps} message={message} showMessage={showMessage} setShowMessage={setShowMessage} />}

            <div className={`inter font-medium overflow-x-hidden min-h-screen delay-100 w-full transition-all duration-700 flex`}>

                <div className={`relative hidden md:flex flex-col gap-4 transition-all duration-700 justify-between ${step != 0 ? 'px-0 w-16' : 'w-full px-6 lg:px-10'} py-14 overflow-hidden max-w-[20rem] lg:max-w-[23rem] xl:max-w-[26rem] bg-[#00563C]`}>

                    {step === 0 && <div className='relative flex flex-col gap-8'>
                        <div className='w-full flex justify-between'>
                            <img className='w-11' src='/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png' />

                            <div className='absolute right-0 -translate-y-6'>
                                <div className='w-14 h-14 rounded-full bg-[#00402D]'></div>
                                <div className={`w-14 h-14 rounded-full -ml-8 transition-all duration-200 relative -mt-5 bg-[#02835D] ${toggleForm ? 'opacity-[1]' : 'opacity-0'}`}></div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h1 className='font-semibold text-[28px] lg:text-[32px] text-[#fefefe] leading-[42px] lg:leading-[45px] w-auto lg:w-80'>{toggleForm ? 'Join Veloride & Share the Journey Smarter' : 'Log In & Ride Smarter with VeloRide'}</h1>
                            <h1 className='font-light text-[#eeeeee] text-[13px] lg:text-sm'>{toggleForm ? 'Sign up to ride, save, and connect. Smarter travel starts here!' : 'Sign in to find your next ride and share the journey.'}</h1>
                        </div>
                    </div>}

                    <div className={`absolute top-0 min-h-screen flex w-full items-center left-8`}>
                        <div className='w-14 h-14 rounded-full mt-40 bg-[#00402D]'></div>
                        {step === 0 && <div className={`w-14 h-14 rounded-full transition-all duration-200 relative mt-56 -ml-5 ${!toggleForm ? 'opacity-[1]' : 'opacity-0'} bg-[#02835D]`}></div>}
                    </div>

                    {step === 0 && <h1 className='font-light text-[13px] text-[#eeeeee]'>{toggleForm ? 'Sign up to unlock a world where every ride connects you with people, purpose, and possibilities. This is the start of your VeloRide journey.' : 'Every journey is more than just a destination, It’s about riding with people who get you. Welcome again to the future of travel.'}</h1>}

                </div>

                <div className='flex-1 flex text-[#202020] mx-5 sm:mx-8 w-full'>

                    {/* //all steps of sign up */}
                    {step >= 3 && <div className={`transition-all md:max-w-6xl md:px-6 xl:px-0 pt-12 flex items-center mx-auto min-h-screen w-full duration-400 ease-out ${step >= 4 ? 'translate-x-0 opacity-[1]' : 'translate-x-12 opacity-0'}`}>
                        <SignUp email={email} fullname={value} step={step} toggleTheme={toggleTheme} setStep={setStep} />
                    </div>}

                    {/* Sign in form */}
                    {step < 3 && <div className={`md:max-w-xl w-full min-h-screen flex py-10 flex-col gap-8 justify-center mx-auto transition-all duration-400 ease-out ${step > 1 ? '-translate-x-12 opacity-0' : 'translate-x-0 opacity-[1] '}`}>

                        <img className='w-12 md:hidden sm:w-14' src='/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png' />

                        <div className='flex flex-col w-full gap-3'>
                            <h1 className={`font-semibold text-[26px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{toggleForm ? 'Create your account' : 'Login to your account'}</h1>
                            <h1 className={`flex items-center font-medium text-sm gap-1 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{toggleForm ? "Have an account?" : "Don't have an account?"} <p className={`font-semibold ${toggleTheme ? 'text-[#048C64] hover:text-[#048c64ccc]' : 'text-[#00563c] hover:text-[#00563ccc]'} transition-all duration-200 cursor-pointer`} onClick={() => {
                                setToggle(!toggleForm)
                                setEmail('')
                                setValue('')
                            }}>{toggleForm ? 'Login' : 'Sign up'}</p></h1>

                            <button className='border cursor-pointer flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm mt-8 py-[0.95rem] w-full'>
                                <img className='w-5' src='/Images/google-icon.svg' />
                                <h1 className={`text-[12px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Continue with Google</h1>
                            </button>
                        </div>

                        <div className='w-full flex mt-2 items-center gap-2'>
                            <div className='h-[2px] w-full bg-[#b5b5b541]'></div>
                            <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>OR</h1>
                            <div className='h-[2px] w-full bg-[#b5b5b541]'></div>
                        </div>

                        <div className='flex w-full items-center flex-col gap-4'>

                            <div className='flex w-full flex-col gap-1.5'>
                                <label className={`text-[13px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Email</label>
                                <input value={email} type='email' onChange={(e) => setEmail(e.target.value)} className={`border outline-none font-normal focus:shadow-lg transition-all duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm p-[0.90rem] w-full ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} />
                            </div>

                            <div className='flex w-full flex-col gap-1.5'>
                                <label className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-[13px]`}>{toggleForm ? 'Your name' : 'Password'}</label>
                                <div className='w-full flex items-center gap-2'>
                                    <input value={value} type={toggleForm || showPass ? 'text' : 'password'} onChange={(e) => setValue(e.target.value)} className={`border outline-none font-normal focus:shadow-lg transition-all w-full duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm pl-[0.90rem] pr-12 py-[0.90rem] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} />
                                    {!showPass && !toggleForm && <Eye onClick={() => setShowPass(true)} size={20} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                                    {showPass && !toggleForm && <EyeOff size={20} onClick={() => setShowPass(false)} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                                </div>
                            </div>

                            {!toggleForm && <Link href={'/reset-password'} ><h1 className={`${toggleTheme ? 'text-[#b1b1b1] hover:text-[#fefefe]' : 'text-[#5b5b5b] hover:text-[#202020]'} my-2 w-fit cursor-pointer transition-all duration-200 font-medium text-xs sm:text-[13px]`}>Forgot password?</h1></Link>}

                            {toggleForm && <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} my-2 text-center justify-center font-medium text-xs sm:text-[13px] flex flex-wrap items-center gap-1`}>By signing up, you agree to our <p className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-semibold`}>Terms & Conditions</p> and <p className={`text-[#202020] font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Privacy Policy</p></h1>}

                            <button disabled={showSteps ? true : false} onClick={() => proceed()} className={`flex gap-3 items-center justify-center mt-2 md:mt-0 bg-[#00563c] text-[#fefefe] text-sm ${showSteps ? 'hover:bg-[#00563c]' : 'hover:bg-[#00563ccc] cursor-pointer'} active:bg-[#00563c] transition-all duration-200 rounded-md p-4 w-full`}>
                                {toggleForm && !showSteps ? 'Signup' : !toggleForm && !showSteps ? 'Login' :
                                    <svg className='authLoader' viewBox="25 25 50 50">
                                        <circle className='authCircle' r="20" cy="50" cx="50"></circle>
                                    </svg>}
                            </button>

                        </div>
                    </div>}
                </div>

            </div>
        </>
    )
}

export default SignIn