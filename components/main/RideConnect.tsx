'use client'
import React, { useEffect, useState } from 'react'
import Field from './Field'
import Link from 'next/link'
import { Map } from 'lucide-react'
import LocalMap from './Map'

const RideConnect = () => {

    // states of all four inputs for showing search suggestion container
    const [takePick, setTakePick] = useState(false)
    const [takeDrop, setTakeDrop] = useState(false)
    const [offerPick, setOfferPick] = useState(false)
    const [offerDrop, setOfferDrop] = useState(false)

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

    // statments for showing on selected positions
    const findRideStatements = ["How to Select Your Locations", "Select your Pickup Location by tapping the map once, then select your Drop-Off Location by tapping again. You'll be asked to confirm before proceeding. Click OK to continue."]
    const offerRideStatements = ["How to Select Your Locations", "Tap the map to select your Starting Point, then tap again to select your Destination. You'll be asked to confirm before proceeding. Click OK to continue."]

    //statements for showing after selecting locations
    const confirmFindRide = ["Are you sure?", "You've set your Pickup and Drop-off locations. Ready to find a ride? Click OK to proceed."]
    const confirmOfferRide = ["Are you sure?", "You've set your Starting Point and Destination. Ready to offer a ride? Click OK to proceed."]

    return (

        <>

            {(showOfferMap || showFindMap) && <div className='flex z-50 fixed w-[100vw] h-screen justify-center items-center left-0 top-0 bg-[#0000003d]'>

                {showFindMap && <LocalMap statements={findRideStatements} location={location} dropLocation={dropLocation} setDropLocation={setDropLocation} setLocation={setLocation} link='/find-ride' mapSetter={setShowFindMap} secondStatements={confirmFindRide} val1={goFrom} val2={dropTo} setter1={setGoFrom} setter2={setDropTo} />}

                {showOfferMap && <LocalMap statements={offerRideStatements} location={location} setDropLocation={setDropLocation} dropLocation={dropLocation} setLocation={setLocation} link='/offer-ride' mapSetter={setShowOfferMap} secondStatements={confirmOfferRide} val1={startFrom} val2={goTo} setter1={setStartFrom} setter2={setGoTo} />}
            </div>}

            <div className='pt-24 pb-16 md:pb-10 gap-20 justify-center items-center bg-[#fefefe] inter flex flex-col'>

                {/* // for finding ride */}
                <div className='flex items-center pt-20 justify-center w-full'>

                    <div className='max-w-6xl w-full mx-20 md:mx-10 gap-10 flex flex-col-reverse md:flex-row items-center md:justify-between'>

                        <div className='flex gap-1 sm:gap-4'>

                            <div className='flex gap-6 flex-col items-center md:items-start'>

                                <div>
                                    <h1 className={`exo2 firstHead text-4xl lg:text-5xl sm:w-[20rem] lg:w-[25rem] leading-[45px] lg:leading-[55px] transition-all text-center md:text-start duration-300 text-[#00b37e] font-bold`}>Your Perfect Ride Awaits!</h1>
                                </div>

                                <div className='flex flex-col items-center gap-3'>

                                    {/* inout fields importing from Field.tsx */}
                                    <Field placeholder='Pickup Location' setLocation={setLocation} value={goFrom} setValue={setGoFrom} showSearch={takePick} setShowSearch={setTakePick} />
                                    <Field placeholder='Drop-off Location' setLocation={setDropLocation} value={dropTo} setValue={setDropTo} showSearch={takeDrop} setShowSearch={setTakeDrop} />
                                </div>

                                {/* CTA */}
                                <div className='lg:w-96 mt-3 flex flex-col sm:flex-row items-center gap-2'>
                                    <Link prefetch={false} href={`/find-ride?from=${encodeURIComponent(goFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(dropTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`exo2 active:translate-y-0.5 active:duration-200 text-[#fefefe] w-[80vw] sm:w-auto rounded-md bg-[#00b37e] shadow-lg font-bold hover:bg-[#00b37de1] px-8 py-3 transition-all duration-300 cursor-pointer`}>Find a ride</button></Link>

                                    <button className='py-3 px-4 active:translate-y-0.5 transition-all duration-200 cursor-pointer hover:bg-[#e9e8e8] text-[15px] exo2 font-semibold bg-[#fefefe] text-[#00b37e] rounded-md shadow-md flex items-center justify-center w-[80vw] sm:w-auto gap-1' onClick={() => {
                                        setShowFindMap(true)
                                        document.body.style.overflowY = 'hidden'
                                    }}>Select by Map <Map size={20} color='#00b37e' /></button>
                                </div>
                            </div>

                        </div>

                        <div>
                            <img loading='lazy' className='max-w-sm w-full rounded-md' src="/Images/Flux_Dev_A_sleek_futuristic_illustration_of_a_friendly_woman_l_3.png" alt="" />
                        </div>
                    </div>

                </div>

                {/* // for offering a ride */}
                <div className='flex items-center justify-center w-full'>

                    <div className='max-w-6xl mx-10 gap-10 w-full flex flex-col md:flex-row items-center md:justify-between'>

                        <div>
                            <img loading='lazy' className='max-w-md w-full rounded-md' src="/Images/Flux_Dev_A_sleek_futuristic_illustration_of_a_friendly_man_off_0-removebg-preview_processed.png" alt="" />
                        </div>

                        <div className='flex gap-1 sm:gap-0 md:gap-4'>

                            <div className='flex gap-6 flex-col items-center md:items-start'>

                                <div>
                                    <h1 className={`exo2 firstHead text-4xl lg:text-5xl sm:w-[22rem] md:w-[20rem] lg:w-[30rem] md:leading-[45px] lg:leading-[55px] transition-all text-center md:text-start duration-300 text-[#00b37e] font-bold`}>Turn Your Commute into Cash!</h1>
                                </div>

                                <div className='flex flex-col items-center gap-3'>
                                    <Field placeholder='Pickup Location' setLocation={setLocation} value={startFrom} setValue={setStartFrom} showSearch={offerPick} setShowSearch={setOfferPick} />
                                    <Field placeholder='Drop-off Location' setLocation={setDropLocation} showSearch={offerDrop} value={goTo} setValue={setGoTo} setShowSearch={setOfferDrop} />
                                </div>

                                {/* CTA */}
                                <div className='lg:w-96 flex flex-col sm:flex-row items-center gap-2 mt-3'>
                                    <Link prefetch={false} href={`/offer-ride?from=${encodeURIComponent(startFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(goTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`exo2 active:translate-y-0.5 active:duration-200 text-[#fefefe] rounded-md bg-[#00b37e] shadow-lg font-bold hover:bg-[#00b37de1] w-[80vw] sm:w-auto px-8 py-3 transition-all duration-300 cursor-pointer`}>Offer a ride</button></Link>

                                    <button className='py-3 px-4 active:translate-y-0.5 transition-all duration-200 cursor-pointer hover:bg-[#e9e8e8] text-[15px] exo2 font-semibold bg-[#fefefe] text-[#00b37e] rounded-md shadow-md flex items-center justify-center w-[80vw] sm:w-auto gap-1' onClick={() => {
                                        setShowOfferMap(true)
                                        document.body.style.overflowY = 'hidden'
                                    }}>Select by Map <Map size={20} color='#00b37e' /></button>
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
