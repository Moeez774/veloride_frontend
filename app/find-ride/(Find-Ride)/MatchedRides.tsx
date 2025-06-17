import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Car, Navigation, Search, Phone, Target, MapPin, CoinsIcon, ArrowRight } from 'lucide-react'
import '@/components/commonOnes/Commons.css'
import { useRouter } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { getContacts } from '@/context/ContactsProvider'
import { useAuth } from '@/context/AuthProvider';
import Map from './Map';
interface Details {
    isFound: string | null,
    location: { long: number, lat: number },
    dropLocation: { long: number, lat: number },
    drop: string | null,
    pickup: string | null
}
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const MatchedRides: React.FC<Details> = ({ isFound, location, drop, pickup, dropLocation }) => {

    const [currentRides, setCurrentRides] = useState<any[]>([])
    const [rideTypes, setRideTypes] = useState<any[]>([])
    const [driversTime, setDriversTime] = useState<Record<string, string>>({})
    const [currentState, setCurrentState] = useState('best')
    const authContext = getContacts()
    const toggleTheme = authContext?.toggleTheme || false
    const [currentDriver, setCurrentDriver] = useState<string>('')
    const matchedRides = authContext?.matchedRides || null
    const auth = useAuth()
    const user = auth?.user || null
    const userLocation = auth?.userLocation || null || undefined
    const drivers = auth?.drivers || null

    useEffect(() => {
        if (!matchedRides) return
        if (currentState === 'best') {
            setCurrentRides(matchedRides.rides ? matchedRides.rides : [])
        }
        else if (currentState === 'cheapest') {
            setCurrentRides(matchedRides.cheapest ? matchedRides.cheapest : [])
        }
        else if (currentState === 'preference') {
            setCurrentRides(matchedRides.preferred ? matchedRides.preferred : [])
        }
    }, [matchedRides, currentState])

    return (
        <div className={`w-full h-full font-medium inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
            {/* Header */}
            <div className={`h-14 px-6 xl:px-8 flex justify-between items-center shadow-md w-full z-20 fixed top-0 left-0 right-0 ${toggleTheme ? 'text-[#fefefe] border-b border-[#202020] bg-black' : 'text-[#202020] border-none bg-white'}`}>
                <h1 className='font-medium text-2xl'>{isFound === 'false' ? 'Closest Matches' : 'Matched Rides'}</h1>
                <button className='bg-[#00563c] px-3 text-sm py-2.5 rounded-md text-white flex items-center gap-1'>
                    <Search size={17} color='white' /> Find Again
                </button>
            </div>

            {/* Main Content */}
            <div className='pt-14 flex flex-col lg:flex-row w-full'>
                {/* Map Container - Fixed for both mobile and desktop */}
                <div className='fixed top-14 left-0 right-0 h-[40vh] z-10 lg:w-1/2 lg:top-14 lg:bottom-0 lg:left-0 lg:z-10 lg:h-[calc(100vh-3.5rem)]'>
                    <div className='w-full h-full'>
                        {matchedRides && matchedRides.rides && matchedRides.rides.length > 0 &&
                            <Map driversTime={driversTime} setDriversTime={setDriversTime} matchedRides={matchedRides} currentDriver={currentDriver} />
                        }
                    </div>
                </div>

                <div className='w-full mt-[40vh] lg:mt-0 lg:w-1/2 lg:ml-[50%] px-6 py-6'>
                    {/* Filter Controls */}
                    <div className='mb-6 flex justify-between items-center'>
                        <Select value={currentState} onValueChange={setCurrentState}>
                            <SelectTrigger className={`w-[150px] sm:w-[200px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                                <SelectValue placeholder="Best Rides" />
                            </SelectTrigger>
                            <SelectContent className={`inter ${toggleTheme ? 'text-[#fefefe] bg-[black]' : 'text-[#202020] bg-[#fefefe]'}`}>
                                <SelectItem value="best">Best Rides</SelectItem>
                                <SelectItem value="cheapest">Cheapest Rides</SelectItem>
                                <SelectItem value="preference">Preference Based</SelectItem>
                            </SelectContent>
                        </Select>
                        <h1 className='text-sm font-medium'>{currentState.charAt(0).toUpperCase() + currentState.slice(1)} Rides ({currentRides.length})</h1>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6'>
                        {currentRides && currentRides.length === 0 &&
                            <h1 className='text-center text-sm'>No rides found</h1>
                        }

                        {currentRides && currentRides.length > 0 && currentRides.map((ride: any, i: number) => {
                            return (
                                <div key={i} className={`p-4 rounded-lg ${toggleTheme ? 'bg-[#121212]' : 'bg-[#f5f5f5]'}`}>
                                    {ride && (
                                        <div className='flex flex-col w-full gap-3'>
                                            {/* Ride Header */}
                                            <div className='flex justify-between w-full items-center'>
                                                <div className='flex items-center gap-2'>
                                                    <img className='w-10 h-10 rounded-full object-cover' src={ride.additionalInfo.photo === "" ? '/Images/user(1).png' : ride.additionalInfo.photo} alt={ride.driverName} />
                                                    <div className='text-sm font-medium flex flex-col'>
                                                        <div className='flex items-center gap-2'>
                                                            {ride.driverName}
                                                        </div>
                                                        {ride.userId != user?._id ?
                                                            <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                                                {ride.rideDetails.time} - ETA: {!driversTime[ride.userId] ? 'Driver is offline' : driversTime[ride.userId]}
                                                            </p>
                                                            :
                                                            <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                                                {ride.rideDetails.time}
                                                            </p>
                                                        }
                                                    </div>
                                                </div>

                                                <div className='flex items-center gap-3'>
                                                    <button className={`p-2 rounded-full ${toggleTheme ? 'bg-[#252525] hover:bg-[#2a2a2a]' : 'bg-[#e5e5e5] hover:bg-[#dedede]'}`}>
                                                        <Phone size={18} color='#00563c' />
                                                    </button>
                                                    <button
                                                        className={`p-2 rounded-full ${toggleTheme ? 'bg-[#252525] hover:bg-[#2a2a2a]' : 'bg-[#e5e5e5] hover:bg-[#dedede]'}`}
                                                        onClick={() => setCurrentDriver(ride.userId)}
                                                    >
                                                        <Target size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Ride Details */}
                                            <div className={`flex flex-col gap-2 mt-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                                <div className='flex items-center gap-3'>
                                                    <MapPin size={16} />
                                                    <span className='text-sm truncate'>{ride.rideDetails.pickupLocation.pickupName}</span>
                                                </div>
                                                <div className='flex items-center gap-3'>
                                                    <Navigation size={16} />
                                                    <span className='text-sm truncate'>{ride.rideDetails.dropoffLocation.dropoffName}</span>
                                                </div>
                                                <div className='flex items-center gap-3 mt-1'>
                                                    <CoinsIcon size={16} />
                                                    <span className='text-sm'>Rs. {Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}</span>
                                                </div>
                                            </div>

                                            {/* CTA Button */}
                                            <Link
                                                prefetch={false}
                                                href={`/ride-detail/${ride._id}?from=${encodeURIComponent(ride.rideDetails.pickupLocation.pickupName || '')}&long=${ride.rideDetails.pickupLocation.coordinates[0]}&lat=${ride.rideDetails.pickupLocation.coordinates[1]}&to=${encodeURIComponent(ride.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${ride.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${ride.rideDetails.dropoffLocation.coordinates[1]}&isCheaper=false`}
                                                className='w-full mt-2'
                                            >
                                                <button className='bg-[#00563c] w-full text-sm py-2.5 rounded-md text-white cursor-pointer hover:bg-[#00563ccc] flex items-center justify-center gap-1'>
                                                    See Details <ArrowRight className='-rotate-45' size={16} />
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MatchedRides