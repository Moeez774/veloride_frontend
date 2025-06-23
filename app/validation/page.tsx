'use client'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const router = useRouter()
    const authContext = useAuth()
    const fetchUser = authContext?.fetchUser
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    const [loader, setLoader] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, {
                    method: "GET",
                    credentials: "include"
                });

                const data = await response.json()

                setMessage(data.message);

                setTimeout(() => {
                    setLoader(false);
                }, 3000);

                if (data.statusCode === 200) {
                    localStorage.setItem('_id', data.userId);
                    if (fetchUser) {
                        fetchUser();
                    }
                    setTimeout(() => {
                        router.push('/');
                    }, 100);
                } else {
                    localStorage.removeItem('_id');
                    router.push('/auth');
                }
            } catch (error) {
                console.error('Validation - Error:', error);
                setLoader(false);
                setMessage('An error occurred during verification');
                router.push('/auth');
            }
        };

        verify()
    }, []);

    return (
        <div className={`fixed left-0 flex-col gap-6 px-6 top-0 z-50 ${toggleTheme ? 'bg-black' : 'bg-white'} w-screen h-screen flex justify-center items-center`}>
            {loader && (
                <div className='flex flex-col gap-6'>
                    <div className='-translate-x-2'>
                        <div className="loader"></div>
                    </div>

                    <div className={`${toggleTheme ? 'text-white' : 'text-black'} text-center mt-8 flex flex-col gap-1.5`}>
                        <h1 className={`inter text-xl font-semibold ${toggleTheme ? 'text-white' : 'text-black'}`}>Verifying Your Access...</h1>
                        <div className={`inter text-sm ${toggleTheme ? 'text-white' : 'text-black'}`}>
                            <h1>Please wait while we securely verify your credentials.</h1>
                            <h1>This will only take a moment.</h1>
                        </div>
                    </div>
                </div>
            )}

            {!loader && (
                <div className={`${toggleTheme ? 'text-white' : 'text-black'} text-center`}>
                    <h1 className={`inter text-lg ${toggleTheme ? 'text-white' : 'text-black'}`}>{message}</h1>
                </div>
            )}
        </div>
    );
};

export default page;
