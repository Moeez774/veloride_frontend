'use client'
import React, { useEffect, useState } from 'react'
import Field from '@/components/hooks/Field'
import Link from 'next/link'
import { Divide, Map, Mic } from 'lucide-react'
import LocalMap from '@/components/hooks/Map'
import '../commonOnes/Commons.css'
import { getContacts } from '@/context/ContactsProvider'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from '@/context/AuthProvider'
import FindByVoice from '@/app/(HomePage)/FindByVoice'

const RideConnect = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {

    // states of all four inputs for showing search suggestion container
    const [takePick, setTakePick] = useState(false)
    const [takeDrop, setTakeDrop] = useState(false)
    const [start, setStart] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [showVoiceDialog, setShowVoiceDialog] = useState(false)
    const [step, setStep] = useState(0)

    const rideContext = getContacts()
    const matchedRides = rideContext?.matchedRides

    //states for voice booking
    const [states, setStates] = useState({
        welcome: '',
        pickupLocation: {
            name: '',
            coordinates: {
                long: 0,
                lat: 0
            },
            shortName: ''
        },
        dropoffLocation: {
            name: '',
            coordinates: {
                long: 0,
                lat: 0
            },
            shortName: ''
        },
        pickupDate: '',
        pickupTime: '',
        passengerCount: '0',
        vehicleType: '',
        allFares: [],
        desiredFare: ''
    })
    const [isFetched, setIsFetched] = useState(false)
    const [isLoader, setIsLoader] = useState(false)
    const [message, setMessage] = useState('What is your desired fare from below options based on booked seats? Say like "PKR 300" or "300 PKR". If you\'re unsure, say "No" to start over.')
    const [isListening, setIsListening] = useState(false)

    const questions = [
        {
            key: 'welcome',
            prompt: `Welcome to Veloride Voice Ride Finder!

    I’ll help you book your ride by asking a few simple questions.

    Once I have the details, I’ll search for the best matching rides.

    Are you ready to begin? Say "Yes" to start.`
        },
        { key: 'pickupLocation', prompt: 'Please tell your pickup location.' },
        { key: 'dropoffLocation', prompt: 'Please tell your drop-off location.' },
        { key: 'pickupDate', prompt: 'What is your pickup date? For example, say "25 June 2025".' },
        { key: 'pickupTime', prompt: 'What is your pickup time? For example, say "4 PM".' },
        { key: 'passengerCount', prompt: 'How many passengers will be riding, including you? for example: say "three passengers".' },
        { key: 'vehicleType', prompt: 'What type of vehicle do you prefer? You can say "Sedan", "SUV", "Compact Car" or "Luxury Car".' },
        { key: 'allFares', prompt: 'Please wait while we fetch all the fares for you based on capacity of booked seats.' },
        { key: 'desiredFare', prompt: message },
        {
            key: 'confirmation',
            prompt: (answers: any) =>
                `Just to confirm: you want a ride from ${answers.pickupLocation.shortName} to ${answers.dropoffLocation.shortName} on ${answers.pickupDate} at ${answers.pickupTime}, for ${answers.passengerCount} in a ${answers.vehicleType}, and your desired fare is ${answers.desiredFare}.

    Is that correct? Say "Yes" to continue or "No" to start over.`
        }
    ];

    // finding ride sources
    const [goFrom, setGoFrom] = useState<string | null>('')
    const [dropTo, setDropTo] = useState<string | null>('')
    const [location, setLocation] = useState<{ long: number, lat: number }>({ long: 0, lat: 0 })
    const [dropLocation, setDropLocation] = useState<{ long: number, lat: number }>({ long: 0, lat: 0 })

    // offering ride source
    const [startFrom, setStartFrom] = useState<string | null>('')
    const [goTo, setGoTo] = useState<string | null>('')
    const [showFindMap, setShowFindMap] = useState(false)
    const [showOfferMap, setShowOfferMap] = useState(false)
    const [toggle, setToggle] = useState(false)
    const context = getContacts()
    const [isHovered, setHovered] = useState(false)
    const toggleTheme = context?.toggleTheme
    const authContext = useAuth()
    const setUserLocation = authContext?.setUserLocation
    const userLocation = authContext?.userLocation

    const fetchPrice = async () => {

        try {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/fetchPrice`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ pickupLocation: states.pickupLocation.coordinates, dropOffLocation: states.dropoffLocation.coordinates, vehicle: states.vehicleType })
            })
            const response = await a.json()
            if (response.statusCode === 200) {
                setStates((prev) => {
                    return {
                        ...prev,
                        allFares: response.allFares
                    }
                })
                setMessage('What is your desired fare from below options based on booked seats? Say like "300 PKR" or "300 PKR". If you\'re unsure, say "No" to start over.')
            }
            else {
                setStates((prev) => {
                    return {
                        ...prev,
                        allFares: []
                    }
                })
                setMessage(response.message)
            }
        } catch (error: any) {
            setMessage(error.message)
        }
    }

    useEffect(() => {
        if (step === 8) fetchPrice()
    }, [step])

    // statments for showing on selected positions
    const findRideStatements = ["How to Select Your Locations", "Select your Pickup Location by tapping the map once, then select your Drop-Off Location by tapping again. You'll be asked to confirm before proceeding. Click OK to continue."]
    const offerRideStatements = ["How to Select Your Locations", "Tap the map to select your Starting Point, then tap again to select your Destination. You'll be asked to confirm before proceeding. Click OK to continue."]

    //statements for showing after selecting locations
    const confirmFindRide = ["Are you sure?", "You've set your Pickup and Drop-off locations. Ready to find a ride? Click OK to proceed."]
    const confirmOfferRide = ["Are you sure?", "You've set your Starting Point and Destination. Ready to offer a ride? Click OK to proceed."]

    return (
        <>

            <div className='fixed w-full px-10'>
                <Dialog open={showVoiceDialog} onOpenChange={(open) => {
                    setShowVoiceDialog(open)
                    setStart(false)
                    setIsFetched(false)
                    setStates((prev) => {
                        return {
                            ...prev,
                            allFares: []
                        }
                    })
                }}>
                    <DialogTrigger></DialogTrigger>
                    <DialogContent className={`w-full mx-auto ${toggleTheme ? 'bg-[#202020] border-none text-[#fefefe]' : 'bg-[#fefefe] border-none text-[#202020]'} overflow-y-auto h-[90vh]`}>
                        <DialogHeader className='w-full'>
                            <DialogTitle>Find perfect ride just by voice</DialogTitle>
                            <div className='w-full h-full flex items-center justify-center'>
                                <div className="spinner" style={{ animation: isSpeaking ? 'speakAnime 0.5s linear infinite' : 'spinning82341 1.7s linear infinite' }}>
                                    <div style={{ backgroundColor: toggleTheme ? 'rgb(36, 36, 36)' : '#f0f0f0' }} className="spinner1"></div>
                                </div>
                            </div>

                            <FindByVoice message={message} setShowVoiceDialog={setShowVoiceDialog} questions={questions} setIsFetched={setIsFetched} start={start} isSpeaking={isSpeaking} setStart={setStart} setIsSpeaking={setIsSpeaking} states={states} setStates={setStates} step={step} setStep={setStep} isLoader={isLoader} setIsLoader={setIsLoader} setIsListening={setIsListening} isListening={isListening} />

                            {states.allFares.length > 0 && <div className='max-w-lg h-48 w-full mx-auto flex flex-wrap gap-2 justify-center items-center'>
                                {states.allFares.map((e: any, index: number) => {
                                    return (
                                        <div key={index} className='flex flex-col gap-1'>
                                            <h1 className={`text-sm font-semibold transition-all duration-200 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                                                {e.bookedSeats}
                                            </h1>
                                            <div
                                                className={`py-1 px-3 ${toggleTheme ? 'bg-[#353535]' : 'bg-[#f0f0f0]'} rounded-full`}
                                            >
                                                <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-sm`}>PKR {e.fare}</h1>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>}

                            {((states.allFares.length === 0 && step === 7) || isLoader) && <div className='w-full gap-2 flex justify-center items-center h-48'>
                                <div className="loader2">
                                    <div className="bar1"></div>
                                    <div className="bar2"></div>
                                    <div className="bar3"></div>
                                    <div className="bar4"></div>
                                    <div className="bar5"></div>
                                    <div className="bar6"></div>
                                    <div className="bar7"></div>
                                    <div className="bar8"></div>
                                    <div className="bar9"></div>
                                    <div className="bar10"></div>
                                    <div className="bar11"></div>
                                    <div className="bar12"></div>
                                </div>

                                {isFetched && <div className='flex items-center gap-2'>
                                    <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-sm`}>Redirecting...</h1>
                                </div>}
                            </div>}

                            <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} mt-2 text-center text-sm`}>Provide all the details carefully which is asking from you</h1>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div ref={ref}>

                {(showOfferMap || showFindMap) && <div className='flex z-50 fixed w-[100vw] h-screen justify-center items-center left-0 top-0 bg-[#0000003d]'>

                    {showFindMap && <LocalMap statements={findRideStatements} location={location} setUserLocation={setUserLocation} dropLocation={dropLocation} setDropLocation={setDropLocation} setLocation={setLocation} link='/find-ride' mapSetter={setShowFindMap} secondStatements={confirmFindRide} val1={goFrom} val2={dropTo} setter1={setGoFrom} setter2={setDropTo} userLocation={userLocation} />}

                    {showOfferMap && <LocalMap statements={offerRideStatements} location={location} setUserLocation={setUserLocation} dropLocation={dropLocation} setDropLocation={setDropLocation} setLocation={setLocation} link='/offer-ride' mapSetter={setShowOfferMap} secondStatements={confirmOfferRide} val1={startFrom} val2={goTo} setter1={setStartFrom} setter2={setGoTo} userLocation={userLocation} />}
                </div>}

                <div className='inter max-w-6xl px-5 lg:px-10 xl:px-0 font-semibold w-full mx-auto flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <div className={`relative px-1.5 py-2 text-sm sm:text-base flex items-center ${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#f4f4f4] text-[#202020]'} rounded-full w-fit`}>
                            <div className='absolute z-10 w-full px-2 left-0'>
                                <div className={`${toggleTheme ? 'bg-[#0c0c0c]' : 'bg-[#fefefe] '} w-1/2 ${toggle ? 'translate-x-full' : 'translate-x-0'} transition-all duration-200 h-[50px] rounded-full`}></div>
                            </div>
                            <button onClick={() => setToggle(false)} className='pl-11 pr-10 cursor-pointer relative z-20 rounded-full py-3'>
                                Find
                            </button>
                            <button onClick={() => setToggle(true)} className='pl-11 pr-10 cursor-pointer relative z-10 rounded-full py-3'>
                                Offer
                            </button>
                        </div>
                        <button
                            className={`${isHovered || showFindMap || showOfferMap ? 'w-[148px]' : 'w-[45px]'} px-3 py-[11px] h-fit transition-all duration-200 cursor-pointer text-[15px] font-medium border overflow-hidden rounded-full shadow-md flex items-center`}
                            onClick={() => {
                                if (toggle) setShowOfferMap(true)
                                else setShowFindMap(true)
                                document.body.style.overflowY = 'hidden'
                            }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Map size={20} color={toggleTheme ? '#fefefe' : '#202020'} className="flex-shrink-0" />
                            <h1 className={`${isHovered || showFindMap || showOfferMap ? 'ml-1' : 'ml-3'} ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-sm transition-all duration-200 whitespace-nowrap flex-shrink`}>Select by Map</h1>
                        </button>

                    </div>

                    <div className={`relative flex justify-between gap-3 items-center rounded-3xl p-6 lg:p-0 lg:h-40 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f4f4f4]'} max-w-6xl w-full mx-auto inter`}>

                        {/* // for finding ride */}
                        <div className='flex items-center justify-center w-full'>

                            <div className='max-w-6xl w-full lg:mx-10 gap-10 flex flex-col-reverse lg:flex-row items-center lg:justify-between'>

                                <div className='flex justify-between gap-1 w-full sm:gap-4'>
                                    <div className='flex flex-col lg:flex-row gap-4 md:gap-0 lg:gap-4 lg:items-end w-full'>

                                        <div className={`relative ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} grid grid-cols-1 md:grid-cols-2 w-full gap-2`}>

                                            {/* input fields importing from Field.tsx */}
                                            <div className='w-full'>
                                                <label className='font-medium mb-0.5 text-sm'>Pickup</label>
                                                <Field placeholder='Enter pickup location' setLocation={setLocation} value={goFrom} setValue={setGoFrom} showSearch={takePick} setShowSearch={setTakePick} />
                                            </div>
                                            <div className='w-full'>
                                                <label className='font-medium mb-0.5 text-sm'>Dropoff</label>
                                                <Field placeholder='Enter drop-off location' setLocation={setDropLocation} value={dropTo} setValue={setDropTo} showSearch={takeDrop} setShowSearch={setTakeDrop} />
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className='flex flex-col mt-6 sm:flex-row start gap-2'>
                                            {toggle ? (
                                                <Link prefetch={false} href={`/offer-ride?from=${encodeURIComponent(goFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(dropTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`font-medium active:bg-[#00563c] -translate-y-1 active:duration-200 text-[#fefefe] w-full text-sm sm:w-auto rounded-full bg-[#00563c] hover:bg-[#00563ccc] px-12 py-[0.90rem] transition-all duration-300 cursor-pointer`}>Ride</button></Link>
                                            )
                                                : (<Link prefetch={false} href={`/find-ride?from=${encodeURIComponent(goFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(dropTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`font-medium -translate-y-1 text-[#fefefe] w-full text-sm sm:w-auto rounded-full bg-[#00563c] ${toggleTheme ? 'bg-[#048C64]' : 'bg-[#00563c]'} hover:bg-[#00563ccc] active:bg-[#00563c] px-12 py-[0.90rem] transition-all duration-300 cursor-pointer`}>Ride</button></Link>
                                                )}

                                           { !toggle && <button onClick={() => {
                                                setShowVoiceDialog(true)
                                                setStart(true)
                                            }} title='Find by voice' className='sm:py-2 sm:px-3 lg:px-2 p-2.5 cursor-pointer active:scale-95 transition-all duration-200 h-fit rounded-full bg-[#fefefe] flex justify-center items-center gap-1'>
                                                <Mic size={25} color='#00563c' /> <h1 className='text-sm lg:hidden font-medium'>Find by voice</h1>
                                            </button> }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RideConnect
