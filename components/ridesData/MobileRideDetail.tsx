'use client'
import { HeartIcon, MapPinIcon, StarIcon } from '@heroicons/react/16/solid'
import { CreditCard, Dot, Mail, Navigation, Phone, Tag, X, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Overview from './Overview'
import { FaPaypal, FaSpinner } from 'react-icons/fa'
interface Details {
  ride: any,
  isBest: boolean,
  driver: any,
  image: string,
  isFavourite: boolean,
  setFavourite: Dispatch<SetStateAction<boolean>>,
  date: string,
  isCompleted: boolean
}

const MobileRideDetail: React.FC<Details> = ({ ride, image, setFavourite, isBest, isFavourite, date, driver, isCompleted }) => {

  const router = useRouter()

  return (
    <div className='w-full flex flex-col gap-20 px-5 py-4 sm:p-7' style={{ userSelect: 'none' }}>

      {/* top */}
      <div className='w-full'>
        <X className='absolute cursor-pointer translate-y-1' onClick={() => router.back()} size={25} color='#202020' />
        <h1 className='exo2 text-xl sm:text-2xl md:text-3xl text-center w-full font-semibold'>Ride Summary</h1>
      </div>

      {/* //main sections */}
      <div className='flex flex-col gap-12 sm:gap-14'>

        {/* //first section */}
        <div className='flex flex-col gap-6 sm:gap-8'>

          {/* //part 1 */}
          <div className='flex flex-col gap-10'>

            <div className='flex items-center justify-between'>
              <h1 className='flex items-center text-xl md:text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-[5px] h-[5px] rounded-full'></div>Ride Detail</h1>

              {/* //ride status */}
              <div className='bg-[#202020] px-4 py-1.5 flex items-center gap-1 rounded-full'>
                {!isCompleted ? <FaSpinner size={16} style={{ animation: 'rotateAnime 1s linear infinite' }} color='#00b37e' /> : <Check size={16} color='#00b37e' />}
                <h1 className='text-[12px] font-medium text-[#fefefe]'>{isCompleted ? `Completed` : 'Ongoing'}</h1>
              </div>
            </div>

            <img className='mx-auto w-40' src={image || undefined} alt="" />

            <div className='flex flex-col-reverse sm:flex-row sm:justify-between gap-4'>
              <div className='flex gap-2.5 sm:gap-3 flex-col'>
                <h1 className='font-semibold text-sm md:text-base -translate-x-0 sm:-translate-x-0 flex sm:items-center gap-1'><MapPinIcon className='w-6 h-6' color='#202020' />{ride.rideDetails.pickupLocation.pickupName}</h1>

                <h1 className='font-semibold text-sm md:text-base flex sm:items-center gap-2'><Navigation className='w-5 h-5' color='#202020' />{ride.rideDetails.dropoffLocation.dropoffName}</h1>
              </div>

              {/* //labels */}
              <div className='flex items-center sm:flex-col sm:items-end gap-3 sm:pr-2'>
                {isBest && <h1 className='flex items-center gap-1.5 font-semibold text-[13px] md:text-sm'><Tag style={{ strokeWidth: '2.5' }} size={17} color='#202020' />Best Deal</h1>}
                <h1 className='flex items-center gap-1 font-semibold text-[13px] md:text-sm'><StarIcon color='#202020' className='w-5 h-5' />4.5</h1>
              </div>
            </div>
          </div>

          <hr className='mx-auto max-w-2xl w-full' style={{ borderColor: '#f0f0f0' }} />

          {/* //part 2 */}
          <div className='flex flex-col gap-8'>
            <h1 className='flex items-center justify-center gap-1 text-sm'>Current Fare: <p className='font-semibold text-[16px]'>Rs.{ride.budget.totalBudget}</p></h1>

            {/* //more info about ride */}
            <div className='w-full flex justify-between items-center gap-4'>
              <div className='flex flex-col gap-2.5'>
                <h1 className='flex items-center gap-1 text-[13px] sm:text-sm'>Available seats: <p className='font-semibold text-sm sm:text-[15px]'>{ride.rideDetails.seats}</p></h1>
                <h1 className='flex items-center gap-1 text-[13px] sm:text-sm'>Time: <p className='font-semibold text-sm sm:text-[15px]'>{ride.rideDetails.time}</p></h1>
              </div>

              <div className='flex flex-col gap-2.5 pr-2'>
                <h1 className='flex items-center gap-1 text-[13px] sm:text-sm'>Date: <p className='font-semibold text-sm sm:text-[15px]'>{date}</p></h1>
                <h1 className='flex items-center gap-1 text-[13px] sm:text-sm'>Vehicle: <p className='font-semibold text-sm sm:text-[15px]'>{ride.rideDetails.vehicle}</p></h1>
              </div>
            </div>

          </div>
        </div>

        <hr className='w-full' style={{ borderColor: '#f0f0f0' }} />

        {/* //second section */}
        <div className='flex flex-col gap-10'>
          <h1 className='flex items-center text-xl md:text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-[5px] h-[5px] rounded-full'></div>Ride Overview</h1>

          {/* //accordian */}
          <Overview ride={ride} isBest={isBest} />
        </div>

        <hr className='w-full' style={{ borderColor: '#f0f0f0' }} />

        {/* //Driver's info */}
        <div className='flex flex-col gap-10'>
          <h1 className='flex items-center text-xl md:text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-[5px] h-[5px] rounded-full'></div>Driver</h1>

          <div className='bg-[#f0f0f0] flex flex-col gap-4 relative rounded-lg mx-2 sm:mx-4 p-6 shadow-md'>

            <div className='absolute px-4 right-0'>
              <button onClick={() => setFavourite(!isFavourite)} className='flex text-[13px] rounded-full font-semibold transition-all duration-200 cursor-pointer items-center active:scale-[.97] gap-1 bg-[#e0e0e0] p-2 sm:p-3'><HeartIcon className='w-7 transition-all duration-200 h-7' color={isFavourite ? '#00b37e' : '#fefefe'} /></button>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-4'>
              <img className='w-24 sm:w-28 md:w-36 rounded-full' src={ride.additionalInfo.photo === "" ? "/Images/user(1).png" : ride.additionalInfo.photo} alt="" />
              <div className='flex flex-col text-center sm:text-start gap-0.5 md:gap-1'>
                <h1 className='text-lg md:text-xl font-semibold'>{driver.fullname}</h1>
                <h1 className='text-xs mt-0.5 sm:mt-1 sm:text-[13px]'>Gender: {ride.preferences.gender === 'Gender' ? 'Not specified' : ride.preferences.gender}</h1>
                <h1 className='text-xs sm:text-[13px]'>Age: 20</h1>
              </div>
            </div>

            {/* //other info */}
            <div className='flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-start'>

              {/* //Contact info */}
              <div className='flex flex-col mt-1'>
                <h1 className='text-[15px] sm:text-base font-semibold'>Contact info</h1>
                <h1 className='text-xs mt-1.5 flex items-center gap-1'><Mail size={15} color='#202020' /> <p className='underline cursor-pointer'>{driver.email}</p></h1>
                <h1 className='text-xs mt-1.5 flex items-center gap-1'><Phone size={15} color='#202020' /> {driver.number}</h1>
              </div>

              {/* //instruction */}
              <div className='flex flex-col xl:pr-4 mt-1'>
                <h1 className='text-[15px] sm:text-base font-semibold'>Instruction</h1>
                <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.additionalInfo.note === "" ? 'No instruction specified.' : ride.additionalInfo.note}</h1>
              </div>

            </div>
          </div>
        </div>

        {/* //Payment methods */}
        <div>

          <div className='flex flex-col gap-6'>
            <h1 className='flex items-center text-xl md:text-2xl font-semibold gap-2.5 exo2'><div className='bg-[#202020] translate-y-0.5 w-[5px] h-[5px] rounded-full'></div>Payment Methods</h1>

            {/* //card payment button */}
            <div className='flex flex-col gap-3 max-w-lg mx-auto w-full'>
              <button className='flex py-4 w-full cursor-pointer active:bg-[#fffcfc] hover:bg-[#f5f5f5] transition-all duration-200 bg-[#fefefe] shadow-lg justify-center gap-1 rounded-lg items-center'>
                <CreditCard size={25} color='#202020' />
                <h1 className='text-sm sm:text-[16px]'>Credit / Debit card</h1>
              </button>

              {/* //paypal payment button */}
              <button className='flex py-4 w-full cursor-pointer active:bg-[#fffcfc] hover:bg-[#f5f5f5] transition-all duration-200 bg-[#fefefe] shadow-lg justify-center gap-1 rounded-lg items-center'>
                <FaPaypal size={22} color='#202020' />
                <h1 className='text-sm sm:text-[16px]'>PayPal</h1>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default MobileRideDetail
