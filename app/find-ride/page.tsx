'use client'
import Additional from '@/components/FindARide/Additional'
import Budget from '@/components/FindARide/Budget'
import Preferences from '@/components/FindARide/Preferences'
import ProgressBar from '@/components/FindARide/ProgressBar'
import RideDetails from '@/components/FindARide/RideDetails'
import Submit from '@/components/FindARide/Submit'
import { getContacts } from '@/context/ContactsProvider'
import { findRide } from '@/functions/ridesFunctions'
import { Users } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {

    const queries = useSearchParams()
    const pathname = usePathname()
    const authContext = getContacts()
    const setMatchedRides = authContext?.setMatchedRides
    const router = useRouter()

    const [step, setStep] = useState(0)
    const [currStep, setCurrStep] = useState(1)
    const [hideform, setHideForm] = useState(false)

    // fields for Ride Details
    const [location, setLocation] = useState<{ long: number, lat: number }>({ long: queries.get("long") ? parseFloat(queries.get("long")!) || 0 : 0, lat: queries.get("lat") ? parseFloat(queries.get("lat")!) || 0 : 0 })
    const [dropLocation, setDropLocation] = useState<{ long: number, lat: number }>({ long: queries.get("dropLong") ? parseFloat(queries.get("dropLong")!) || 0 : 0, lat: queries.get("dropLat") ? parseFloat(queries.get("dropLat")!) || 0 : 0 })

    const [pickup, setPickup] = useState<string | null>(queries.get('from'))
    const [drop, setDrop] = useState<string | null>(queries.get('to'))
    const [date, setDate] = useState<string | undefined>('')
    const [passengers, setPassengers] = useState(1)
    const [time, setTime] = useState('Time')

    // fields for preferences
    const [ride, setRide] = useState('')
    const [luggage, setLuggage] = useState(false)
    const [petFriendly, setPetFriendly] = useState(false)
    const [smoking, setSmoking] = useState(false)
    const [needs, setNeeds] = useState(false)
    const [showGender, setShowGender] = useState(false)
    const [vehicle, setVehicle] = useState('')
    const [genderType, setGenderType] = useState('Any')

    // fields for budget
    const [rating, setRating] = useState('')
    const [price, setPrice] = useState(0)

    // fields for additional info
    const [photo, setPhoto] = useState('')
    const [instruct, setInstruct] = useState('')
    const [number, setNumber] = useState(false)
    const [email, setEmail] = useState(false)

    // for storing initial state of gender element so it can be change after selection
    const [gender, setGender] = useState(<>
        <Users size={20} color='#202020' />
        <h1 className='text-[13px] inter font-normal'>Driver</h1>
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

    const formData: any = { pickup, setPickup, drop, setDrop, date, setDate, passengers, setPassengers, setTime, time, ride, setRide, luggage, setLuggage, petFriendly, setPetFriendly, smoking, setSmoking, needs, setNeeds, showGender, setShowGender, gender, setGender, female, male, rating, setRating, price, setPrice, photo, setPhoto, instruct, setInstruct, number, setNumber, email, setEmail, vehicle, setVehicle, setLocation, location, dropLocation, setDropLocation, setGenderType, currStep }

    //search for ride
    const searchRide = async () => await findRide(pickup, drop, date, passengers, time, price, vehicle, location, dropLocation, email, number, setMatchedRides || null, setHideForm, router, luggage, petFriendly, smoking, needs, rating)

    return (

        <>

            {hideform && <div className='flex justify-center h-screen w-screen items-center left-0 top-0 fixed z-50'>
                <div className='loader -translate-y-5'></div>
                <h1 className='inter md:text-lg font-medium text-center mt-4 translate-x-2.5 translate-y-7'>Finding best rides for you...</h1>
            </div>}

            {!hideform && <div className={`fixed top-0 left-0 ${currStep === 5 ? 'z-[60] opacity-[1]' : 'opacity-0 -z-[60]'} w-screen h-screen flex justify-center items-center bg-[#2020203f]`}>
                <Submit formData={formData} searchRide={searchRide} currStep={currStep} setCurrStep={setCurrStep} step={step} setStep={setStep} />
            </div>}

            {/* // decors */}
            {!hideform && <div className='min-h-screen flex justify-between fixed w-screen top-0 left-0 z-10'>

                <div className='flex h-screen items-end'>
                    <div className='h-[150px] w-[150px] xl:w-[220px] xl:h-[220px] bg-[#00b37e]' style={{ borderTopRightRadius: '500px' }}></div>
                </div>

                <div className='flex'>
                    <div className='w-[150px] h-[150px] xl:w-[220px] xl:h-[220px] bg-[#00b37e]' style={{ borderBottomLeftRadius: '500px' }}></div>
                </div>

            </div >}

            {/* // main part */}

            {!hideform && <div className='min-h-screen w-full items-center flex flex-col'>

                <div className='h-[4.7rem] sm:h-[5.5rem] lg:h-24 absolute z-50 w-full px-6 sm:px-10 justify-between max-w-[80rem] flex items-end'>

                    <div className='flex items-center gap-4'>
                        <img className='w-12 sm:w-14' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                    </div>
                </div>

                {/* // form */}
                <div className='flex-1 lg:pl-16 xl:pl-0 gap-20 lg:gap-40 relative z-30 max-w-5xl flex-col lg:flex-row flex pb-6 lg:pb-0 pt-28 lg:pt-8 items-center justify-center lg:justify-start w-full'>

                    {/* // progress bar */}
                    <div className='h-[2rem] lg:h-auto'>
                        <ProgressBar pathname={pathname} currStep={currStep} step={step} />
                    </div>

                    {/* filling form */}
                    <div className='flex h-[30rem] lg:h-auto flex-col gap-6'>

                        {currStep === 1 && <RideDetails setLocation={setLocation} setDropLocation={setDropLocation} drop={drop} setDrop={setDrop} pickup={pickup} setPickup={setPickup} time={time} setTime={setTime} date={date} setDate={setDate} passengers={passengers} setPassengers={setPassengers} />}

                        {currStep === 2 && <Preferences setGenderType={setGenderType} setRide={setRide} ride={ride} gender={gender} setGender={setGender} vehicle={vehicle} setVehicle={setVehicle} male={male} female={female} showGender={showGender} setLuggage={setLuggage} luggage={luggage} setShowGender={setShowGender} needs={needs} setNeeds={setNeeds} petFriendly={petFriendly} setPetFriendly={setPetFriendly} setSmoking={setSmoking} smoking={smoking} />}

                        {currStep === 3 && <Budget location={location} dropLocation={dropLocation} vehicle={vehicle} currStep={currStep} setPrice={setPrice} setRating={setRating} price={price} rating={rating} />}

                        {currStep === 4 && <Additional instruct={instruct} setEmail={setEmail} email={email} number={number} setNumber={setNumber} setInstruct={setInstruct} photo={photo} setPhoto={setPhoto} />}


                        {currStep != 5 && <div className={`mt-6 lg:mt-10 flex ${currStep === 1 ? 'justify-end' : 'justify-between'} items-center`}>

                            {currStep != 1 && <button className={`exo2 active:translate-y-0.5 active:duration-200 shadow-lg font-bold text-[#00b37e] rounded-xl bg-[#fefefe] hover:bg-[#f8f7f7] px-8 py-2.5 transition-all duration-300 cursor-pointer`} onClick={() => {
                                setStep(step - 1)
                                setCurrStep(currStep - 1)
                            }} style={{ border: '2px solid #00b37e' }}>Back</button>}

                            <button disabled={currStep === 3 && vehicle === '' ? true : false} className={`exo2 active:translate-y-0.5 active:duration-200 text-[#fefefe] rounded-xl bg-[#00b37e] shadow-lg font-bold hover:bg-[#00b37dd3] px-8 py-2.5 transition-all duration-300 cursor-pointer`} onClick={() => {
                                setCurrStep(currStep + 1)
                                setStep(step + 1)
                            }}>Next</button>

                        </div>}


                    </div>

                </div>

            </div>}
        </>
    )
}

export default page
