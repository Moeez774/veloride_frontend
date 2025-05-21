'use client'
import { ChevronDoubleUpIcon, MapPinIcon, ShareIcon, StarIcon, UserGroupIcon } from '@heroicons/react/16/solid'
import { Car, MessageCircle, Navigation, Phone, Share, Share2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import MobileUpcomingRides from './MobileUpcomingRides'
interface Details {
    user: any,
    getDriversData: (driverId: string) => Promise<any>,
    getImage: (e: string) => string | undefined
}

const Upcomingrides: React.FC<Details> = ({ user, getDriversData, getImage }) => {
    const [myRides, setMyRides] = useState<any[]>([])
    const [drivers, setDrivers] = useState<any>({});

    useEffect(() => {
        if (!user) return
        const userRides = async () => {
            let a = await fetch('http://localhost:4000/rides/owned-rides', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user?._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) setMyRides(response.data)
            else alert(response.message)
        }

        userRides()
    }, [user])

    // for converting date string into valid format
    const getDate = (e: string) => {
        const date = new Date(e);
        const options = { year: "numeric", month: "long", day: "numeric" } as const;
        const formattedDate = date.toLocaleDateString('en-US', options)
        return formattedDate
    }

    //for fetching drivers data
    useEffect(() => {
        const fetchDrivers = async () => {
            const driversData: { [key: string]: any } = {}
            for (const ride of myRides) {
                if (!driversData[ride.userId]) {
                    driversData[ride.userId] = await getDriversData(ride.userId)
                }
            }
            setDrivers(driversData)
        }

        if (myRides.length > 0) {
            fetchDrivers()
        }
    }, [myRides])

    return (
        <>

            <div className='inter lg:px-2 xl:px-6 py-3'>
                {myRides.length === 0 && <div>
                    <div className='loader'></div>
                </div>}

                <div className='lg:hidden flex flex-col gap-6'>
                    <MobileUpcomingRides drivers={drivers} getDate={getDate} getImage={getImage} myRides={myRides} />
                </div>

                <div className='hidden lg:flex flex-col gap-4'>
                    {myRides.length != 0 && drivers && myRides.map((e, index) => {
                        return (
                            <div key={index} className='flex flex-col gap-6'>

                                {/* driver's info */}
                                <div className='flex justify-between gap-2 items-center'>
                                    <div className='flex items-center gap-2'>
                                        {drivers[e.userId]?.photo?.startsWith("hsl") && (
                                            <div className={`rounded-full flex justify-center items-center text-white h-7 w-7 md:w-9 md:h-9`} style={{ background: drivers[e.userId]?.photo }}>
                                                <h1 className='inter md:text-lg'>{drivers[e.userId]?.fullname?.charAt(0).toUpperCase()}</h1>
                                            </div>
                                        )}

                                        {/* user with profile */}
                                        {!drivers[e.userId]?.photo?.startsWith("hsl") && (
                                            <div>
                                                <img className={`w-7 md:w-9 transition-all duration-200 rounded-full`} src={drivers[e.userId]?.photo || undefined} alt="" />
                                            </div>
                                        )}

                                        <div>
                                            <h1 className='text-base font-medium flex items-center gap-1'>Driver <p className='text-xs font-normal'>({drivers[e.userId]?.fullname})</p></h1>
                                        </div>

                                        <div className='flex gap-2 ml-1.5 items-center'>
                                            <div className='p-2 cursor-pointer rounded-full bg-[#f0f0f0] transition-all duration-200 hover:bg-[#f7f3f3]'>
                                                <Phone size='15' color='#202020' />
                                            </div>
                                            <div className='p-2 rounded-full transition-all duration-200 hover:bg-[#f7f3f3] cursor-pointer bg-[#f0f0f0]'>
                                                <MessageCircle size='15' color='#202020' />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <div className='flex items-center gap-0.5'>
                                            <h1 className='text-sm font-medium'>Rated: 5</h1>
                                            <StarIcon className='w-4 h-4' color='#202020' />
                                        </div>
                                        <div className='w-[2px] h-5 bg-[#202020]'></div>
                                        <div>
                                            <h1 className='flex items-center text-sm font-medium gap-0.5'><Car size={20} color='#202020' /> {e.rideDetails.vehicle} </h1>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex items-center justify-between gap-2'>

                                    <div className='flex items-center gap-6'>
                                        <img className='w-28' src={getImage(e.rideDetails.vehicle)} alt="" />

                                        <div className='flex gap-4 text-sm flex-col'>

                                            <h1 className='font-semibold flex xl:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{e.rideDetails.pickupLocation.pickupName}</h1>

                                            <h1 className='font-semibold flex xl:items-center gap-2'><Navigation size={20} color='#202020' />{e.rideDetails.dropoffLocation.dropoffName}</h1>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-4 items-end'>
                                        <h1 className='text-sm font-normal flex items-center gap-1'>Date: <p className='font-medium'>{getDate(e.rideDetails.date)}</p></h1>
                                        <h1 className='text-sm font-normal flex items-center gap-1'>Time: <p className='font-medium'>{e.rideDetails.time}</p></h1>
                                    </div>

                                </div>

                                {/* buttons */}
                                <div className='w-full mt-8 flex justify-between gap-4 items-center'>
                                    <div className='flex gap-2 items-center'>
                                        <div className='bg-[#f0f0f0] cursor-pointer hover:bg-[#f7f3f3] transition-all duration-200 p-2.5 rounded-full'>
                                            <Share2 size={20} color='#202020' />
                                        </div>
                                        <h1 className='text-sm font-medium'>Share ride</h1>
                                    </div>
                                    <button className='bg-[#fd2020] transition-all duration-200 active:bg-[#fd2020e3] px-8 py-2.5 sm:py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#fd2020c5]'>Cancel ride</button>
                                </div>

                                <hr className='w-full my-3' style={{ borderColor: '#f0f0f0' }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>

    )

}

export default Upcomingrides