'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import '@/components/commonOnes/Commons.css'
import SignUp from './SignUp'
import { handlingProceeding, handleGoogleAuth, saveUserData } from '@/functions/function'
import Link from 'next/link'
import { getContacts } from '@/context/ContactsProvider'
import { Eye, EyeOff, Fingerprint, ArrowLeft } from 'lucide-react'
import Loader from '@/components/Loader'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import countries from '@/public/data/countries.json'

interface PasswordProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    showPass: boolean,
    toggleForm: boolean,
    toggleTheme: boolean | undefined,
    setShowPass: Dispatch<SetStateAction<boolean>>,
    error?: string
}

const PasswordField = ({ value, setValue, showPass, toggleForm, toggleTheme, setShowPass, error }: PasswordProps) => {
    return (
        <div className='w-full flex items-center gap-2'>
            <input
                value={value}
                type={toggleForm ? 'text' : (showPass ? 'text' : 'password')}
                onChange={(e) => setValue(e.target.value)}
                placeholder={toggleForm ? 'Enter your name' : 'Enter your password'}
                className={`border outline-none font-normal transition-all w-full duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md pl-[0.90rem] pr-12 py-[0.90rem] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-[#00563c]'}`}
            />
            {!toggleForm && (
                <>
                    {!showPass && <Eye onClick={() => setShowPass(true)} size={20} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                    {showPass && <EyeOff size={20} onClick={() => setShowPass(false)} className='cursor-pointer absolute right-4' color={toggleTheme ? '#fefefe' : '#202020'} />}
                </>
            )}
        </div>
    )
}

const SignIn = () => {

    const router = useRouter()
    const queries = useSearchParams()
    const [email, setEmail] = useState('')
    const [value, setValue] = useState('')
    const [gender, setGender] = useState('')
    const [forType, setForType] = useState(queries.get("for") ? queries.get("for") : '')
    const [toggleForm, setToggle] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [step, setStep] = useState(0)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [showSteps, setShowSteps] = useState(false)
    const [country, setCountry] = useState<string>(countries[0].phone)
    const [isProvider, setIsProvider] = useState(false)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const [loader, setLoader] = useState(false)
    const [role, setRole] = useState(queries.get("role") ? queries.get("role") : 'Any')
    const [number, setNumber] = useState('')
    const [city, setCity] = useState('')
    const [btnText, setBtnText] = useState('Reset password')
    const [errors, setErrors] = useState<{ email?: string; value?: string }>({})

    useEffect(() => {
        setForType(queries.get("for") ? queries.get("for") : '')
    }, [queries])

    // sending signin request to backend
    const signIn = async () => {
        setMessage('')
        try {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/sign-in`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, pass: value, remember: false })
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                router.push('/validation')
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

    // for getting user's info
    const [user, setUser] = useState<any>()
    // getting user's info if user sign in with providers
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.reload()
                setUser(user)
            }
            else setUser(null)
        })
        return () => unSubscribe()
    }, [])

    const delay = async (ms: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms))

    const validateFields = () => {
        const newErrors: { email?: string; value?: string } = {}

        if (!email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!value) {
            newErrors.value = toggleForm ? 'Name is required' : 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const proceed = async () => {
        if (!validateFields()) return
        handlingProceeding(setShowSteps, toggleForm, signIn, email, value, setStep, delay, setMessage, setShowMessage)
    }

    //for saving user's data if signing in with provider
    const saveUser = async (setLoader: Dispatch<SetStateAction<boolean>>) => saveUserData(setLoader, user, city, number, role, router, gender, country)

    //for handling google signin
    const googleAuth = async () => handleGoogleAuth(setLoader, router, setStep, delay, setShowSteps, (loader) => saveUser(loader), setIsProvider)

    const resetPassword = async () => {
        setMessage('')
        setShowSteps(true)
        try {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
                method: "PUT", headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, newPassword: value })
            })

            let response = await a.json()
            setTimeout(() => {
                if (response.statusCode === 200) {
                    setShowSteps(false)
                    setEmail('')
                    setValue('')
                    setBtnText('Password reset successfully!')
                    setTimeout(() => setBtnText('Reset password'), 2000)
                }
                else {
                    setShowMessage(true)
                    setMessage(response.message)
                }
            }, 100)
        }
        catch (err: unknown) {
            setShowMessage(true)
            setMessage(String(err))
        }
    }

    // Add error styles
    const getInputStyles = (field: 'email' | 'value') => {
        const baseStyles = `border outline-none font-normal transition-all duration-300 flex gap-3 items-center justify-center rounded-md p-[0.90rem] w-full ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`
        return errors[field]
            ? `${baseStyles} border-red-500 focus:border-red-500`
            : `${baseStyles} border-[#c7c7c7] focus:border-[#00563c]`
    }

    return (
        <>
            {showSteps && <Loader setLoader={setShowSteps} message={message} showMessage={showMessage} setShowMessage={setShowMessage} />}

            <div className={`inter font-medium min-h-screen delay-100 w-full transition-all duration-700 flex`}>

                <div className={`fixed top-0 left-0 hidden md:flex flex-col gap-4 transition-all duration-700 justify-between ${step != 0 ? 'px-0 w-16' : 'w-full px-6 lg:px-10'} py-14 overflow-hidden max-w-[20rem] lg:max-w-[22rem] xl:max-w-[26rem] bg-[#00563C] h-screen z-10`}>

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

                    {step === 0 && <h1 className='absolute bottom-0 pb-14 pr-6 flex items-end font-light text-[13px] text-[#eeeeee]'>{toggleForm ? 'Sign up to unlock a world where every ride connects you with people, purpose, and possibilities. This is the start of your VeloRide journey.' : "Every journey is more than just a destination, It's about riding with people who get you. Welcome again to the future of travel."}</h1>}

                </div>

                <div className={`flex-1 flex text-[#202020] mx-5 sm:mx-8 transition-all duration-300 w-full ${step != 0 ? 'md:pl-16' : 'md:pl-[20rem] lg:pl-[26rem]'}`}>

                    {/* //all steps of sign up */}
                    {step >= 3 && forType != 'reset-password' && <div className={`transition-all md:max-w-6xl md:px-6 xl:px-0 pt-12 flex items-center mx-auto min-h-screen w-full duration-400 ease-out ${step >= 4 ? 'translate-x-0 opacity-[1]' : 'translate-x-12 opacity-0'}`}>
                        <SignUp setter={setLoader} gender={gender} setGender={setGender} saveUser={saveUser} city={city} setShowSteps={setShowSteps} setMessage={setMessage} setShowMessage={setShowMessage} number={number} setNumber={setNumber} setCity={setCity} role={role} setRole={setRole} user={user} email={email} fullname={value} step={step} toggleTheme={toggleTheme} setStep={setStep} country={country} setCountry={setCountry} isProvider={isProvider} />
                    </div>}

                    {/* Sign in form */}
                    {step < 3 && forType != 'reset-password' && <div className={`md:max-w-xl w-full min-h-screen flex py-20 md:py-10 flex-col gap-8 justify-center mx-auto transition-all duration-400 ease-out ${step > 1 ? '-translate-x-12 opacity-0' : 'translate-x-0 opacity-[1] '}`}>

                        <img className='w-12 md:hidden sm:w-14' src='/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png' />

                        <div className='flex flex-col w-full gap-3'>
                            <h1 className={`font-semibold text-[26px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{toggleForm ? 'Create your account' : 'Login to your account'}</h1>
                            <h1 className={`flex items-center font-medium text-sm gap-1 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{toggleForm ? "Have an account?" : "Don't have an account?"} <p className={`font-semibold ${toggleTheme ? 'text-[#048C64] hover:text-[#048c64ccc]' : 'text-[#00563c] hover:text-[#00563ccc]'} transition-all duration-200 cursor-pointer`} onClick={() => {
                                setToggle(!toggleForm)
                                setEmail('')
                                setErrors(prev => ({ ...prev, email: undefined }))
                                setErrors(prev => ({ ...prev, value: undefined }))
                                setValue('')
                            }}>{toggleForm ? 'Login' : 'Sign up'}</p></h1>

                            <button disabled={loader ? true : false} onClick={() => googleAuth()} className={`border cursor-pointer flex gap-3 items-center justify-center border-[#c7c7c7] ${toggleTheme && !loader ? 'hover:bg-[#202020] active:bg-[black]' : !loader ? 'hover:bg-[#f0f0f0] active:bg-[#fefefe]' : 'hover:bg-transaprent active:bg-transparent'} transition-all duration-200 rounded-md shadow-sm mt-8 py-[0.95rem] w-full`}>
                                <img className='w-5' src='/Images/google-icon.svg' />
                                <h1 className={`text-[12px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Continue with Google</h1>
                                {loader && <svg className='authLoader w-[1.2em]' viewBox="25 25 50 50">
                                    <circle stroke={toggleTheme ? '#fefefe' : '#202020'} className='authCircle' r="20" cy="50" cx="50"></circle>
                                </svg>}
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
                                <input
                                    value={email}
                                    type='email'
                                    placeholder='Enter your email'
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) {
                                            setErrors(prev => ({ ...prev, email: undefined }))
                                        }
                                    }}
                                    className={getInputStyles('email')}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className='flex w-full flex-col gap-1.5'>
                                <label className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-[13px]`}>{toggleForm ? 'Your name' : 'Password'}</label>
                                <div className="relative w-full">
                                    <PasswordField
                                        value={value}
                                        setValue={(val) => {
                                            setValue(val)
                                            if (errors.value) {
                                                setErrors(prev => ({ ...prev, value: undefined }))
                                            }
                                        }}
                                        showPass={showPass}
                                        setShowPass={setShowPass}
                                        toggleTheme={toggleTheme}
                                        toggleForm={toggleForm}
                                        error={errors.value}
                                    />
                                    {errors.value && (
                                        <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                                    )}
                                </div>
                            </div>

                            {!toggleForm && <h1 className={`${toggleTheme ? 'text-[#b1b1b1] hover:text-[#fefefe]' : 'text-[#5b5b5b] hover:text-[#202020]'} my-2 w-fit cursor-pointer transition-all duration-200 font-medium text-xs sm:text-[13px]`} onClick={() => {
                                setForType('reset-password')
                                setStep(prev => prev + 1)
                                setValue('')
                                setEmail('')
                                setShowPass(false)
                            }}>Forgot password?</h1>}

                            {toggleForm && <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} my-2 text-center justify-center font-medium text-xs sm:text-[13px] flex flex-wrap items-center gap-1`}>By signing up, you agree to our <p className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-semibold`}>Terms & Conditions</p> and <p className={`text-[#202020] font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Privacy Policy</p></h1>}

                            <button disabled={showSteps ? true : false} onClick={() => proceed()} className={`flex gap-3 items-center justify-center mt-2 md:mt-0 bg-[#00563c] text-[#fefefe] text-sm ${showSteps ? 'hover:bg-[#00563c]' : 'hover:bg-[#00563ccc] cursor-pointer'} active:bg-[#00563c] transition-all duration-200 rounded-md p-4 w-full`}>
                                {toggleForm && !showSteps ? 'Signup' : !toggleForm && !showSteps ? 'Login' :
                                    <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                                        <circle stroke='#fefefe' className='authCircle' r="20" cy="50" cx="50"></circle>
                                    </svg>}
                            </button>
                        </div>
                    </div>}

                    {forType === 'reset-password' &&
                        <div className={`md:max-w-xl ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} min-h-screen flex justify-center flex-col gap-7 mx-auto w-full`}>
                            <div>
                                <div className='p-3 w-fit rounded-lg border shadow-md'>
                                    <Fingerprint size={27} />
                                </div>

                                <h1 className='text-2xl font-semibold mt-5'>Forgot password?</h1>
                                <h1 className={`text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-normal mt-1`}>No worries, we've got you, just provide your email.</h1>
                            </div>

                            <div className='relative flex flex-col gap-3'>
                                <div className='flex w-full flex-col gap-1.5'>
                                    <label className={`text-[13px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Email</label>
                                    <input value={email} type='email' onChange={(e) => setEmail(e.target.value)} className={`border outline-none font-normal focus:shadow-lg transition-all duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm p-[0.90rem] w-full ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} />
                                </div>

                                <div className='flex w-full flex-col gap-1.5'>
                                    <label className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-[13px]`}>New Password</label>
                                    <div className="relative w-full">
                                        <PasswordField
                                            value={value}
                                            setValue={(val) => {
                                                setValue(val)
                                                if (errors.value) {
                                                    setErrors(prev => ({ ...prev, value: undefined }))
                                                }
                                            }}
                                            showPass={showPass}
                                            setShowPass={setShowPass}
                                            toggleTheme={toggleTheme}
                                            toggleForm={toggleForm}
                                            error={errors.value}
                                        />
                                        {errors.value && (
                                            <p className="text-red-500 text-xs mt-1">{errors.value}</p>
                                        )}
                                    </div>
                                </div>

                                <button disabled={showSteps ? true : false} onClick={() => resetPassword()} className={`flex gap-3 items-center justify-center mt-2 md:mt-4 bg-[#00563c] text-[#fefefe] text-sm ${showSteps ? 'hover:bg-[#00563c]' : 'hover:bg-[#00563ccc] cursor-pointer'} active:bg-[#00563c] transition-all duration-200 rounded-md p-4 w-full`}>
                                    {!showSteps ? btnText :
                                        <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                                            <circle stroke='#fefefe' className='authCircle' r="20" cy="50" cx="50"></circle>
                                        </svg>}
                                </button>

                                <Link href='/auth'><button disabled={showSteps ? true : false} onClick={() => {
                                    setForType('')
                                    setEmail('')
                                    setValue('')
                                    setStep(0)
                                    setShowPass(false)
                                }} className={`flex gap-2 items-center justify-center mt-2 md:mt-0 bg-transparent text-[#5b5b5b] text-sm ${toggleTheme ? 'text-[#b1b1b1] hover:text-[#5b5b5b]' : 'text-[#5b5b5b] hover:text-[#202020]'} cursor-pointer transition-all duration-200 rounded-md p-4 w-full`}>
                                    <ArrowLeft size={20} /> Back to log in
                                </button></Link>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default SignIn