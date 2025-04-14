import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Params } from 'next/dist/server/request/params'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { CreditCard, Dot, HelpCircle, MessageCircle } from 'lucide-react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { FaPaypal } from 'react-icons/fa';
import Ride from './Ride'
import MobileRideDetail from './MobileRideDetail'
import { useInView } from "react-intersection-observer";
import Messages from './Messages'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from '@/context/AuthProvider'
interface Details {
  ride: any,
  params: Params,
  queries: ReadonlyURLSearchParams,
  isCompleted: boolean,
  setIsCompleted: Dispatch<SetStateAction<boolean>>,
}

const RideDetail: React.FC<Details> = ({ ride, queries, params, isCompleted, setIsCompleted }) => {

  const [isBest, setIsBest] = useState(false)
  const [driver, setDriver] = useState<any>()
  const { ref, inView } = useInView({ threshold: 0.1 });
  const [openChat, setOpenChat] = useState(false)
  const authContext = useAuth()
  const user = authContext?.user || null

  useEffect(() => {
    if (queries.get("isCheaper") === "true") setIsBest(true)
    if (!ride) return

    const fetchDriverData = async () => {
      let a = await fetch('http://localhost:4000/users/check-user', {
        method: "POST", headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: ride.userId })
      })

      let response = await a.json()
      if (response.statusCode === 200) setDriver(response.user)
    }

    fetchDriverData()
  }, [ride])

  const [image, setImage] = useState('')
  const [isFavourite, setFavourite] = useState(false)
  const [showTip, setTip] = useState(false)

  //formatting date
  const date = new Date(ride.rideDetails.date);
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  const formattedDate = date.toLocaleDateString('en-US', options)

  // setting image of vehicle
  useEffect(() => {
    if (!ride) return

    switch (ride.rideDetails.vehicle) {
      case "Compact Car":
        setImage('/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon__1_-removebg-preview.png')
        break;
      case "SUVs":
        setImage('/Images/Screenshot_2025-03-23_090615_cleanup-removebg-preview.png')
        break;
      case "Luxury Car":
        setImage('/Images/vecteezy_luxury-car-side-view-silhouette-on-white-background_54072783_1_-removebg-preview.png')
        break;
      case "Sedan":
        setImage('/Images/vecteezy_car-icon-in-flat-style-simple-traffic-icon__1_-removebg-preview.png')
        break;
    }
  }, [ride])

  const fareInfo = (
    <div className='flex flex-col gap-3'>
      <h1 className='inter font-semibold'>About Fare</h1>

      <div className='flex flex-col gap-2.5'>
        <h1 className='text-[13px]'>1. The driver pays only 40% of the total fare, while the remaining 60% is shared among all passengers.</h1>

        <div className='flex flex-col gap-2.5'>
          <h1 className='text-[13px]'>2. As more passengers join, everyone benefits:</h1>

          <div className='flex flex-col gap-1.5'>
            <div className='flex items-center'>
              <CheckIcon color='#202020' className='w-5 h-5' />
              <h1 className='text-xs'>Drivers pay less per ride!</h1>
            </div>

            <div className='flex items-center'>
              <CheckIcon color='#202020' className='w-5 h-5' />
              <h1 className='text-xs'>Passengers enjoy lower fares!</h1>
            </div>
          </div>
        </div>
      </div>

    </div>
  )

  return (
    <>
      {/* //messages component */}
      {driver && <Messages chat_id={`${user?._id}_${driver._id}`} ride={ride} openChat={openChat} setOpenChat={setOpenChat} receiver={driver} />}

      <div className='min-h-screen inter text-[#202020] w-full flex flex-row lg:flex-row lg:pt-28 relative'>

        <div className='lg:hidden w-full pb-[5rem]'>
          {ride && driver && <MobileRideDetail isCompleted={isCompleted} setFavourite={setFavourite} isBest={isBest} isFavourite={isFavourite} date={formattedDate} driver={driver} image={image} ride={ride} />}
        </div>

        {/* //bottom bar */}
        <div className={`fixed bottom-0 px-4 flex items-center justify-between transition-all duration-200 z-[30] ${inView ? 'h-0 p-0' : 'h-[4.5rem] md:p-6 lg:p-8'} overflow-hidden w-full bg-[#f0f0f0]`}>
          <div className='flex gap-2 items-center'>
            <img className='w-12 sm:w-14 rounded-full' src={ride.additionalInfo.photo === "" ? "/Images/user(1).png" : ride.additionalInfo.photo} alt="" />

            <div className='flex items-center gap-1.5'>
              <div onClick={() => setOpenChat(true)} className='bg-[#00b37e] cursor-pointer transition-all duration-200 active:bg-[#00b36e] hover:bg-[#00b37dc0] shadow-md p-1.5 sm:p-2 rounded-full'>
                <MessageCircle size={27} color='#fefefe' />
              </div>
              <div>
                <h1 className='inter text-[#202020] text-sm sm:text-base font-semibold'>Driver</h1>
              </div>
            </div>

          </div>
          <div className='flex items-center gap-2.5 sm:gap-4'>
            <div className='lg:hidden translate-y-1'>
              <TooltipProvider>
                <Tooltip open={showTip}>
                  <TooltipTrigger><HelpCircle onClick={() => setTip(!showTip)} size={20} color='#202020' /></TooltipTrigger>
                  <TooltipContent className='w-60 bg-[#f0f0f0] text-[#202020] inter'>
                    {fareInfo}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <button className='bg-[#00b37e] transition-all px-9 sm:px-12 duration-200 active:bg-[#00b35f] w-full py-2.5 exo2 font-semibold text-sm sm:text-[17px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#00b37dda]'>Join ride</button>
          </div>
        </div>

        {/* //ride detail for pc screens */}
        <div className='flex-1 hidden pb-[5rem] lg:block'>
          {ride && driver && <Ride setIsCompleted={setIsCompleted} isCompleted={isCompleted} isFavourite={isFavourite} setFavourite={setFavourite} image={image} date={formattedDate} driver={driver} isBest={isBest} ride={ride} />}
        </div>

        {/* //side bar fot pc screens */}
        <div className='w-80 hidden lg:block lg:w-72 h-fit p-5 top-0 left-0' style={{ border: 'none', borderLeft: '0.5px solid #dddddd', borderTop: '0.5px solid #dddddd', scrollbarWidth: 'thin', direction: 'rtl', borderBottom: '0.5px solid #dddddd' }}>

          <div className='flex flex-col gap-8' style={{ direction: 'ltr' }}>

            <div ref={ref}>
              <button className='bg-[#00b37e] transition-all duration-200 active:bg-[#00b35f] w-full py-2.5 exo2 font-semibold text-[17px] shadow-md rounded-md text-[#fefefe] cursor-pointer hover:bg-[#00b37dda]'>Join ride</button>
            </div>

            {/* //chat button */}
            <div className='flex items-center gap-2'>
              <div onClick={() => setOpenChat(true)} className='bg-[#00b37e] cursor-pointer transition-all duration-200 active:bg-[#00b36e] hover:bg-[#00b37dc0] shadow-md p-1.5 sm:p-2 rounded-full'>
                <MessageCircle size={27} color='#fefefe' />
              </div>
              <div>
                <h1 className='inter text-[#202020] text-[13px] sm:text-[15px] lg:text-[16px] font-semibold'>Message Driver</h1>
              </div>
            </div>

            {/* //about fare calculation system */}
            {fareInfo}

            {/* //payment methods */}
            <div className='flex flex-col gap-3'>
              <h1 className='inter font-semibold'>Payment methods</h1>

              <div className='flex flex-col gap-2'>

                {/* //card payment button */}
                <button className='flex py-3 w-full cursor-pointer active:bg-[#fffcfc] hover:bg-[#f5f5f5] transition-all duration-200 bg-[#fefefe] shadow-lg justify-center gap-1 rounded-lg items-center'>
                  <CreditCard size={23} color='#202020' />
                  <h1 className='text-[14px]'>Credit / Debit card</h1>
                </button>

                {/* //paypal payment button */}
                <button className='flex py-3 w-full cursor-pointer active:bg-[#fffcfc] hover:bg-[#f5f5f5] transition-all duration-200 bg-[#fefefe] shadow-lg justify-center gap-1 rounded-lg items-center'>
                  <FaPaypal size={20} color='#202020' />
                  <h1 className='text-[14px]'>PayPal</h1>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default RideDetail
