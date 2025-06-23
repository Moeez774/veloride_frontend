import { toggleTheme } from '@/app/(HomePage)/MainMap'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, CheckCheck, Star, UserCheck } from 'lucide-react'
import { markPassengerDroppedOff } from '@/functions/ridesFunctions'
import Loader from '@/components/Loader'

const VerifyPax = ({ passengers, ride, setSelectedRide, setActiveRides, activeRides }: { passengers: any[], ride: any, setSelectedRide: any, setActiveRides: any, activeRides: any[] }) => {
  const [passenger, setPassenger] = useState<any>(null)
  const [isChoosed, setIsChoosed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index > 0 && newOtp[index] === "") {
      setOtp(otp.map((_, i) => i === index ? "" : _))
      const inputs = document.querySelectorAll<HTMLInputElement>('input[name="otp"]');
      inputs[index - 1]?.focus();
    }
    else if (value && index < otp.length - 1) {
      const inputs = document.querySelectorAll<HTMLInputElement>('input[name="otp"]');
      inputs[index + 1]?.focus();
    }
  }

  const verifyPassenger = async () => {
    setIsLoading(true)
    if (otp.length !== 4) {
      alert('Please enter the OTP')
      return
    }

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/verify-passenger`, {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          passengerId: passenger.userId,
          otp: otp.join(''),
          rideId: ride._id
        })
      })

      const data = await response.json()
      if (data.statusCode === 200) {
        setActiveRides(activeRides.map((ride) => ride._id === ride._id ? data.ride : ride))
        setSelectedRide(data.ride)
        setIsChoosed(false)
      }
    } catch (err) {
      alert('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const isDark = toggleTheme()

  const dropOffPassenger = async (passenger: any) => {
    setIsLoading(true)
    const updatedRide = await markPassengerDroppedOff(ride._id, passenger.userId, setIsLoading)
    setActiveRides(activeRides.map((ride) => ride._id === ride._id ? updatedRide : ride))
    setSelectedRide(updatedRide)
  }

  return (
    <>

      <div>
        <Dialog>
          <DialogTrigger className={`bg-[#00563c] outline-none cursor-pointer md:text-base text-sm transition-all duration-300 shadow-lg rounded-full text-white px-6 ${isDark ? 'shadow-white/10' : 'shadow-black/20'} py-3`}>Verify/Drop off passengers
          </DialogTrigger>
          <DialogContent className={`border-none p-0 overflow-x-hidden w-full max-h-[500px] h-full overflow-y-auto ${isDark ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'}`}>
            <DialogHeader>
              <DialogTitle className='px-6 text-base md:text-lg mt-5'>{isChoosed ? 'Verify OTP' : 'Varify/Drop off passenger'}</DialogTitle>
              <div className='w-full'>
                <p className={`px-6 text-sm ${isDark ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>{isChoosed ? 'Ask the passenger to enter the OTP sent to their notifications after sending request for your ride.' : 'Select the passenger you wish to verify before joining your ride.'}</p>

                {!isChoosed && <div className='mt-4 flex items-center gap-2 px-6'>
                  <div className='flex items-center gap-2'>
                    <UserCheck size={16} />
                    <p className='text-xs sm:text-sm'>Verify passenger</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCheck size={16} />
                    <p className='text-xs sm:text-sm'>Mark as dropped off</p>
                  </div>
                </div>}

                <div className={`relative ${isChoosed ? '-translate-x-full' : 'translate-x-0'} w-full transition-all duration-300`}>
                  <div className='flex flex-col px-6 gap-2 mt-9'>
                    {passengers.map((e, index) => {
                      return (
                        <div key={index}>
                          <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                              <img className='w-9 rounded-full md:w-10' src={e.photo === "" ? "/Images/user(1).png" : e.photo} alt="" />
                              <div className='flex flex-col gap-1'>
                                <p className='text-sm'>{e.fullname}</p>
                                <p className={`text-xs flex items-center gap-0 ${isDark ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>{e.phone} - <Star className='w-4 mx-1 h-4 border-none' /> {e.rating.toFixed(1)}</p>
                              </div>
                            </div>

                            {e.status === 'pending' && <button className='p-2.5 hover:bg-[#00563ccc] cursor-pointer transition-all duration-200 rounded-full bg-[#00563c] text-white' onClick={() => {
                              setPassenger(e)
                              setIsChoosed(true)
                            }}><UserCheck size={18} /></button>}
                            {e.status === 'verified' && <button className='p-2.5 hover:bg-[#00563ccc] cursor-pointer transition-all duration-200 rounded-full bg-[#00563c] text-white' onClick={() => dropOffPassenger(e)}>{isLoading ? <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                                <circle stroke='#fefefe' className='authCircle' r="20" cy="50" cx="50"></circle>
                              </svg> : <CheckCheck size={22} color='white' />}
                            </button>}
                          </div>

                          <hr className={`my-4 ${isDark ? 'border-[#353535]' : 'border-[#f0f0f0]'}`} />
                        </div>
                      )
                    })}
                  </div>

                  <div className='absolute w-full flex flex-col gap-12 px-6 translate-x-full h-full top-0 left-0'>

                    <p className={`text-sm ${isDark ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Enter it below to verify {passenger?.fullname}</p>

                    <div className='flex w-full justify-center h-full items-center gap-4'>
                      {otp.map((_, index) => {
                        return (
                          <input name='otp' key={index} value={otp[index]} onChange={(e) => handleChange(e, index)} type="text" maxLength={1} className={`w-14 md:w-16 h-14 md:h-16 transition-all duration-300 ${!isDark ? 'focus:outline-[#202020] border-[#e0e0e0] border' : 'border border-[#353535] focus:outline-[#fefefe]'} focus:outline text-lg md:text-xl rounded-md text-center`} />
                        )
                      })}
                    </div>

                    <div className='flex w-full justify-center items-center flex-col gap-2'>
                      <button className='bg-[#00563c] text-white flex items-center justify-center cursor-pointer hover:bg-[#00563ccc] px-6 py-3 rounded-md max-w-[300px] mx-auto w-full mt-4' onClick={verifyPassenger}>{isLoading ? <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                        <circle stroke='#fefefe' className='authCircle' r="20" cy="50" cx="50"></circle>
                      </svg> : 'Verify'}</button>
                      <button className={`cursor-pointer px-6 py-3 rounded-md max-w-[300px] flex items-center gap-2 mx-auto hover:text-[gray] justify-center text-sm ${isDark ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`} onClick={() => setIsChoosed(false)}><ArrowLeft size={20} /> Back to passengers</button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default VerifyPax