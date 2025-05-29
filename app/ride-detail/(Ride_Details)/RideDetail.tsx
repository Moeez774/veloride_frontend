import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Params } from 'next/dist/server/request/params'
import { ReadonlyURLSearchParams } from 'next/navigation'
import socket from '@/utils/socket'
import { useInView } from "react-intersection-observer";
import Messages from './Messages'
import { Car, ChevronLeft, Coins, Dot, Luggage, MessageCircle, Star, PawPrint, Clock, AlertCircle, Map, AlertTriangle, Sparkles, Heart, HeartCrack } from 'lucide-react'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { FaSmoking } from 'react-icons/fa';
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { trackRideTime } from '@/functions/function'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LocalMap from './Map'
import { fetchEta } from '@/functions/function'
import { useRide } from '@/context/states'
import { DialogDescription } from '@radix-ui/react-dialog';
import Link from 'next/link';
interface Details {
  ride: any,
  params: Params,
  queries: ReadonlyURLSearchParams,
  isCompleted: boolean,
  setIsCompleted: Dispatch<SetStateAction<boolean>>,
  setRide: Dispatch<SetStateAction<any>>
}

const RideDetail: React.FC<Details> = ({ ride, setRide, queries, params, isCompleted, setIsCompleted }) => {

  const [isBest, setIsBest] = useState(false)
  const [driver, setDriver] = useState<any>()
  const { setNotifications } = useRide()
  const [seeReason, setSeeReason] = useState(false)
  const [reason, setReason] = useState('')
  const { rideState, setRideState } = useRide()
  const [isDeclined, setIsDeclined] = useState(false)
  const [hasBooked, setHasBooked] = useState(false)
  const [message, setMessage] = useState('')
  const [openChat, setOpenChat] = useState(false)
  const [otp, setOtp] = useState('')
  const [paying, setPaying] = useState(0)
  const [bookedSeats, setBookedSeats] = useState(0)
  const [open, setOpen] = useState(false)
  const authContext = useAuth()
  const allDrivers = authContext?.drivers || []
  const [passengerStatus, setPassengerStatus] = useState('')
  const user = authContext?.user || null
  const otherContext = getContacts()
  const toggleTheme = otherContext?.toggleTheme || false
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; status: string }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'upcoming'
  })

  useEffect(() => {
    if (queries.get("isCheaper") === "true") setIsBest(true)
    if (!ride) return

    const fetchDriverData = async () => {
      let a = await fetch(`http://localhost:4000/users/check-user?id=${ride.userId}`, {
        method: "GET", headers: {
          "Content-Type": "application/json"
        },
      })

      let response = await a.json()
      if (response.statusCode === 200) setDriver(response.user)
    }

    fetchDriverData()
  }, [ride])

  const updateSystem = () => {
    if (!ride || !user) return

    const bookedPassenger = ride.passengers?.find((passenger: any) => passenger.userId === user?._id)

    if (bookedPassenger && bookedPassenger.status != 'declined') {
      setHasBooked(true)
      setPassengerStatus(bookedPassenger.status)
      setBookedSeats(bookedPassenger.seatsBooked)
      setPaying(bookedPassenger.paying * bookedPassenger.seatsBooked)
    }
    else if (bookedPassenger && bookedPassenger.status === 'declined') {
      setIsDeclined(true)
      setReason(bookedPassenger.message)
    }
  }

  useEffect(() => {
    if (!ride || !user) return
    updateSystem()
  }, [ride, user])

  const [image, setImage] = useState('')
  const [driversTime, setDriversTime] = useState<any>({})
  const [avgTime, setAvgTime] = useState<any>(0)

  //formatting date
  const date = new Date(ride.rideDetails.date);
  const options = { year: "numeric", month: "long", day: "numeric" } as const;
  const formattedDate = date.toLocaleDateString('en-US', options)

  useEffect(() => {
    if (!ride) return

    const fetchImage = async () => {
      if (window.innerWidth > 768) {
        const image = `https://api.mapbox.com/styles/v1/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}/static/pin-s+ff0000(${ride.rideDetails.pickupLocation.coordinates[0]},${ride.rideDetails.pickupLocation.coordinates[1]}),pin-s+00ff00(${ride.rideDetails.dropoffLocation.coordinates[0]},${ride.rideDetails.dropoffLocation.coordinates[1]})/auto/1200x800?access_token=pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw`
        setImage(image)
      }
      else {
        const image = `https://api.mapbox.com/styles/v1/mapbox/${toggleTheme ? 'dark-v11' : 'streets-v11'}/static/pin-s+ff0000(${ride.rideDetails.pickupLocation.coordinates[0]},${ride.rideDetails.pickupLocation.coordinates[1]}),pin-s+00ff00(${ride.rideDetails.dropoffLocation.coordinates[0]},${ride.rideDetails.dropoffLocation.coordinates[1]})/auto/600x400?access_token=pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw`
        setImage(image)
      }
    }

    fetchImage()

  }, [ride, toggleTheme])

  useEffect(() => {
    if (!allDrivers || allDrivers.length === 0 || !ride) return

    const long = localStorage.getItem("long")
    const lat = localStorage.getItem("lat")

    const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]

    const foundDrivers = allDrivers.filter((driver: any) => {
      return ride.userId === driver.userId
    })

    const sources = foundDrivers.map((driver: any) => [driver.location[0], driver.location[1]])
    const targets = [currLocation]

    fetchEta({ sources, targets, setAvgTime, setDriversTime, drivers: allDrivers })

  }, [allDrivers, ride])

  const joinRide = async () => {
    if (bookedSeats === 0) {
      alert("Please enter number of seats")
      return
    }
    else if (bookedSeats > ride.rideDetails.seats - ride.rideDetails.bookedSeats) {
      alert("Not enough seats available")
      return
    }

    try {
      const response = await fetch('http://localhost:4000/rides/join-ride', {
        method: "PUT", headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({
          userId: user?._id,
          name: user?.fullname,
          phone: user?.number,
          photo: rideState.photo,
          seatsBooked: bookedSeats,
          paying: ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5),
          luggage: rideState.luggage,
          pet: rideState.pet,
          smoking: rideState.smoking,
          rideId: ride._id,
          rating: user?.rating
        })
      })

      const data = await response.json()
      if (data.statusCode === 200) {
        setOpen(false)
        setMessage("Ride joined successfully. Please check your notifications for the OTP, which will be used to verify your identity before ride starts to prevent fraud.")
        setNotifications(prev => [data.notification, ...prev])
        setRide(data.data)
        setOtp(data.data.otp)
        setHasBooked(true)
        setPaying(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))
        socket.emit('ride-joined', { ride: data.data, notificationForDriver: data.notificationForDriver })
      } else {
        alert(data.message)
      }
    } catch (err) {
      console.log(err)
      alert("Error joining ride" + err)
    }
  }

  //tracking ride time
  useEffect(() => {
    if (!ride || ride.status !== 'waiting') return;

    let isCancelled = false;

    const calculateTimeLeft = async () => {
      await trackRideTime(ride, setTimeLeft, isCancelled, setRide)
    }

    calculateTimeLeft()
    const timer = setInterval(() => {
      if (ride.status !== 'waiting') return
      calculateTimeLeft();
    }, 1000);

    return () => {
      clearInterval(timer);
      isCancelled = true;
    };
  }, [ride._id, ride.rideDetails.date, ride.rideDetails.time, ride.status]);

  const cancelRide = async () => {
    try {
      const response = await fetch('http://localhost:4000/rides/cancel-ride', {
        method: "PUT", headers: {
          "Content-Type": "application/json"
        }, body: JSON.stringify({ rideId: ride._id, userId: user?._id })
      })

      if (!response.ok) {
        setMessage("Error cancelling ride")
        return
      }

      const data = await response.json()
      if (data.statusCode === 200) {
        setMessage("Your ride has been cancelled. If something went wrong, we’re here to make it better. Veloride is built to move you smarter, safer, and together. Ready when you are. We'll be here.")
        setRide(data.data)
        setNotifications(prev => prev.filter((notfi) => notfi._id !== data.notification._id))
        setOtp('')
        setHasBooked(false)
        setPaying(0)
        setBookedSeats(0)
        setNotifications(prev => [data.notification, ...prev])
        socket.emit('ride-cancelled', { ride: data.data, notificationForDriver: data.notificationForDriver })
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    socket.on('ride-joined', ({ ride, notificationForDriver }: { ride: any, notificationForDriver: any }) => {
      setRide(ride)
    })

    socket.on('ride-cancelled', ({ ride, notification }: { ride: any, notification: any }) => {
      setRide(ride)
    })

    socket.on('ride-updated', ({ ride, rideId }: { ride: any, rideId: string }) => {
      setRide(ride)
    })


    socket.on('passenger-declined', ({ ride, notificationForPassenger }: { ride: any, notificationForPassenger: any }) => {
      setRide(ride)
      setHasBooked(false)
      setNotifications(prev => [notificationForPassenger, ...prev])
      setPaying(0)
      setBookedSeats(0)
    })

    socket.on('passenger-dropped-off', ({ ride, notification, passengerId, rideId }: { ride: any, notification: any, passengerId: string, rideId: string }) => {
      if (passengerId === user?._id && rideId === ride._id) {
        setPassengerStatus('dropped')
        setRide(ride)
      }
    })

    return () => {
      socket.off('ride-joined')
      socket.off('ride-updated-by-driver')
      socket.off('ride-cancelled')
      socket.off('passenger-dropped-off')
      socket.off('ride-started')
      socket.off('passenger-declined')
    }
  }, [])

  return (
    <>

      <Dialog open={seeReason} onOpenChange={setSeeReason}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className={`border-none ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'text-[#202020] bg-[#fefefe]'}`}>
          <DialogHeader>
            <DialogTitle className='text-red-500'>Driver's reason for declining</DialogTitle>
            <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-medium mt-2`}>
              <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Reason: {reason}</h1>

              <h1 className='mt-10 text-xs'>Note: If you have any issues with the reason, you can contact the driver or contact us with ride id so we can look into it and help you out so you can book a ride again.</h1>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={message !== ''} onOpenChange={() => setMessage('')}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className={`border-none ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'text-[#202020] bg-[#fefefe]'}`}>
          <DialogHeader>
            <DialogTitle>
              {!message.includes('wrong') ? <p className='flex items-center gap-2'>Congratulations! <Sparkles size={20} color={toggleTheme ? '#fefefe' : '#202020'} /></p> : (
                <p className='flex items-center gap-2'>Oops! <HeartCrack size={20} color={toggleTheme ? '#fefefe' : '#202020'} /></p>
              )}
            </DialogTitle>
            <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-medium mt-2`}>
              <h1 className='text-sm'>{message}</h1>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* //messages component */}
      {driver && <Messages chat_id={`${user?._id}_${driver._id}`} ride={ride} openChat={openChat} setOpenChat={setOpenChat} receiver={driver} />}

      <div className={`inter min-h-screen inter text-[#202020] w-full flex flex-col relative ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>
        <div className='flex-1 pb-10'>
          <div className='py-4 px-6 lg:px-8 w-full relative'>
            <div className={`fixed right-4 md:left-1/2 md:-translate-x-1/2 top-4 flex flex-col items-end md:items-center gap-1.5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} z-50 w-fit`}>

              {/* write in big bold  */}
              {isDeclined &&
                <div>
                  <h1 className={`text-lg text-red-500 font-bold`}>Driver has declined your ride request.</h1>
                  <p className={`text-sm text-center ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>You can see reason below</p>
                </div>
              }

              {!isDeclined && <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} whitespace-nowrap`}>
                {passengerStatus === 'dropped' ? 'Dropped' : ride.status === "started" ? 'Ride in progress' : timeLeft.status === 'started' || (ride.status === 'waiting' || ride.status === 'ready') ? 'Waiting' : ride.status === 'cancelled' ? 'Ride cancelled' : 'Time until ride starts'}
              </div>}
              {!isDeclined && passengerStatus === 'dropped' ? (
                <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit md:w-full md:justify-center`}>
                  <AlertCircle size={16} className="text-[#01B580] rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Please pay for the ride</span>
                </div>
              ) : !isDeclined && ((timeLeft.status === 'started' && ride.status === 'waiting') || ride.status === 'ready') ? (
                <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit md:w-full md:justify-center`}>
                  <AlertCircle size={16} className="text-[#01B580] rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Waiting for driver to start ride</span>
                </div>
              ) : ride.status === 'started' ? (
                <div className={`flex gap-2 items-center px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit md:w-full md:justify-center`}>
                  <AlertCircle size={16} className="text-[#01B580] rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Driver is on the way, please wait.</span>
                </div>
              ) : ride.status === 'cancelled' ? (
                <div className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit md:w-full md:justify-center`}>
                  <AlertTriangle size={16} className="text-red-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Ride has cancelled by driver</span>
                </div>
              ) : !isDeclined && (
                <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'bg-[#202020]/80' : 'bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit md:w-full md:justify-center`}>
                  <Clock size={16} className="text-[#00563c] flex-shrink-0" />
                  <div className="flex items-center gap-2 sm:gap-4">
                    {timeLeft.hours > 0 && (
                      <div className="flex flex-col items-center min-w-[35px] sm:min-w-[45px]">
                        <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] opacity-70">hours</span>
                      </div>
                    )}
                    <div className="flex flex-col items-center min-w-[35px] sm:min-w-[45px]">
                      <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] opacity-70">mins</span>
                    </div>
                    <div className="flex flex-col items-center min-w-[35px] sm:min-w-[45px]">
                      <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] opacity-70">secs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <h1 className='text-lg font-bold mt-16 lg:mt-0'>Ride Details</h1>

            <div className='flex gap-3 mt-8'>

              <div className={`${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} md:block hidden h-fit mt-2 w-fit p-2.5 rounded-full`}>
                <ChevronLeft size={20} style={{ strokeWidth: 3 }} color={toggleTheme ? '#fefefe' : '#202020'} />
              </div>

              <div className='flex flex-col w-full'>
                <div className='flex w-full sm:flex-row flex-col items-start gap-4 sm:items-center sm:justify-between'>

                  <div>
                    {/* //getting last 4 difit of id as unique id */}
                    <h1 className='text-2xl font-medium flex items-center gap-2'>Ride-{ride._id.slice(-5)}</h1>

                    <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} flex items-center text-[13px] mt-1`}>Departure Time: {formattedDate} <Dot size={20} /> {ride.rideDetails.time}</h1>

                    <div className={`flex flex-col gap-1 mt-4`}>
                      <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} flex gap-1 items-center text-sm font-semibold`}>
                        <Coins size={20} />
                        {hasBooked ? (
                          <div className='flex items-center gap-1'>
                            <h1>
                              Your fare: Rs.{Math.round(paying)} Per Seat <span className="text-xs font-normal opacity-70">({bookedSeats} {bookedSeats === 1 ? 'seat' : 'seats'}) {ride.rideDetails.bookedSeats < ride.rideDetails.seats ? `- Current fare: Rs.${Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}` : ''}</span>
                            </h1>
                            {ride.rideDetails.bookedSeats < ride.rideDetails.seats && <div className='ml-0 flex items-center gap-1'>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger><Info size={18} /></TooltipTrigger>
                                  <TooltipContent className='bg-[#00563c] w-[200px] text-center text-[#fefefe] inter'>
                                    <p>This is the currently available fare for the ride. This will be apply for every passenger in case one more person joins the ride.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>}
                          </div>
                        ) : !hasBooked && ride.rideDetails.bookedSeats < ride.rideDetails.seats ? (
                          `Current fare: Rs.${Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}`
                        ) : (
                          'Ride full'
                        )}
                      </h1>
                      {hasBooked && ride.rideDetails.bookedSeats >= ride.rideDetails.seats && (
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                          Ride is full
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>

                    {ride && !isDeclined && <LocalMap ride={ride} />}

                    <button onClick={() => setOpenChat(true)} className={`p-2 cursor-pointer rounded-md font-medium ${toggleTheme ? 'text-[#fefefe] border hover:bg-[#202020cc] border-[#202020]' : 'text-[#202020] border hover:bg-[#f0f0f0cc]'}`}><MessageCircle size={20} /> </button>

                    {isDeclined ? (
                      <button className={`px-4 py-2.5 w-32 md:w-40 text-sm sm:text-base cursor-pointer rounded-md font-medium  ${toggleTheme ? 'text-[#b1b1b1] bg-[#202020] hover:bg-[#202020cc]' : 'text-[#5b5b5b] hover:bg-[#f0f0f0cc] bg-[#f0f0f0]'}`} onClick={() => setSeeReason(true)}>See reason</button>
                    ) : passengerStatus === 'dropped' ? (
                      <Link href={`/checkout?rideId=${ride._id}&amount=${Math.round(paying)}&by=${user?._id}&to=${ride.userId}`}><button className={`px-4 py-2.5 w-32 md:w-40 text-sm sm:text-base cursor-pointer rounded-md font-medium text-white hover:bg-[#00563ccc] bg-[#00563c]`}>Pay</button></Link>
                  ) : !hasBooked && ride.rideDetails.bookedSeats < ride.rideDetails.seats ? (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger onClick={() => setOpen(true)} className='px-4 py-2.5 bg-[#00563c] w-40 text-[#fefefe] hover:bg-[#00563ccc] active:bg-[#00563c] cursor-pointer rounded-md font-medium'>Join Ride
                    </DialogTrigger>
                    <DialogContent className={`inter ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#f0f0f0] text-[#202020]'} border-none`}>
                      <DialogHeader>
                        <DialogTitle className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>How many seats are you booking?</DialogTitle>
                        <div className="mt-4">
                          <input
                            type="number"
                            min="1"
                            value={bookedSeats}
                            onChange={(e) => setBookedSeats(e.target.value as unknown as number)}
                            max={ride.rideDetails.seats - ride.rideDetails.bookedSeats}
                            className={`w-full p-2 outline-none rounded-md ${toggleTheme ? 'bg-[#202020] text-[#fefefe] border border-[#b1b1b1]' : 'bg-[#f0f0f0] border text-[#202020]'}`}
                            placeholder="Enter number of seats"
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                          <p className={`mt-2 text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                            Available seats: {ride.rideDetails.seats - ride.rideDetails.bookedSeats}
                          </p>
                        </div>
                      </DialogHeader>
                      <DialogFooter>
                        <button onClick={joinRide} className='px-8 text-sm sm:text-base py-2.5 bg-[#00563c] text-[#fefefe] hover:bg-[#00563ccc] active:bg-[#00563c] cursor-pointer rounded-md font-medium'>Join ride</button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  ) : hasBooked && ride.status !== 'started' ? (
                  <button onClick={cancelRide} className={`px-4 py-2.5 w-32 text-sm sm:text-base md:w-40 cursor-pointer rounded-md font-medium ${toggleTheme ? 'text-[#b1b1b1] bg-[#202020] hover:bg-[#202020cc]' : 'text-[#5b5b5b] hover:bg-[#f0f0f0cc] bg-[#f0f0f0]'}`}>Cancel ride</button>
                  ) : ride.status === 'started' ? (
                  <button disabled className={`px-4 py-2.5 w-32 md:w-40 text-sm sm:text-base cursor-not-allowed rounded-md font-medium ${toggleTheme ? 'text-[#b1b1b1] bg-[#202020]' : 'text-[#5b5b5b] bg-[#f0f0f0]'}`}>Ride in progress</button>
                  ) : (
                  <button disabled className={`px-4 py-2.5 w-32 md:w-40 text-sm sm:text-base cursor-not-allowed rounded-md font-medium ${toggleTheme ? 'text-[#b1b1b1] bg-[#202020]' : 'text-[#5b5b5b] bg-[#f0f0f0]'}`}>Ride full</button>
                    )}

                </div>

              </div>

              <div className={`mt-10 h-auto max-w-4xl rounded-xl w-full ${toggleTheme ? 'border border-[#202020]' : 'border'}`}>
                <div className={`h-fit ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} px-6 py-4 sm:p-6 flex sm:flex-row flex-col-reverse gap-2 sm:gap-0 sm:justify-between sm:items-start w-full rounded-t-xl`}>

                  <div className='flex gap-3 items-center'>
                    <div className='flex flex-col items-center gap-0.5'>
                      <div className={`${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'} rounded-full w-2.5 h-2.5`}></div>
                      <div className={`${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'} w-[1px] h-8 mr-[1px]`}></div>
                      <div className={`${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'} rounded-full w-2.5 h-2.5`}></div>
                    </div>

                    <div className='flex text-sm font-medium flex-col gap-6'>
                      <h1>{ride.rideDetails.pickupLocation.pickupName}</h1>
                      <h1>{ride.rideDetails.dropoffLocation.dropoffName}</h1>
                    </div>
                  </div>

                  <div className={`py-1.5 px-2.5 w-fit rounded-full ${toggleTheme ? 'bg-[#0d0d0d] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} text-sm flex items-center gap-1.5`}><Car size={20} /> {ride.rideDetails.vehicle}</div>

                </div>

                <div className='flex px-6 py-7 sm:flex-row flex-col sm:justify-between gap-2'>
                  <div className='flex gap-2'>
                    <img className='w-12 h-12 rounded-full' src={ride.additionalInfo.photo === "" ? '/Images/user(1).png' : ride.additionalInfo.photo} />

                    <h1 className='text-base sm:text-lg font-medium'>{ride.driverName} <p className={`text-xs sm:text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Gender: {ride.preferences.gender.charAt(0).toUpperCase() + ride.preferences.gender.slice(1)} {ride.userId != user?._id ? `- ${driversTime[ride.userId] ? `ETA: ${driversTime[ride.userId]}` : 'Driver is offline'}` : ''}</p>
                      <p className='flex sm:hidden mt-1 items-center gap-1 text-sm font-medium'>{ride.driver_rating} <Star fill={toggleTheme ? '#fefefe' : '#202020'} size={16} color={toggleTheme ? '#fefefe' : '#202020'} /></p>
                    </h1>

                  </div>

                  <h1 className='sm:flex items-center gap-1 hidden text-sm font-medium'>{ride.driver_rating} <Star fill={toggleTheme ? '#fefefe' : '#202020'} size={16} color={toggleTheme ? '#fefefe' : '#202020'} /></h1>
                </div>

              </div>

              <div className={`mt-10 flex flex-wrap w-full gap-x-8 gap-y-6 items-center ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>

                <h1 className='text-xs font-medium'>
                  Total seats
                  <p className={`mt-2 text-base sm:text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{ride.rideDetails.seats}</p>
                </h1>

                <div className={`w-[1px] h-6 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#d0d0d0]'}`}></div>

                <h1 className='text-xs font-medium'>
                  Booked seats
                  <p className={`mt-2 text-base sm:text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{ride.rideDetails.bookedSeats}</p>
                </h1>

                <div className={`w-[1px] h-6 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#d0d0d0]'}`}></div>

                <h1 className='text-xs font-medium'>
                  Distance
                  <p className={`mt-2 text-base sm:text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{Math.round(ride.rideDetails.distance)}km</p>
                </h1>

                <div className={`w-[1px] h-6 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#d0d0d0]'}`}></div>

                <h1 className='text-xs font-medium'>
                  Duration
                  <p className={`mt-2 text-base sm:text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{Math.round(ride.rideDetails.duration)}mins</p>
                </h1>

                <div className={`w-[1px] h-6 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#d0d0d0]'}`}></div>

                <h1 className='text-xs font-medium'>
                  Ride type
                  <p className={`mt-2 text-base sm:text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{ride.preferences.rideType === "" ? 'No type' : ride.preferences.rideType}</p>
                </h1>

              </div>

              <div className='mt-12 max-w-4xl w-full flex sm:flex-row sm:justify-between sm:items-center flex-col gap-y-6'>

                <div className='flex font-medium items-center sm:items-start sm:flex-col gap-2.5 sm:gap-1'>
                  <div className='p-2 rounded-full w-fit bg-[#FFD700]'><Luggage size={25} color='#fefefe' /></div>
                  {ride.preferences.ridePreferences.luggageAllowed ? 'Luggage allowed' : 'Luggage not allowed'}
                </div>

                <div className='flex font-medium items-center sm:items-start sm:flex-col gap-2.5 sm:gap-1'>
                  <div className='p-2 rounded-full w-fit bg-[#46C5FF]'><PawPrint size={25} color='#fefefe' /></div>
                  {ride.preferences.ridePreferences.petAllowed ? 'Pet allowed' : 'Pet not allowed'}
                </div>

                <div className='flex font-medium items-center sm:items-start sm:flex-col gap-2.5 sm:gap-1'>
                  <div className='p-2 rounded-full w-fit bg-[#2E2E2E]'><FaSmoking size={25} color='#fefefe' /> </div>
                  {ride.preferences.ridePreferences.smokingAllowed ? 'Smoking allowed' : 'Smoking not allowed'}
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </div >
    </>
  )
}

export default RideDetail
