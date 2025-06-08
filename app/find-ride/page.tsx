'use client'
import Additional from './(Find-Ride)/Steps/Additional'
import Budget from './(Find-Ride)/Steps/Budget'
import Preferences from './(Find-Ride)/Steps/Preferences'
import ProgressBar from '@/app/find-ride/(Find-Ride)/ProgressBar'
import RideDetails from './(Find-Ride)/Steps/RideDetails'
import Submit from './(Find-Ride)/Steps/Submit'
import Loader from '@/components/Loader'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { findRide } from '@/functions/ridesFunctions'
import { Users } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useRide } from '@/context/states'

const page = () => {

    const queries = useSearchParams()
    const pathname = usePathname()
    const authContext = getContacts()
    const setMatchedRides = authContext?.setMatchedRides
    const toggleTheme = authContext?.toggleTheme
    const userContext = useAuth()
    const user = userContext?.user || null
    const router = useRouter()

    const [step, setStep] = useState(0)
    const [currStep, setCurrStep] = useState(1)
    const [hideform, setHideForm] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [loader, setLoader] = useState(false)
    const [statusCode, setStatusCode] = useState<number>(0)
    const [seats, setSeats] = useState<boolean[]>()

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
    const [showGender, setShowGender] = useState(false)
    const [vehicle, setVehicle] = useState('')
    const [gender, setGender] = useState('')

    // fields for budget
    const [rating, setRating] = useState('')
    const [price, setPrice] = useState(0)

    // fields for additional info
    const [photo, setPhoto] = useState('')
    const [instruct, setInstruct] = useState('')
    const [number, setNumber] = useState(false)
    const [email, setEmail] = useState(false)

    const { rideState, setRideState } = useRide()

    const formData: any = { pickup, setPickup, drop, setDrop, date, setDate, passengers, setPassengers, setTime, time, ride, setRide, luggage, setLuggage, petFriendly, setPetFriendly, smoking, setSmoking, showGender, setShowGender, gender, setGender, rating, setRating, price, setPrice, photo, setPhoto, instruct, setInstruct, number, setNumber, email, setEmail, vehicle, setVehicle, setLocation, location, dropLocation, setDropLocation, currStep, seats, setSeats }

    //search for ride
    const searchRide = async () => {
        // Validate required fields
        setLoader(true)
        if (!pickup) {
            setStatusCode(404)
            setMessage('Pickup location is required')
            setShowMessage(true)
            return
        }
        if (!drop) {
            setStatusCode(404)
            setMessage('Drop location is required')
            setShowMessage(true)
            return
        }
        if (!date) {
            setStatusCode(404)
            setMessage('Date is required')
            setShowMessage(true)
            return
        }
        if (time === 'Time') {
            setStatusCode(404)
            setMessage('Time is required')
            setShowMessage(true)
            return
        }
        if (passengers < 1) {
            setStatusCode(404)
            setMessage('At least 1 passenger is required')
            setShowMessage(true)
            return
        }
        if (price <= 0) {
            setStatusCode(404)
            setMessage('Price must be greater than 0')
            setShowMessage(true)
            return
        }

        await findRide(pickup, drop, date, passengers, time, price, vehicle, location, dropLocation, email, number, setMatchedRides || null, setHideForm, router, luggage, petFriendly, smoking, rating, setLoader, setShowMessage, setMessage, ride, gender, user)
        setRideState({
            userId: user?._id || '',
            photo: photo,
            bookedSeats: passengers,
            paying: price,
            luggage: luggage,
            pet: petFriendly,
            smoking: smoking
        })
    }

    return (

        <>

            {hideform && <div className='flex justify-center h-screen w-screen items-center left-0 top-0 fixed z-50'>
                <div className='loader -translate-y-5'></div>
                <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} inter md:text-lg font-medium text-center mt-4 translate-x-2.5 translate-y-7`}>Finding best rides for you...</h1>
            </div>}

            {!hideform && <div className={`fixed top-0 left-0 ${currStep === 5 ? 'z-[60] opacity-[1]' : 'opacity-0 -z-[60]'} w-screen h-screen flex justify-center items-center bg-[#2020203f]`}>
                <Submit showMessage={showMessage} setShowMessage={setShowMessage} message={message} statusCode={statusCode} formData={formData} searchRide={searchRide} currStep={currStep} setCurrStep={setCurrStep} step={step} setStep={setStep} setLoader={setLoader} loader={loader} />
            </div>}

            {/* // decors */}
            {!hideform && <div className='min-h-screen flex justify-between fixed w-screen top-0 left-0 z-10'>

                <div className='flex h-screen items-end'>
                    <div className='h-[150px] w-[150px] xl:w-[220px] xl:h-[220px] bg-[#00563c]' style={{ borderTopRightRadius: '500px' }}></div>
                </div>

                <div className='flex'>
                    <div className='w-[150px] h-[150px] xl:w-[220px] xl:h-[220px] bg-[#00563c]' style={{ borderBottomLeftRadius: '500px' }}></div>
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

                        {currStep === 2 && <Preferences gender={gender} setGender={setGender} setRide={setRide} ride={ride} vehicle={vehicle} setVehicle={setVehicle} showGender={showGender} setLuggage={setLuggage} luggage={luggage} setShowGender={setShowGender} petFriendly={petFriendly} setPetFriendly={setPetFriendly} setSmoking={setSmoking} smoking={smoking} />}

                        {currStep === 3 && <Budget seats={seats} setSeats={setSeats} location={location} dropLocation={dropLocation} vehicle={vehicle} currStep={currStep} setPrice={setPrice} setRating={setRating} price={price} rating={rating} />}

                        {currStep === 4 && <Additional instruct={instruct} setEmail={setEmail} email={email} number={number} setNumber={setNumber} setInstruct={setInstruct} photo={photo} setPhoto={setPhoto} />}


                        {currStep != 5 && <div className={`inter ${currStep === 4 ? 'mt-2' : 'mt-6'} flex ${currStep === 1 ? 'justify-end' : 'justify-between'} items-center`}>

                            {currStep != 1 && <button className={`shadow-md font-medium ${toggleTheme ? 'text-[#fefefe] bg-[#1f1f1f] hover:bg-[#2c2c2c]' : 'text-[#00563c] bg-[#fefefe] hover:bg-[#f8f7f7]'} rounded-md px-8 py-2.5  cursor-pointer ${toggleTheme ? 'border-none' : 'border'}`} onClick={() => {
                                setStep(step - 1)
                                setCurrStep(currStep - 1)
                            }}>Back</button>}

                            <button disabled={currStep === 3 && vehicle === '' ? true : false} className={`active:bg-[#00563c] text-[#fefefe] rounded-md bg-[#00563c] shadow-md font-medium hover:bg-[#00563ccc] px-8 py-2.5 cursor-pointer`} onClick={() => {
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
