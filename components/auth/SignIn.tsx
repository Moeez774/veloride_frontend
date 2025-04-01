'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Password from './Password'
import { AlertCircle, CheckIcon, X } from 'lucide-react'
import './Auth.css'
import Buttons from './Buttons'
import Loader from '../Loader'
import Link from 'next/link'

const SignIn = () => {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [remember, setRemember] = useState(false)

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    // sending signin request to backend
    const signIn = async () => {
        setMessage('')
        setLoader(true)
        try {
            let a = await fetch('http://localhost:4000/users/sign-in', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, pass: pass, remember: remember })
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

    return (

        <>

            {loader && <Loader setLoader={setLoader} message={message} showMessage={showMessage} setShowMessage={setShowMessage} />}

            <div className='relative'>

                <div className='inter flex justify-center min-h-screen sm:px-10 text-[#202020] items-center gap-10' style={{ userSelect: 'none' }}>

                    {/* form */}
                    <div className='flex justify-center px-10 h-screen shadow-2xl w-11/12 max-w-4xl items-center flex-1 flex-col gap-6'>

                        {/* logo */}
                        <div className='flex justify-center'>
                            <img className='w-16 sm:w-20' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                        </div>

                        {/* //headings */}
                        <div className='flex text-center flex-col gap-2'>

                            <h1 className='exo2 font-semibold text-2xl sm:text-3xl'>Log In & Ride Smarter with VeloRide</h1>

                            <h1 className='inter font-normal text-sm sm:text-base'>Sign in to find your next ride and share the journey.</h1>

                        </div>

                        <div className='flex flex-col gap-5'>
                            {/* Inputs */}
                            <div className='flex flex-col gap-2'>

                                <div className='flex w-full justify-center'>
                                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className={`py-3 text-sm sm:text-base mx-auto bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md pl-3 w-full sm:w-96 pr-1 outline-none`} />
                                </div>

                                <div className='flex flex-col items-center sm:items-start gap-1.5 w-full justify-center'>

                                    <Password pass={pass} setPass={setPass} />

                                    <Link href='/reset-password' ><h1 className='underline cursor-pointer font-normal text-start w-[82vw] sm:w-auto text-[11px] pl-1.5' >Forgot password?</h1></Link>
                                </div>

                            </div>

                            {/* //remember me */}
                            <div className='flex justify-start items-center gap-1.5'>
                                <div className='w-[23px] h-[23px] flex items-center cursor-pointer justify-center rounded-full shadow-md' onClick={() => setRemember(!remember)} style={{ border: '1.5px solid #979797' }}>
                                    <CheckIcon className={`${remember ? 'block' : 'hidden'}`} size={13} color='#202020' />
                                </div>
                                <div>
                                    <h1 className='text-xs'>Remember me</h1>
                                </div>
                            </div>

                            {/* buttons */}
                            <div className='flex flex-col gap-2'>

                                <Buttons btText="Sign in" func={signIn} />

                                <div className='mt-1'>
                                    <h1 className='text-xs justify-center w-full sm:w-96 font-medium flex items-center gap-0.5 text-[#202020]'>Didn't have an account? <Link href='/auth/sign-up' prefetch={true} ><p className='font-bold underline cursor-pointer'>Sign up here</p></Link> </h1>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default SignIn