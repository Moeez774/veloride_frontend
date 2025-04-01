'use client'
import React, { useState } from 'react'
import '../../components/auth/Auth.css'
import SuccessLoader from '@/components/SuccessLoader'

const page = () => {

    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState<number>(0)
    const [message, setMessage] = useState('')

    // sending signin request to backend
    const reset = async () => {
        setMessage('')
        setLoader(true)
        try {
            let a = await fetch('http://localhost:4000/users/reset-password', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email: email, newPassword: newPassword })
            })

            let response = await a.json()
            setStatusCode(response.statusCode)
            setTimeout(() => {
                if(response.statusCode===200) {
                    setEmail('')
                    setNewPassword('')
                }
                setShowMessage(true)
                setMessage(response.message)
            }, 100)
        }
        catch (err: unknown) {
            setShowMessage(true)
            setMessage(String(err))
        }
    }

    return (

        <>

            {loader && <SuccessLoader statusCode={statusCode} setLoader={setLoader} message={message} showMessage={showMessage} setShowMessage={setShowMessage} />}

            <div className='relative'>

                <div className='inter flex justify-center min-h-screen sm:px-10 text-[#202020] items-center gap-10' style={{ userSelect: 'none' }}>

                    {/* form */}
                    <div className='flex justify-center px-10 h-screen w-11/12 max-w-4xl items-center flex-1 flex-col gap-6'>

                        {/* logo */}
                        <div className='flex justify-center'>
                            <img className='w-16 sm:w-20' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                        </div>

                        {/* //headings */}
                        <div className='flex text-center flex-col gap-2'>

                            <h1 className='exo2 font-semibold sm:text-2xl'>Reset Password</h1>

                            <h1 className='inter font-normal text-sm sm:text-base'>Enter your email to proceed.</h1>

                        </div>

                        <div className='flex flex-col gap-5'>
                            {/* Inputs */}
                            <div className='flex flex-col gap-2'>

                                <div className='flex w-full justify-center'>
                                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} className={`py-3 text-sm sm:text-base mx-auto bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md pl-3 w-full sm:w-96 pr-1 outline-none`} />
                                </div>

                                <div className='flex w-full justify-center'>
                                    <input type="password" placeholder='New password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`py-3 text-sm sm:text-base mx-auto bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md pl-3 w-full sm:w-96 pr-1 outline-none`} />
                                </div>

                            </div>

                            <div>
                                <button className='exo2 shadow-md font-bold w-[82vw] sm:w-96 bg-[#00B37E] hover:bg-[#00b37dde] active:bg-[#00b368de] transition-all duration-200 rounded-lg cursor-pointer py-3 text-[#fefefe]' onClick={() => reset()}>Confirm</button>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default page