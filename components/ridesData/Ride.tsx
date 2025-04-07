import { HeartIcon, MapPinIcon, StarIcon } from '@heroicons/react/16/solid'
import { Accessibility, Car, Dot, Heart, Mail, MailCheck, Navigation, Phone, Sliders, Sparkles, Star, Tag } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Details {
    ride: any,
    isBest: boolean,
    driver: any,
    image: string,
    isFavourite: boolean,
    setFavourite: Dispatch<SetStateAction<boolean>>,
    date: string,
}

const Ride: React.FC<Details> = ({ ride, isBest, driver, image, isFavourite, setFavourite, date }) => {

    return (
        <div className='max-w-5xl flex flex-col gap-10 p-8 mx-auto w-full'>

            {/* //ride details */}
            <div className='flex flex-col w-full gap-8'>

                <h1 className='flex items-center text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-1.5 h-1.5 rounded-full'></div>Ride Detail</h1>

                <div className='relative pl-4 mt-4 w-full flex justify-between gap-4'>
                    <div className='flex items-center gap-6'>
                        <img className='w-40' src={image || undefined} alt="" />

                        <div className='flex gap-4 flex-col'>

                            <h1 className='font-semibold flex items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{ride.rideDetails.pickupLocation.pickupName}</h1>

                            <h1 className='font-semibold flex items-center gap-2'><Navigation size={20} color='#202020' />{ride.rideDetails.dropoffLocation.dropoffName}</h1>
                        </div>
                    </div>

                    {/* //labels */}
                    <div className='absolute right-0 flex items-center gap-8 -translate-y-12'>
                        <h1 className='flex items-center gap-1.5 font-semibold text-sm'><Tag style={{ strokeWidth: '2.5' }} size={17} color='#202020' />Best Deal</h1>
                        <h1 className='flex items-center gap-1 font-semibold text-sm'><StarIcon color='#202020' className='w-5 h-5' />4.5</h1>
                    </div>
                </div>

                <hr className='max-w-xl mx-auto w-full' />

                <div className='max-w-2xl flex flex-col gap-8 mx-auto w-full'>

                    <div className='flex gap-3 justify-between items-center'>
                        <h1 className='flex items-center gap-1 text-sm'>Current Fare: <p className='font-semibold text-[16px]'>Rs.{ride.budget.totalBudget}</p></h1>
                        <h1 className='flex items-center gap-1 text-sm'>Available seats: <p className='font-semibold text-[16px]'>{ride.rideDetails.seats}</p></h1>
                        <h1 className='flex items-center gap-1 text-sm'>Time: <p className='font-semibold text-[16px]'>{ride.rideDetails.time}</p></h1>
                    </div>

                    <div className='flex justify-around items-center gap-6'>
                        <h1 className='flex items-center gap-1 text-sm'>Date: <p className='text-[15px]'>{date}</p></h1>
                        <h1 className='flex items-center gap-1 text-sm'>Vehicle: <p className='text-[15px]'>{ride.rideDetails.vehicle}</p></h1>
                    </div>
                </div>
            </div>

            <hr />

            <div className='pl-4 flex w-full flex-col gap-14'>
                <h1 className='flex items-center text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-1.5 h-1.5 rounded-full'></div>Ride Overview</h1>

                {/* //Cards */}
                <div className='flex w-full justify-center gap-12 xl:gap-20'>
                    <div className='rounded-xl flex flex-col gap-5 p-6 shadow-md bg-[#f0f0f0] w-[20em] h-[20em]'>

                        <div className='flex flex-col gap-2.5'>
                            <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Car size={22} color='#202020' />Ride type</h1>
                            <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.rideType}</h1>
                        </div>

                        <div className='flex flex-col gap-2.5'>
                            <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Sliders size={17} color='#202020' />Ride preferences</h1>

                            <div className='flex flex-wrap'>
                                <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.luggageAllowed ? 'Luggage allowed' : 'Luggage not allowed'}</h1>
                                <h1 className='flex items-center ml-2 text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.petAllowed ? 'Pet allowed' : 'Pet not allowed'}</h1>
                                <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.smokingAllowed ? 'Smoking allowed' : 'Smoking not allowed'}</h1>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2.5'>
                            <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Accessibility size={22} color='#202020' />Accessability needs</h1>
                            <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.needs.wheelchairAccess ? 'Wheelchair available' : 'No accessability resource available'}</h1>
                        </div>
                    </div>
                    <div className='rounded-xl flex flex-col gap-5 p-6 shadow-md bg-[#f0f0f0] w-[20em] h-[20em]'>
                        <div className='flex flex-col gap-2.5'>
                            <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Sparkles size={20} color='#202020' />Specialty</h1>
                            <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{isBest ? 'Best and cheapest ride near you.' : 'No specialty'}</h1>
                        </div>

                        {/* //Other info */}
                        <div className='flex flex-col gap-2.5'>
                            <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'>Other</h1>

                            <div className='flex flex-col gap-2'>
                                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Total distance: <p className='font-medium'>{Math.round(ride.rideDetails.distance)} kilometers</p></h1>
                                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Estimated time: <p className='font-medium'>{Math.round(ride.rideDetails.duration)} minutes</p></h1>
                                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Negotiating: <p className='font-medium'>{ride.budget.negotiate ? 'Yes' : 'No'}</p></h1>
                                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Recurring Ride: <p className='font-medium'>{ride.budget.recurring ? ride.budget.recurringVal : 'No'}</p></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className='mt-4' />

            {/* //driver's profile */}
            <div className='pl-4 flex w-full flex-col gap-12'>
                <h1 className='flex items-center text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-1.5 h-1.5 rounded-full'></div>Driver</h1>

                <div className='bg-[#f0f0f0] relative flex flex-col gap-5 p-6 shadow-md w-full h-[20em] rounded-xl'>

                    <div className='absolute px-4 right-0'>
                        <button onClick={() => setFavourite(!isFavourite)} className='flex text-[13px] rounded-3xl font-semibold transition-all duration-200 cursor-pointer items-center active:scale-[.97] gap-1 bg-[#e0e0e0] py-2.5 px-4'><HeartIcon className='w-7 transition-all duration-200 h-7' color={isFavourite ? '#00b37e' : '#fefefe'} /> Add to favourites</button>
                    </div>

                    <div>
                        <img className='w-40 rounded-full' src={ride.additionalInfo.photo === "" ? "/Images/user(1).png" : ride.additionalInfo.photo} alt="" />
                    </div>

                    {/* //other info */}
                    <div className='flex justify-between items-start'>

                        <div className='flex flex-col gap-2'>
                            <h1 className='text-xl xl:text-2xl font-semibold'>{driver.fullname}</h1>
                            <h1 className='text-[13px] xl:text-sm'>Gender: {ride.preferences.gender === 'Gender' ? 'Not specified' : ride.preferences.gender}</h1>
                            <h1 className='text-[13px] xl:text-sm'>Age: 20</h1>
                        </div>

                        {/* //Contact info */}
                        <div className='flex flex-col mt-1'>
                            <h1 className='xl:text-lg font-semibold'>Contact info</h1>
                            <h1 className='text-xs xl:text-[13px] mt-1.5 flex items-center gap-1'><Mail size={15} color='#202020' /> <p className='underline cursor-pointer'>{driver.email}</p></h1>
                            <h1 className='text-xs xl:text-[13px] mt-1.5 flex items-center gap-1'><Phone size={15} color='#202020' /> {driver.number}</h1>
                        </div>

                        {/* //instruction */}
                        <div className='flex flex-col xl:pr-4 mt-1'>
                            <h1 className='xl:text-lg font-semibold'>Instruction</h1>
                            <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.additionalInfo.note === "" ? 'No instruction specified.' : ride.additionalInfo.note}</h1>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Ride
