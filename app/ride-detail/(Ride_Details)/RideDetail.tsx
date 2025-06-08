import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Params } from 'next/dist/server/request/params'
import { ReadonlyURLSearchParams } from 'next/navigation'
import socket from '@/utils/socket'
import { useInView } from "react-intersection-observer";
import Messages from './Messages'
import { Car, ChevronLeft, Coins, Dot, Luggage, MessageCircle, Star, PawPrint, Clock, AlertCircle, MapIcon, AlertTriangle, Sparkles, Heart, HeartCrack, LocateFixed, Users, Calendar, Navigation, Key } from 'lucide-react'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { trackRideTime } from '@/functions/function'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LocalMap from './Map'
import { fetchEta } from '@/functions/function'
import { useRide } from '@/context/states'
import RideInformation from './RideInformation'

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
  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    if (queries.get("isCheaper") === "true") setIsBest(true)
    if (!ride) return

    const fetchDriverData = async () => {
      let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-user?id=${ride.userId}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/join-ride`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/cancel-ride`, {
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
        setMessage("Your ride has been cancelled. If something went wrong, we're here to make it better. Veloride is built to move you smarter, safer, and together. Ready when you are. We'll be here.")
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

      //for disconnecting from ride socket room
      socket.emit('disconnect-from-ride', { rideId: ride._id })
    })

    socket.on('passenger-dropped-off', ({ ride, notification, passengerId, rideId }: { ride: any, notification: any, passengerId: string, rideId: string }) => {
      if (passengerId === user?._id && rideId === ride._id) {
        setPassengerStatus('dropped')
        setRide(ride)

        //for disconnecting from ride socket room
        socket.emit('disconnect-from-ride', { rideId: ride._id })
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
      {/* Map component */}
      {ride && !isDeclined && <LocalMap ride={ride} isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />}

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
              <h1 className='text-sm text-start'>{message}</h1>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* //messages component */}
      {driver && <Messages chat_id={`${user?._id}_${driver._id}`} ride={ride} openChat={openChat} setOpenChat={setOpenChat} receiver={driver} />}

      <div className={`inter min-h-screen w-full flex flex-col relative ${toggleTheme ? 'text-[#fefefe] bg-black' : 'text-[#202020] bg-[#f9f9f9]'}`}>
        {/* Header with fixed position */}
        <header className={`fixed top-0 left-0 right-0 z-30 backdrop-blur-md ${toggleTheme ? 'bg-black/80 border-b border-[#222]' : 'bg-white/80 shadow-sm'}`}>
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                className={`p-2 rounded-full ${toggleTheme ? 'bg-[#151515] hover:bg-[#202020]' : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'} transition-colors`}
                onClick={() => window.history.back()}
              >
                <ChevronLeft size={20} />
              </button>
              <h1 className="text-lg font-bold">Ride Details</h1>
            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => setOpenChat(true)}
                className={`p-2 cursor-pointer rounded-full ${toggleTheme ? 'bg-[#151515] hover:bg-[#202020]' : 'bg-[#f0f0f0] hover:bg-[#e5e5e5]'} transition-colors`}
                type="button"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Status notifications */}
        <div className={`fixed left-1/2 -translate-x-1/2 top-20 z-20 flex flex-col items-center gap-1.5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} w-fit max-w-[90%] md:max-w-[80%] lg:max-w-[70%]`}>
          {isDeclined && (
            <div className={`p-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} backdrop-blur-md shadow-lg border ${toggleTheme ? 'border-red-800/30' : 'border-red-200'}`}>
              <h1 className={`text-lg text-red-500 font-bold text-center`}>Driver has declined your ride request</h1>
              <p className={`text-sm text-center ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                <button
                  onClick={() => setSeeReason(true)}
                  className="underline hover:text-red-400 transition-colors"
                >
                  View reason
                </button>
              </p>
            </div>
          )}

          {!isDeclined && passengerStatus === 'dropped' ? (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} shadow-lg backdrop-blur-md border ${toggleTheme ? 'border-[#252525]' : 'border-[#e0e0e0]'} w-fit`}>
              <AlertCircle size={18} className="text-[#01B580] rounded-full animate-pulse" />
              <span className="text-sm font-medium">Please pay for the ride</span>
            </div>
          ) : !isDeclined && ((timeLeft.status === 'started' && ride.status === 'waiting') || ride.status === 'ready') ? (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} shadow-lg backdrop-blur-md border ${toggleTheme ? 'border-[#252525]' : 'border-[#e0e0e0]'} w-fit`}>
              <AlertCircle size={18} className="text-[#01B580] rounded-full animate-pulse" />
              <span className="text-sm font-medium">Waiting for driver to start ride</span>
            </div>
          ) : ride.status === 'started' ? (
            <div className={`flex gap-2 items-center px-4 py-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} shadow-lg backdrop-blur-md border ${toggleTheme ? 'border-[#252525]' : 'border-[#e0e0e0]'} w-fit`}>
              <AlertCircle size={18} className="text-[#01B580] rounded-full animate-pulse" />
              <span className="text-sm font-medium">Driver is on the way, please wait</span>
            </div>
          ) : ride.status === 'cancelled' ? (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} shadow-lg backdrop-blur-md border ${toggleTheme ? 'border-red-800/30' : 'border-red-200'} w-fit`}>
              <AlertTriangle size={18} className="text-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Ride has been cancelled by driver</span>
            </div>
          ) : !isDeclined && (
            <div className={`flex flex-col px-4 py-3 rounded-xl ${toggleTheme ? 'bg-[#151515]/90' : 'bg-white/90'} shadow-lg backdrop-blur-md border ${toggleTheme ? 'border-[#252525]' : 'border-[#e0e0e0]'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-[#00563c]" />
                <span className="text-sm font-medium">Time until ride starts</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {timeLeft.hours > 0 && (
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] opacity-70">hours</span>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] opacity-70">mins</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-[#00563c] to-[#01B580] bg-clip-text text-transparent">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] opacity-70">secs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 pt-20 pb-8">
          <div className="container mx-auto px-4 mt-14 md:mt-6">
            {/* Map preview */}
            {((ride?.passengers?.length > 0 && ride?.passengers?.find((passenger: any) => passenger.userId === user?._id)?.status !== 'dropped') || (ride.status !== 'cancelled' && ride.status !== 'completed')) && <div className={`h-[200px] sm:h-[250px] w-full rounded-2xl overflow-hidden relative mb-6 ${toggleTheme ? 'border border-[#202020]' : 'shadow-md'}`}>
              <img
                src={image || ride.rideD}
                alt="Route map"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${toggleTheme ? 'bg-black/20' : 'bg-white/5'}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg">
                        <Navigation size={18} className="text-[#00563c]" />
                      </div>
                      <div>
                        <p className="text-xs text-white/80">Total distance</p>
                        <p className="text-sm font-semibold text-white">{Math.round(ride.rideDetails.distance)} km</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsMapOpen(true)}
                      className="bg-white/90 cursor-pointer text-black hover:bg-white backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                      type="button"
                      aria-label="View map"
                    >
                      <MapIcon size={14} className="text-[#00563c]" />
                      <span className="text-xs font-medium inline-block">View map</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>}

            {/* Render RideInformation component */}
            <RideInformation
              ride={ride}
              isDeclined={isDeclined}
              open={open}
              setOpen={setOpen}
              passengerStatus={passengerStatus}
              paying={paying}
              setBookedSeats={setBookedSeats}
              setSeeReason={setSeeReason}
              formattedDate={formattedDate}
              hasBooked={hasBooked}
              joinRide={joinRide}
              cancelRide={cancelRide}
              bookedSeats={bookedSeats}
              toggleTheme={toggleTheme}
              driversTime={driversTime}
              user={user}
              setOpenChat={setOpenChat}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default RideDetail
