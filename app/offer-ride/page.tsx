'use client'
import Additional from '@/app/find-ride/(Find-Ride)/Steps/Additional'
import Preferences from '@/app/find-ride/(Find-Ride)/Steps/Preferences'
import ProgressBar from '@/app/find-ride/(Find-Ride)/ProgressBar'
import Budget from '@/app/offer-ride/(Offer-Ride)/Budget'
import RideDetails from '@/app/offer-ride/(Offer-Ride)/RideDetails'
import Submit from '@/app/offer-ride/(Offer-Ride)/Submit'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { offerRide } from '@/functions/ridesFunctions'
import { Users } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useRide } from '@/context/states'

const page = () => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const queries = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const { setNotifications } = useRide()
    const authContext = useAuth()
    const user = authContext?.user || null

    const [step, setStep] = useState(0)
    const [currStep, setCurrStep] = useState(1)
    const [message, setMessage] = useState('')
    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState<number>(0)

    // fields for Ride Details
    const [location, setLocation] = useState<{ long: number, lat: number }>({ long: queries.get("long") ? parseFloat(queries.get("long")!) || 0 : 0, lat: queries.get("lat") ? parseFloat(queries.get("lat")!) || 0 : 0 })
    const [dropLocation, setDropLocation] = useState<{ long: number, lat: number }>({ long: queries.get("dropLong") ? parseFloat(queries.get("dropLong")!) || 0 : 0, lat: queries.get("dropLat") ? parseFloat(queries.get("dropLat")!) || 0 : 0 })

    const [pickup, setPickup] = useState<string | null>(queries.get('from'))
    const [drop, setDrop] = useState<string | null>(queries.get('to'))
    const [date, setDate] = useState<string | undefined>('')
    const [seats, setseats] = useState(1)
    const [time, setTime] = useState('Time')
    const [vehicle, setVehicle] = useState('')

    // fields for preferences
    const [ride, setRide] = useState('')
    const [luggage, setLuggage] = useState(false)
    const [petFriendly, setPetFriendly] = useState(false)
    const [smoking, setSmoking] = useState(false)
    const [needs, setNeeds] = useState(false)
    const [showGender, setShowGender] = useState(false)
    const [genderType, setGenderType] = useState('Any')

    // fields for budget
    const [negotiate, setNegotiate] = useState(false)
    const [budget, setBudget] = useState(0)

    // fields for additional info
    const [photo, setPhoto] = useState('')
    const [instruct, setInstruct] = useState('')
    const [number, setNumber] = useState(false)
    const [email, setEmail] = useState(false)

    // for storing initial state of gender element so it can be change after selection
    const [gender, setGender] = useState(<>
        <Users size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
        <h1 className={`text-[13px] inter font-normal ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Driver</h1>
    </>)

    // stroing male and female code so it can be use in page and also for setting gender

    const [male, setMale] = useState(
        <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H22M22 2V10M22 2L13 11" stroke={toggleTheme ? '#fefefe' : '#202020'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="14" r="6" stroke={toggleTheme ? '#fefefe' : '#202020'} strokeWidth="2" />
            </svg>
            <h1 className={`font-normal text-[13px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Male</h1>
        </>
    )

    const [female, setFemale] = useState(
        <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="6" stroke={toggleTheme ? '#fefefe' : '#202020'} strokeWidth="2" />
                <path d="M12 14V22M9 19H15" stroke={toggleTheme ? '#fefefe' : '#202020'} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1 className={`font-normal text-[13px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Female</h1>
        </>
    )

    const formData: any = { pickup, setPickup, drop, setDrop, date, setDate, seats, setseats, setTime, time, ride, setRide, luggage, setLuggage, petFriendly, setPetFriendly, smoking, setSmoking, needs, setNeeds, showGender, setShowGender, gender, setGender, female, male, negotiate, setNegotiate, photo, setPhoto, instruct, setInstruct, number, setNumber, email, setEmail, budget, setBudget, vehicle, setVehicle, setLocation, setDropLocation, setGenderType, currStep, location, dropLocation }

    // for offering a ride
    const offer = async () => await offerRide(user?._id, user?.fullname || 'Unknown Driver', location, dropLocation, pickup, drop, seats, time, date, vehicle, ride, luggage, petFriendly, smoking, negotiate, photo, instruct, number, email, setLoader, setMessage, budget, setShowMessage, setStatusCode, user, setNotifications)

    useEffect(() => {
        if (!loader && statusCode === 200) router.push('/')
    }, [loader, statusCode])

    return (

        <>

            <div className={`fixed top-0 left-0 ${currStep === 5 ? 'z-[60] opacity-[1]' : 'opacity-0 -z-[60]'} w-screen h-screen flex justify-center items-center ${toggleTheme ? 'bg-[#0d0d0d3f]' : 'bg-[#2020203f]'}`}>
                <Submit statusCode={statusCode} offer={offer} loader={loader} setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} formData={formData} currStep={currStep} setCurrStep={setCurrStep} step={step} setStep={setStep} />
            </div>

            {/* // decors */}
            <div className='min-h-screen flex justify-between fixed w-screen top-0 left-0 z-10'>

                <div className='flex h-screen items-end'>
                    <div className={`h-[150px] w-[150px] xl:w-[220px] xl:h-[220px] ${toggleTheme ? 'bg-[#048C64]' : 'bg-[#00b37e]'}`} style={{ borderTopRightRadius: '500px' }}></div>
                </div>

                <div className='flex'>
                    <div className={`w-[150px] h-[150px] xl:w-[220px] xl:h-[220px] ${toggleTheme ? 'bg-[#048C64]' : 'bg-[#00b37e]'}`} style={{ borderBottomLeftRadius: '500px' }}></div>
                </div>

            </div>

            {/* // main part */}

            <div className={`min-h-screen w-full items-center flex flex-col ${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-white'}`}>

                <div className='h-[4.7rem] sm:h-[5.5rem] lg:h-24 absolute z-50 w-full px-6 sm:px-10 justify-between max-w-[80rem] flex items-end'>

                    <div className='flex items-center gap-4'>
                        <img className='w-12 sm:w-14' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                    </div>
                </div>

                {/* // form */}
                <div className='flex-1 px-8 lg:pl-16 xl:pl-0 gap-20 lg:gap-40 relative z-30 max-w-5xl flex-col lg:flex-row flex pb-6 lg:pb-0 pt-28 lg:pt-6 items-center justify-center lg:justify-start w-full'>

                    {/* // progress bar */}
                    <div className='h-[2rem] lg:h-auto'>
                        <ProgressBar pathname={pathname} currStep={currStep} step={step} />
                    </div>

                    {/* filling form */}
                    <div className='flex h-[30rem] lg:h-auto flex-col gap-6'>

                        {currStep === 1 && <RideDetails setLocation={setLocation} setDropLocation={setDropLocation} drop={drop} setDrop={setDrop} pickup={pickup} setPickup={setPickup} time={time} setTime={setTime} vehicle={vehicle} setVehicle={setVehicle} date={date} setDate={setDate} seats={seats} setseats={setseats} />}

                        {currStep === 2 && <Preferences setGender={setGenderType} vehicle={vehicle} setVehicle={setVehicle} setRide={setRide} ride={ride} gender={gender} showGender={showGender} setLuggage={setLuggage} luggage={luggage} setShowGender={setShowGender} petFriendly={petFriendly} setPetFriendly={setPetFriendly} setSmoking={setSmoking} smoking={smoking} />}

                        {currStep === 3 && <Budget currStep={currStep} budget={budget} setBudget={setBudget} setNegotiate={setNegotiate} negotiate={negotiate} vehicle={vehicle} location={location} dropLocation={dropLocation} />}

                        {currStep === 4 && <Additional instruct={instruct} setEmail={setEmail} email={email} number={number} setNumber={setNumber} setInstruct={setInstruct} photo={photo} setPhoto={setPhoto} />}

                        {currStep != 5 && <div className={`inter ${currStep === 4? 'mt-2': 'mt-6'} flex ${currStep === 1 ? 'justify-end' : 'justify-between'} items-center`}>

                            {currStep != 1 && <button className={`shadow-lg font-medium ${toggleTheme ? 'text-[#fefefe] bg-[#1f1f1f] hover:bg-[#2c2c2c]' : 'text-[#00563c] bg-[#fefefe] hover:bg-[#f8f7f7]'} rounded-md px-8 py-2.5  cursor-pointer ${toggleTheme ? 'border-none' : 'border'}`} onClick={() => {
                                setStep(step - 1)
                                setCurrStep(currStep - 1)
                            }}>Back</button>}

                            <button disabled={currStep === 3 && vehicle === '' ? true : false} className={`active:bg-[#00563c] text-[#fefefe] rounded-md bg-[#00563c] shadow-lg font-medium hover:bg-[#00563ccc] px-8 py-2.5 cursor-pointer`} onClick={() => {
                                setCurrStep(currStep + 1)
                                setStep(step + 1)
                            }}>Next</button>

                        </div>}


                    </div>

                </div>

            </div>
        </>
    )
}

export default page
