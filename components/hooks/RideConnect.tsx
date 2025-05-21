'use client'
import React, { useEffect, useState } from 'react'
import Field from '@/components/hooks/Field'
import Link from 'next/link'
import { Map } from 'lucide-react'
import LocalMap from '@/components/hooks/Map'
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider'
const RideConnect = () => {

    // states of all four inputs for showing search suggestion container
    const [takePick, setTakePick] = useState(false)
    const [takeDrop, setTakeDrop] = useState(false)

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

    // statments for showing on selected positions
    const findRideStatements = ["How to Select Your Locations", "Select your Pickup Location by tapping the map once, then select your Drop-Off Location by tapping again. You'll be asked to confirm before proceeding. Click OK to continue."]
    const offerRideStatements = ["How to Select Your Locations", "Tap the map to select your Starting Point, then tap again to select your Destination. You'll be asked to confirm before proceeding. Click OK to continue."]

    //statements for showing after selecting locations
    const confirmFindRide = ["Are you sure?", "You've set your Pickup and Drop-off locations. Ready to find a ride? Click OK to proceed."]
    const confirmOfferRide = ["Are you sure?", "You've set your Starting Point and Destination. Ready to offer a ride? Click OK to proceed."]

    return (

        <div>

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

                <div className={`relative flex justify-between gap-3 items-center rounded-3xl p-6 md:p-0 md:h-40 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f4f4f4]'} max-w-6xl w-full mx-auto inter`}>

                    {/* // for finding ride */}
                    <div className='flex items-center justify-center w-full'>

                        <div className='max-w-6xl w-full md:mx-6 lg::mx-10 gap-10 flex flex-col-reverse md:flex-row items-center md:justify-between'>

                            <div className='flex justify-between gap-1 w-full sm:gap-4'>
                                <div className='flex flex-col md:flex-row gap-8 md:gap-4 lg:gap-6 md:items-end w-full'>

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
                                    <div className='flex flex-col md:flex-row start gap-2'>
                                        {toggle ? (
                                            <Link prefetch={false} href={`/offer-ride?from=${encodeURIComponent(goFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(dropTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`font-medium active:translate-y-0.5 -translate-y-1 active:duration-200 text-[#fefefe] w-[80vw] text-sm sm:w-auto rounded-full bg-[#00563c] ${toggleTheme ? 'bg-[#048C64]' : 'bg-[#00563c]'} hover:bg-[#00563ccc] px-12 py-[0.90rem] transition-all duration-300 cursor-pointer`}>Ride</button></Link>
                                        )
                                            : (<Link prefetch={false} href={`/find-ride?from=${encodeURIComponent(goFrom || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(dropTo || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`} ><button className={`font-medium active:translate-y-0.5 -translate-y-1 active:duration-200 text-[#fefefe] w-[80vw] text-sm sm:w-auto rounded-full bg-[#00563c] ${toggleTheme ? 'bg-[#048C64]' : 'bg-[#00563c]'} hover:bg-[#00563ccc] px-12 py-[0.90rem] transition-all duration-300 cursor-pointer`}>Ride</button></Link>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RideConnect
