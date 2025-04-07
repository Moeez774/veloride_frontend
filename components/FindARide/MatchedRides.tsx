import { ChevronDoubleUpIcon, ClockIcon, MapPinIcon, StarIcon } from '@heroicons/react/16/solid'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Car, Navigation } from 'lucide-react'
import { FaRobot } from 'react-icons/fa';
import '../commonOnes/Commons.css'
import { useRouter } from 'next/navigation'
import { getContacts } from '@/context/ContactsProvider'
interface Details {
    isFound: string | null,
    location: { long: number, lat: number },
    dropLocation: { long: number, lat: number },
    drop: string | null,
    pickup: string | null
}
const accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw';

const MatchedRides: React.FC<Details> = ({ isFound, location, drop, pickup, dropLocation }) => {

    const [distance, setDistance] = useState<any>({})
    const [showBest, setBest] = useState(true)
    const [showCheapest, setCheapest] = useState(false)
    const [showPreference, setPreference] = useState(false)
    const types = [setBest, setCheapest, setPreference]

    const [rideTypes, setRideTypes] = useState<any[]>([])
    const router = useRouter()
    const authContext = getContacts()
    const matchedRides = authContext?.matchedRides || null

    const showTypes = (e: Dispatch<SetStateAction<boolean>>) => types.forEach(type => type(type == e))

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

    //fetching drivers data after matched rides found
    useEffect(() => {
        const fetchDrivers = async () => {
            const distanceData: { [key: string]: any } = {}
            for (const ride of matchedRides.rides) {
                if (!distanceData[ride._id]) {
                    distanceData[ride._id] = await fetchDistance(ride)
                }
            }

            setDistance(distanceData)
        }

        if (matchedRides && matchedRides.rides && matchedRides.rides.length > 0) {
            fetchDrivers()
            setRideTypes(matchedRides.rides)
        }
    }, [matchedRides])

    const routePic = (screen: string) => {
        const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+000(${location.long},${location.lat}),pin-l+f00(${dropLocation.long},${dropLocation.lat})/auto/${screen}?access_token=pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw`
        return url
    }

    const navigators = (
        <div className='flex font-semibold text-[15px] my-1 items-center gap-5 md:gap-8 px-3'>
            <div className='h-10'>
                <button onClick={() => {
                    showTypes(setBest)
                    setRideTypes(matchedRides.rides)
                }} className={`py-1 cursor-pointer ${showBest ? 'text-[#00b37e]' : 'text-[#00b37d9f]'}`}>BEST</button>
                <div className={`h-[3px] ${showBest ? 'translate-y-0 opacity-[1]' : 'opacity-0 translate-y-1'} transition-all duration-200 bg-[#00b37e]`}></div>
            </div>
            <div className='h-10'>
                <button onClick={() => {
                    showTypes(setCheapest)
                    setRideTypes(matchedRides.cheapest)
                }} className={`py-1 cursor-pointer ${showCheapest ? 'text-[#00b37e]' : 'text-[#00b37d9f]'}`}>CHEAPEST</button>
                <div className={`h-[3px] ${showCheapest ? 'translate-y-0 opacity-[1]' : 'opacity-0 translate-y-1'} transition-all duration-200 bg-[#00b37e]`}></div>
            </div>
            <div className='h-10'>
                <button onClick={() => {
                    showTypes(setPreference)
                    setRideTypes(matchedRides.preferred)
                }} className={`py-1 cursor-pointer ${showPreference ? 'text-[#00b37e]' : 'text-[#00b37d9f]'}`}>PREFERENCE BASED</button>
                <div className={`h-[3px] ${showPreference ? 'translate-y-0 opacity-[1]' : 'opacity-0 translate-y-1'} transition-all duration-200 bg-[#00b37e]`}></div>
            </div>
        </div>
    )

    return (
        <>

            {!rideTypes && <div className='flex justify-center h-screen w-screen items-center left-0 top-0 fixed z-50'>
                <div className='loader -translate-y-5'></div>
                <h1 className='inter md:text-lg font-medium text-center mt-4 translate-x-2.5 translate-y-7'>Finding best rides for you...</h1>
            </div>}

            {rideTypes && <div className='inter min-h-screen lg:px-4 text-[#202020] max-w-7xl mx-auto w-full flex flex-col gap-8'>

                <img className='hidden lg:block' src={routePic('1280x300')} alt="" />
                <img className='sm:hidden' src={routePic('600x400')} alt="" />
                <img className='hidden sm:block lg:hidden' src={routePic('800x400')} alt="" />

                <div className='flex w-full flex-col lg:flex-row lg:justify-between sm:text-lg gap-4 lg:gap-2 xl:text-xl px-4 lg:px-6'>

                    <h1 className='font-semibold lg:w-1/2 xl:w-auto flex xl:items-center gap-1'><MapPinIcon className='w-6 -translate-y-0.5 sm:-translate-y-1 h-6 sm:w-8 sm:h-8' color='#202020' />{pickup}</h1>

                    <h1 className='font-semibold flex lg:w-1/2 xl:w-auto xl:items-center gap-2'><Navigation size={22} color='#202020' />{drop}</h1>
                </div>

                <h1 className='text-center font-semibold text-xl mt-8 mx-4 sm:text-2xl'>{isFound === "false" ? "Couldn't find a direct ride, but here are the closest matches." : 'Here are the top rides we’ve found for you.'}</h1>

                <div className='shadow-sm hidden lg:flex justify-between items-center gap-2 rounded-md w-full h-20 px-4 lg:px-6 pb-2 pt-[0.90rem]' style={{ border: '1px solid #eaeaea' }}>
                    <div>{navigators}</div>
                    <div>
                        <button className='flex hover:bg-[#00b37db4] active:bg-[#00b37e] cursor-pointer transition-all duration-200 rounded-full font-medium items-center gap-2 bg-[#00b37e] -translate-y-0.5 px-6 py-2.5 text-[#fefefe]'>
                            Let AI Choose Best<FaRobot size={23} color='#fefefe' />
                        </button>
                    </div>
                </div>

                <div className='flex flex-col lg:grid gap-4 flex-1 lg:grid-cols-3 max-w-6xl bg-[#f0f0f0] pt-4 sm:py-6 lg:bg-[#fefefe] w-full px-3 sm:px-6 mx-auto' style={{ borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }}>

                    <div className='lg:hidden'>{navigators}</div>

                    {rideTypes && rideTypes.map((e: any, index: number) => {
                        if (e != null) {
                            return (
                                <div key={index} onClick={() => router.push(`/ride-detail/${e._id}?from=${encodeURIComponent(e.rideDetails.pickupLocation.pickupName || '')}&long=${e.rideDetails.pickupLocation.coordinates[0]}&lat=${e.rideDetails.pickupLocation.coordinates[0]}&to=${encodeURIComponent(e.rideDetails.dropoffLocation.dropoffName || '')}&dropLong=${e.rideDetails.dropoffLocation.coordinates[0]}&dropLat=${e.rideDetails.pickupLocation.coordinates[0]}&isBest=false`)} className={`card py-4 sm:py-6 px-3 sm:p-6 w-full flex bg-white cursor-pointer justify-between gap-2 h-fit rounded-3xl lg:rounded-lg shadow-lg sm:shadow-sm`} style={{ border: '1px solid #e0e0e0', transition: 'all 0.2s ease-in-out', animation: 'showRides 0.2s ease-in-out' }}>

                                    <div className='flex items-start sm:flex-col gap-4'>
                                        <div className='p-2 w-fit rounded-xl bg-[#00b37e]'>
                                            <Car size={30} color='#fefefe' />
                                        </div>

                                        <div className='flex flex-col'>

                                            {isFound === "false" && <div className='text-[13px] sm:text-sm font-medium'>
                                                {distance[e._id]} km away from your pickup point
                                            </div>}

                                            <h1 className='font-semibold mt-1 mb-2.5 sm:text-lg'>Rs.{Math.round(e.budget.totalBudget / (e.rideDetails.bookedSeats + 1.5))} Active Fare</h1>

                                            <div className='flex items-center gap-4'>
                                                <h1 className='flex items-center gap-1 text-sm font-medium'><ClockIcon className='w-5 h-5' color='#202020' />{e.rideDetails.time}</h1>

                                                <h1 className='flex items-center gap-1 text-sm font-medium'><StarIcon className='w-5 h-5' color='#202020' />4.5</h1>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='p-2 rounded-full hover:bg-[#f0f0f0] transition-all duration-200 cursor-pointer w-fit h-fit'>
                                        <ChevronDoubleUpIcon className={`w-6 rotate-45 transition-all duration-300 h-6`} color='#00b37e' />
                                    </div>
                                </div>
                            )
                        }
                    })}

                    <div className='sticky bottom-0 mt-auto w-full flex justify-center lg:hidden bg-[#f0f0f0] py-4'>
                        <button className='w-full md:w-auto md:px-32 rounded-full flex items-center gap-2 justify-center bg-[#00b37e] active:bg-[#00b37db4] py-3 text-base sm:text-[17px] font-medium text-[#fefefe] exo2'>Let AI Choose Best <FaRobot size={23} color='#fefefe' /></button>
                    </div>
                </div>
            </div >}
        </>
    )
}

export default MatchedRides