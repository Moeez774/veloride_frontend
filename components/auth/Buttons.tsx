import React, { useEffect, useState } from 'react'
import { CheckIcon, ChevronDown, Users } from 'lucide-react'
import Loader from '../Loader'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { saveUsersData } from '@/functions/function'

const google = new GoogleAuthProvider()

interface Details {
    btText: string,
    func: () => void
}

const Buttons: React.FC<Details> = ({ btText, func }) => {

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    //rotuer for redirecting user
    const router = useRouter()

    // asking for more information if user sign in with providers
    const [tellMore, setTellMore] = useState(false)
    const [city, setCity] = useState('')
    const [number, setNumber] = useState('')
    const [isAgree, setAgree] = useState(false)
    const [genderType, setGenderType] = useState('')
    const [showGender, setShowGender] = useState(false)

    // for getting user's info
    const [user, setUser] = useState<any>()

    // getting user's info if user sign in with providers
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.reload()
                setUser(user)
            }
            else {
                setUser(null)
            }
        })

        return () => unSubscribe()
    }, [])

    // for saving user's data
    const saveUser = async () => await saveUsersData(setLoader, user, city, number, isAgree, setShowMessage, setMessage, router, genderType)

    // sign in woth google
    const googleSignIn = async () => {
        setLoader(true)
        setMessage('')
        try {

            await signInWithPopup(auth, google)

            // for chekcing whther user's data already availabale in database or not so we can ask for more info
            let a = await fetch('http://localhost:4000/users/check-user', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: auth.currentUser?.uid })
            })

            let response = await a.json()

            if (response.user === null) {
                setLoader(false)
                setTellMore(true)
            }
            else {
                await saveUser()
                router.push('/authorization')
            }

        } catch (err) {
            alert("Error signing in with Google." + err)
            setLoader(false)
        }
    }

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
        <>

            {loader && <Loader setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} />}

            {/* //asking for more info if user signed in with google */}
            <div className='fixed h-screen w-full flex justify-center items-center top-0 left-0' style={{ transition: 'all 0.2s ease-in-out', opacity: tellMore ? '1' : '0', transform: tellMore ? 'scale(1)' : 'scale(0.8)', zIndex: tellMore ? '50' : '-50' }}>

                <div className='w-11/12 max-w-3xl px-8 h-10/12 bg-white flex gap-4 flex-col justify-center items-center relative rounded-2xl shadow-2xl'>

                    <div className='mb-4 flex-col gap-2 flex text-center'>
                        <h1 className='exo2 text-2xl sm:text-3xl font-semibold'>Complete your profile</h1>
                        <h1 className='inter text-xs sm:text-sm'> Enter your city and contact number to find the best carpool matches!</h1>
                    </div>

                    <div className='flex flex-col items-center gap-2'>
                        <div>
                            <input type="text" placeholder='Phone number' value={number} onChange={(e) => setNumber(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md  text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                        </div>

                        <div className='flex flex-col gap-1.5'>
                            <input type="text" placeholder='City or Location' value={city} onChange={(e) => setCity(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                        </div>
                    </div>

                    <div className='relative'>
                        <div onClick={() => setShowGender(!showGender)} className='relative w-32 sm:w-36 cursor-pointer flex justify-between items-center bg-white p-3 rounded-md shadow-md'>
                            <div className='flex items-center inter gap-1'>
                                {gender}
                            </div>

                            <ChevronDown size={17} className='transition-all duration-200' style={{ transform: showGender ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color='#202020' />
                        </div>

                        <div style={{ transition: 'all 0.1s ease-in-out', transform: showGender ? 'scale(1)' : 'scale(0.8)', opacity: showGender ? '1' : '0', userSelect: showGender ? 'auto' : 'none', zIndex: showGender ? '50' : '-50' }} className='inter absolute flex flex-col px-1.5 z-30 py-2.5 w-32 sm:w-36 mt-1 rounded-md bg-[#fefefe] shadow-md'>

                            <div onClick={() => {
                                if (showGender) {
                                    setGender(male)
                                    setGenderType("Male")
                                    setShowGender(false)
                                }
                            }} className={`flex py-2 rounded-md ${showGender ? 'cursor-pointer' : 'cursor-default'} hover:bg-gray-100 transition-all duration-200 px-1.5 items-center gap-1.5`}>
                                {male}
                            </div>

                            <div onClick={() => {
                                if (showGender) {
                                    setGender(female)
                                    setGenderType("Female")
                                    setShowGender(false)
                                }
                            }} className={`flex py-2 px-1.5 rounded-md ${showGender ? 'cursor-pointer' : 'cursor-default'} hover:bg-gray-100 transition-all duration-200 items-center gap-1.5`}>
                                {female}
                            </div>

                        </div>

                    </div>

                    {/* //agree to policies */}
                    <div className='flex justify-start items-center w-[82vw] sm:w-96 lg:w-[22rem] gap-1.5'>
                        <div className='w-[23px] h-[23px] flex items-center cursor-pointer justify-center rounded-full shadow-md' onClick={() => setAgree(!isAgree)} style={{ border: '1.5px solid #979797' }}>
                            <CheckIcon className={`${isAgree ? 'block' : 'hidden'}`} size={13} color='#202020' />
                        </div>
                        <div>
                            <h1 className='text-xs flex items-center gap-1'>I agree to <p className='underline'>Terms</p> and <p className='underline'>Privacy Policy</p> </h1>
                        </div>
                    </div>

                    <div className='mt-4'>
                        <button className='exo2 shadow-md font-bold w-[82vw] sm:w-96 lg:w-[22rem] bg-[#00b37e] hover:bg-[#00b37ddc] active:bg-[#00b377] transition-all duration-200 rounded-lg cursor-pointer py-3 text-[#fefefe]' onClick={async () => {
                            await saveUser()
                        }}>Confirm</button>
                    </div>

                </div>

            </div>

            <div>
                <button onClick={() => func()} className='exo2 shadow-md font-bold w-[82vw] sm:w-96 bg-[#00B37E] hover:bg-[#00b37dde] active:bg-[#00b368de] transition-all duration-200 rounded-lg cursor-pointer py-3 text-[#fefefe]'>{btText}</button>
            </div>

            <div className='flex w-[82vw] sm:w-96 items-center gap-2'>

                {/* sign in with google */}
                <button onClick={() => googleSignIn()} className='cursor-pointer w-full hover:bg-[#202020] text-[#202020] transition-all duration-200 active:bg-[#161616] hover:text-[#fefefe] py-3 bg-[#fefefe] active:text-white justify-center rounded-lg flex items-center gap-2 shadow-md' style={{ border: '1.5px solid #979797' }}>
                    <img className='w-6' src="/Images/google-icon.svg" alt="" />
                    <h1 className='font-semibold text-xs sm:text-sm' >Continue with Google</h1>
                </button>

            </div>
        </>
    )
}

export default Buttons
