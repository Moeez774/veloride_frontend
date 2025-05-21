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

    //for fetching distance of rides if they are near
    const fetchDistance = async (e: any) => {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.long},${location.lat};${e.rideDetails.pickupLocation.coordinates[0]},${e.rideDetails.pickupLocation.coordinates[1]}?access_token=${accessToken}`

        const info = await fetch(url)
        const jsonInfo = await info.json()

        if (jsonInfo.code === 'Ok') {
            const route = jsonInfo.routes[0];
            const distance = (route.distance / 1000).toFixed(2)
            return distance
        }
    }

    return (
        <div className={`w-full min-h-screen overflow-y-auto h-full font-medium inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
            <div className={`h-14 px-6 xl:px-8 flex justify-between items-center shadow-md w-full ${toggleTheme ? 'text-[#fefefe] border-b border-[#202020]' : 'text-[#202020] border-none'}`}>
                <h1 className='font-medium text-2xl'>{isFound === 'false' ? 'Closest Matches' : 'Matched Rides'}</h1>

                <button className='bg-[#00563c] px-3 text-sm py-2.5 rounded-md text-white flex items-center gap-1'><Search size={17} color='white' /> Find Again</button>
            </div>

            <div className='w-11/12 flex justify-between items-center mt-10 px-6 xl:px-8'>

                <Select value={currentState} onValueChange={setCurrentState}>
                    <SelectTrigger className={`w-[300px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
                        <SelectValue placeholder="Best Rides" />
                    </SelectTrigger>
                    <SelectContent className={`inter ${toggleTheme ? 'text-[#fefefe] bg-[black]' : 'text-[#202020] bg-[#fefefe]'}`}>
                        <SelectItem value="best">Best Rides</SelectItem>
                        <SelectItem value="cheapest">Cheapest Rides</SelectItem>
                        <SelectItem value="preference">Preference Based</SelectItem>
                    </SelectContent>
                </Select>

                <div className='flex items-center text-sm gap-2'>
                    <div className='w-3 h-3 rounded-full bg-[#3B82F6]'></div>
                    <h1>Best Rides</h1>
                    <div className='w-3 ml-4 h-3 rounded-full bg-[#22C55E]'></div>
                    <h1>Cheapest Rides</h1>
                    <div className='w-3 h-3 ml-4 rounded-full bg-[#F59E0B]'></div>
                    <h1>Preference Based</h1>
                </div>
            </div>

            <div className='flex lg:flex-row flex-col-reverse w-full h-full mt-8 sm:px-6 xl:px-8 gap-6'>
                <div className='lg:max-w-[400px] px-6 sm:px-0 w-full'>
                    <h1 className='text-sm font-medium'>{currentState.charAt(0).toUpperCase() + currentState.slice(1)} Rides ({currentRides.length})</h1>

                    <div className='mt-6 grid grid-cols-1 lg:flex lg:flex-col md:grid-cols-2 lg:grid-cols-1 overflow-y-auto max-h-[calc(100vh-100px)] w-full gap-6' style={{ scrollbarWidth: 'thin' }}>
                        {currentRides && currentRides.length === 0 && <h1 className='text-center text-sm'>No rides found</h1>}

                        {currentRides && currentRides.length > 0 && currentRides.map((ride: any, i: number) => {
                            return (
                                <div key={i}>
                                    { ride && <div key={i} className='flex flex-col w-full gap-2'>

                                        <div className='flex justify-between w-full items-center'>
                                            <div className='flex items-center gap-2'>
                                                <img className='w-9 rounded-full' src={ride.additionalInfo.photo === "" ? '/Images/user(1).png' : ride.additionalInfo.photo} />
                                                <div className='text-sm font-medium flex flex-col gap-1'>
                                                    <div className='flex items-center gap-2'>{ride.driverName} <div className='bg-[#3B82F6] w-3 h-3 rounded-full'></div></div>
                                                   { ride.userId != user?._id ? <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>{ride.rideDetails.time} - ETA: {!driversTime[ride.userId] ? 'Driver is offline' : `${driversTime[ride.userId]}`}</p> : <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>{ride.rideDetails.time}</p> }
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-5'>
                                                <Phone size={22} color='#00563c' />

                                                <button className={`p-2 flex items-center cursor-pointer justify-center ${toggleTheme ? 'text-[#fefefe] hover:bg-[#202020cc] bg-[#202020]' : 'bg-[#f0f0f0] hover:bg-[#f0f0f0cc] text-[#202020]'}`} onClick={() => setCurrentDriver(ride.userId)}>
                                                    <Target size={22} />
                                                </button>

                                            </div>

                                        </div>

                                        <div className={`flex flex-col gap-2.5 ml-3 mt-2.5 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                            <h1 className='flex text-sm items-center gap-[18px]'><MapPin size={18} /> {ride.rideDetails.pickupLocation.pickupName}</h1>
                                            <h1 className='flex text-sm items-center gap-[18px]'><Navigation size={18} /> {ride.rideDetails.dropoffLocation.dropoffName}</h1>

                                            <h1 className='flex text-sm mt-1.5 items-center gap-[18px]'><CoinsIcon size={20} /> Rs. {Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}</h1>
                                        </div>

                                        <Link prefetch={false} href={`/ride-detail/${ride._id}?from=${encodeURIComponent(ride.rideDetails.pickupLocation.pickupName || '')}&long=${ride.rideDetails.pickupLocation.coordinates[0]}&lat=${ride.rideDetails.pickupLocation.coordinates[1]}&to=${encodeURIComponent(ride.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${ride.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${ride.rideDetails.dropoffLocation.coordinates[1]}&isCheaper=false`} className='w-fit'><button className='bg-[#00563c] w-fit px-3 text-sm py-2.5 mt-2 rounded-md text-white cursor-pointer hover:bg-[#00563ccc] flex items-center gap-1'>See Details <ArrowRight className='-rotate-45' size={17} /></button></Link>

                                        <hr className={`w-full mt-4 ${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'}`} />

                                    </div>}
                                </div>
                            )
                        })}
                    </div>

                </div>

                <div className='flex-1 w-full h-full bg-[#f0f0f0]'>
                    {matchedRides && matchedRides.rides && matchedRides.rides.length > 0 && <Map driversTime={driversTime} setDriversTime={setDriversTime} matchedRides={matchedRides} currentDriver={currentDriver} />}
                </div>
            </div>
        </div>
    )
}

export default MatchedRides