'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { CheckIcon, ChevronDown, Eye, EyeOff, User, Users } from 'lucide-react'
import Buttons from './Buttons'
import Loader from '../Loader'
import { signUserUp } from '@/functions/function'
import Link from 'next/link'
import Password from './Password'
import { FaUserAlt } from 'react-icons/fa'

const SignUp = () => {

    const router = useRouter()

    const [fullname, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [number, setNumber] = useState('')
    const [city, setCity] = useState('')
    const [agree, setAgree] = useState(false)
    const [genderType, setGenderType] = useState('')
    const [showGender, setShowGender] = useState(false)

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    // for live typing
    const [isFocused, setFocused] = useState(false)
    const [showPass, setShowPass] = useState(false)

    // sending signup request to backend
    const signUp = async () => await signUserUp(setLoader, setMessage, email, fullname, pass, confirmPass, number, city, agree, setShowMessage, router, genderType)

    // for storing initial state of gender element so it can be change after selection
    const [gender, setGender] = useState(<>
        <Users size={20} color='#202020' />
        <h1 className='text-[13px] inter font-normal'>Gender</h1>
    </>)

    // stroing male and female code so it can be use in page and also for setting gender

    const [male, setMale] = useState(
        <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H22M22 2V10M22 2L13 11" stroke="#202020" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="14" r="6" stroke="#202020" strokeWidth="2" />
            </svg>
            <h1 className='font-normal text-[13px]'>Male</h1>
        </>
    )

    const [female, setFemale] = useState(
        <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="6" stroke="#202020" strokeWidth="2" />
                <path d="M12 14V22M9 19H15" stroke="#202020" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1 className='font-normal text-[13px]'>Female</h1>
        </>
    )

    return (
        <div className='w-full flex flex-col h-full'>

            <img className='w-11' src='/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png' />

            <div className='w-full flex items-center justify-center'>
                <div className='p-[6px] rounded-full bg-[#b5b5b5]'></div>
                <div className='h-[2px] w-28 bg-[#b5b5b5]'></div>
                <div className='p-[6px] rounded-full bg-[#b5b5b5]'></div>
                <div className='h-[2px] w-28 bg-[#b5b5b5]'></div>
                <div className='p-[6px] rounded-full bg-[#b5b5b5]'></div>
            </div>

            <div className='h-full max-w-xl w-full justify-start mx-auto flex items-center'>

                <div className='flex flex-col gap-4'>
                    <h1 className='text-3xl font-semibold'>Choose Your Role</h1>
                    <h1 className='font-normal text-[#5b5b5b] text-sm'>Are you planning to drive or looking for a ride? Let us know to match you better.</h1>
                </div>

            </div>

        </div>
    )
}

export default SignUp