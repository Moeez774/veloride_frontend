'use client'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const router = useRouter()
    const authContext = useAuth()
    const fetchUser = authContext?.fetchUser

    const [loader, setLoader] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {

        const verify = async () => {
            let a = await fetch('http://localhost:4000/users/auth', {
                method: "GET",
                credentials: "include"
            })

            let response = await a.json()
            if (fetchUser) {
               fetchUser()
            }
            setTimeout(() => {
                setLoader(false)
                setMessage(response.message)

                setTimeout(async() => {
                if (response.statusCode === 200) {
                    localStorage.setItem('_id', response.userId)
                    router.push('/')
                }
                else {
                    router.push('/auth/sign-in')
                }
                }, 10)
            }, 1500)
        }

        verify()

    }, [])

    return (
        <div className='fixed left-0 flex-col gap-6 px-6 top-0 z-50 bg-white w-screen h-screen flex justify-center items-center'>

            {loader &&
                <div className='flex flex-col gap-6'>
                    <div className='-translate-x-2'>
                        <div className="loader"></div>
                    </div>

                    <div className='text-center mt-8 flex flex-col gap-1.5'>
                        <h1 className='inter text-xl font-semibold'>Verifying Your Access...</h1>

                        <div className='inter text-sm'>
                            <h1>Please wait while we securely verify your credentials.</h1>
                            <h1>This will only take a moment.</h1>
                        </div>
                    </div>
                </div>
            }

            {!loader && <div>
                <h1 className='inter'>{message}</h1>
            </div>}

        </div>
    )
}

export default page
