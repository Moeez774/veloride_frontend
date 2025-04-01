'use client'
import { ChevronDoubleUpIcon, MapPinIcon, StarIcon, UserGroupIcon } from '@heroicons/react/16/solid'
import { MessageCircle, Navigation, Phone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
interface Details {
    user: any
}

const Upcomingrides: React.FC<Details> = ({ user }) => {
    const [myRides, setMyRides] = useState<any[]>([])

    useEffect(() => {
        if (!user) return

        const userRides = async () => {
            let a = await fetch('http:localhost:4000/rides/owned-rides', {
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

    // for taking image of specific ride vehicle
    const getImage = (e: string) => {
        switch (e) {
            case "Standard Car":
                return '/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon__1_-removebg-preview.png'
            case "SUV / Van":
                return '/Images/Screenshot_2025-03-23_090615_cleanup-removebg-preview.png'
            case "Luxury Car":
                return '/Images/vecteezy_luxury-car-side-view-silhouette-on-white-background_54072783_1_-removebg-preview.png'
            case "Electric Vehicle":
                return '/Images/Screenshot_2025-03-23_091233-removebg-preview.png'
        }
    }

    const getDriversData = async (driverId: string) => {
        // let a = await fetch('http://localhost:4000/users/check-user', {
        //     method: "POST", headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ _id: driverId })
        // })

        // let response = await a.json()
        // if (response.statusCode === 200) return response.user
        // else alert(response.message)
    }

    return (
        <>

            <div className='inter lg:px-2 xl:px-6 py-3'>
                {myRides.length === 0 && <div>
                    <div className='loader'></div>
                </div>}

                <div className='hidden lg:flex flex-col gap-4'>
                    {myRides.length != 0 && myRides.map(async (e, index) => {
                        return (
                            <div key={index} className='flex flex-col gap-2'>

                                {/* driver's info */}
                                <div className='flex justify-between gap-2 items-center'>
                                    <div>
                                        {/* {await getDriversData(e.userId).then(driver => driver.photo?.startsWith("hsl") && (
                                            <div className={`rounded-full flex justify-center items-center text-white h-8 w-8 md:w-10 md:h-10`} style={{ background: driver.photo }}>
                                                <h1 className='inter md:text-lg'>{driver.fullname?.charAt(0).toUpperCase()}</h1>
                                            </div>
                                        ))} */}

                                        {/* user with profile */}
                                        {/* {!(await getDriversData(e.userId).then(driver => driver.photo?.startsWith("hsl"))) && (
                                            <div>
                                                {await getDriversData(e.userId).then(driver => (
                                                    <img className={`w-8 md:w-10 transition-all duration-200 rounded-full`} src={driver.photo || undefined} alt="" />
                                                ))}
                                            </div>
                                        )} */}
                                    </div>

                                    <div>

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
                                    <button className='bg-[#fefefe] transition-all duration-200 active:bg-[#fefefe] px-10 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#00b37e] cursor-pointer  hover:bg-[#f0f0f0]'>Edit ride</button>
                                    <button className='bg-[#fd2020] transition-all duration-200 active:bg-[#fd2020e3] px-8 text-sm py-3 exo2 font-semibold text-[15px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#fd2020c5]'>Delete ride</button>
                                </div>

                                <hr className='w-full mt-7' style={{ borderColor: '#f0f0f0' }} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </>

    )

}

export default Upcomingrides