'use client'
import { getContacts } from '@/context/ContactsProvider'
import React, { useEffect, useRef, useState } from 'react'
import { Car, XCircle, Navigation, ChevronLeft, X, PlayCircle, CheckCircle, AlertCircle, } from 'lucide-react'
import socket from '@/utils/socket'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { usePathname, useRouter } from 'next/navigation'
import VerifyPax from '../(Rides)/Owned_Rides/VerifyPax'
import { TargetIcon } from '@radix-ui/react-icons'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useAuth } from '@/context/AuthProvider'
import { MapPinIcon } from '@heroicons/react/16/solid'
import Map from '../(Rides)/Map'
import Messages from '@/app/ride-detail/(Ride_Details)/Messages'
import { declinePassenger, markPassengerDroppedOff } from '@/functions/ridesFunctions'
import { useRide } from '@/context/states'
import SearchRides from '../(Rides)/Owned_Rides/SearchRides'
import RideInfo from './components/RideInfo'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const ManageRides = () => {

    const context = getContacts()
    const sideBarRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<any>(null)
    const pathname = usePathname()
    const authContext = useAuth()
    const [hasStarted, setHasStarted] = useState(false)
    const [message, setMessage] = useState('')
    const [subline, setSubline] = useState('')
    const [openDeclineDialog, setOpenDeclineDialog] = useState(false)
    const [activeRides, setActiveRides] = useState([])
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; status: string }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: 'upcoming'
    })
    const [selectedRide, setSelectedRide] = useState<any>(null)
    const [payingByYou, setPayingByYou] = useState(0)
    const [declineMessage, setDeclineMessage] = useState('')
    const [passengers, setPassengers] = useState<any>({})
    const [open, setOpen] = useState(false)
    const { setNotifications } = useRide()
    const [passengerForChat, setPassengerForChat] = useState<any>(null)
    const user = authContext?.user || null
    const [isStarted, setIsStarted] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const router = useRouter()
    const location = authContext?.userLocation || null
    const toggleTheme = context?.toggleTheme || false
    const [openChat, setOpenChat] = useState(false)
    const [remainingDistances, setRemainingDistances] = useState<Record<string, string>>({})
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        if (pathname === '/dashboard/manage-rides') {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [pathname])

    //handlign outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node) && !menuRef.current?.contains(event.target as Node)) {
                setOpenMenu(false)
            }
        }

        window.addEventListener('click', handleOutsideClick)

        return () => {
            window.removeEventListener('click', handleOutsideClick)
        }
    }, [])

    //fetching all active rides
    useEffect(() => {
        if (!user) return;
        const fetchActiveRides = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/active-rides?userId=${user._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json()
                setActiveRides(data.data)
                setSelectedRide(data.data[0])
            } catch (err) {
                console.log(err)
            }
        }
        fetchActiveRides()
    }, [user])

    // Function to calculate remaining distance
    const calculateRemainingDistance = async (ride: any) => {
        if (!location || !ride.rideDetails.dropoffLocation.coordinates) return;

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location[0]},${location[1]};${ride.rideDetails.dropoffLocation.coordinates[0]},${ride.rideDetails.dropoffLocation.coordinates[1]}?access_token=${accessToken}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.code === 'Ok') {
                const route = data.routes[0];
                const distance = (route.distance / 1000).toFixed(2);
                setRemainingDistances(prev => ({
                    ...prev,
                    [ride._id]: distance
                }));
            }
        } catch (error) {
            console.error('Error calculating distance:', error);
        }
    };

    // Update distances for started rides
    useEffect(() => {
        if (!location || !activeRides) return;

        const inProgressRides = activeRides.filter((ride: any) => ride.status === 'started');
        inProgressRides.forEach((ride: any) => {
            calculateRemainingDistance(ride);
        });
    }, [location, activeRides])

    useEffect(() => {
        if (!selectedRide) return;
        const payingByYou = (() => {
            const currentFare = selectedRide.budget.totalBudget / (selectedRide.rideDetails.bookedSeats + 0.5);
            const overallFare = currentFare * selectedRide.rideDetails.bookedSeats
            return selectedRide.budget.totalBudget - overallFare;
        })()
        setPayingByYou(Math.round(payingByYou))
    }, [selectedRide])

    useEffect(() => {
        if (!selectedRide) return;
        socket.emit('join-passengers', selectedRide._id)

        socket.on('ride-joined', ({ ride, notificationForDriver }) => {
            setSelectedRide(ride)
            setActiveRides((prevRides: any) => prevRides.map((r: any) => r._id === selectedRide._id ? ride : r))
            setNotifications(prev => [notificationForDriver, ...prev])
        })

        socket.on('ride-cancelled', ({ ride, notification }) => {
            setSelectedRide(ride)
            setActiveRides((prevRides: any) => prevRides.map((r: any) => r._id === selectedRide._id ? ride : r))
            if (ride.userId === user?._id) {
                setNotifications(prev => [notification, ...prev])
            }
        })

        socket.on('provide-location', ({ location, rideId, userId }) => {
            setPassengers((prev: any) => ({
                ...prev,
                [rideId]: {
                    ...(prev[rideId] || {}),
                    [userId]: location
                }
            }));
        });

        //for changing locations of passengers on passenger movement
        socket.on('passengerMoved', ({ userId, location }) => {
            setPassengers((prev: any) => {
                const updatedPassengers = { ...prev };
                Object.keys(updatedPassengers).forEach((rideId) => {
                    if (updatedPassengers[rideId][userId]) {
                        updatedPassengers[rideId][userId] = location;
                    }
                })
                return updatedPassengers;
            })
        })

        socket.on('ride-updated', ({ ride, rideId }) => {
            setActiveRides((prevRides: any) => prevRides.map((rideData: any) => rideData._id === rideId ? ride : rideData))
            if (rideId === selectedRide._id) {
                setSelectedRide(ride)
            }
        })

        socket.on('passenger-dropped-off', ({ rideId, passengerId, ride }) => {
            setActiveRides((prevRides: any) => prevRides.map((rideData: any) => rideData._id === rideId ? ride : rideData))
            if (rideId === selectedRide._id) {
                setSelectedRide(ride)
            }
        })

        return () => {
            socket.off('provide-location')
            socket.off('join-passengers')
            socket.off('join-ride')
            socket.off('passenger-dropped-off')
            socket.off('ride-joined')
            socket.off('ride-cancelled')
            socket.off('ride-updated')
        }
    }, [selectedRide])

    //checking ride's status
    useEffect(() => {
        if (!activeRides) return;

        const now = new Date().getTime();
        const updatePromises: Promise<any>[] = [];

        activeRides.forEach((ride: any) => {
            const date = new Date(ride.rideDetails.date)

            const [time, meridian] = ride.rideDetails.time.split(' ')
            let [hours, minutes] = time.split(':').map(Number)

            if (meridian === 'PM' && hours !== 12) hours += 12;
            if (meridian === 'AM' && hours === 12) hours = 0;

            // Set time on the date
            date.setHours(hours, minutes, 0, 0);

            const rideTime = date.getTime();
            const expiryTime = rideTime + 86400000

            let newStatus = null;

            if (now > expiryTime && (ride.status === 'waiting' || ride.status === 'ready')) {
                newStatus = 'expired';
            } else if (now > rideTime && now <= expiryTime && ride.status === 'waiting') {
                newStatus = 'ready';
            }

            if (newStatus) {
                setActiveRides((prevRides: any) =>
                    prevRides.map((prevRide: any) =>
                        prevRide._id === ride._id ? { ...prevRide, status: newStatus } : prevRide
                    )
                );

                if (selectedRide._id === ride._id) {
                    setSelectedRide((prevRide: any) => ({ ...prevRide, status: newStatus }))
                }

                const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/update-ride-status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rideId: ride._id, status: newStatus || ride.status }),
                });

                updatePromises.push(promise);
            }
        });

        if (updatePromises.length > 0) {
            Promise.all(updatePromises)
                .then(() => console.log("Statuses updated"))
                .catch((err) => console.error("Update error", err));
        }
    }, [activeRides])

    const startRide = async (rideId: string, status: string) => {
        setHasStarted(true)

        if (status === 'started' || status === 'completed') {
            setIsStarted(true)
        }

        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/update-ride`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rideId: rideId, status: status })
            })

            const data = await response.json()

            setMessage(data.message)
            setSubline(data.subline)
            setActiveRides((prevRides: any) => prevRides.map((ride: any) => ride._id === rideId ? data.data : ride))
            setSelectedRide(data.data)
            socket.emit('ride-updated', { ride: data.data, rideId: rideId })
            socket.emit('ride-updated-by-driver', { ride: data.data, rideId: rideId, notificationsForPassengers: data.notificationsForPassengers })
        } catch (err) {
            console.log(err)
        } finally {
            setHasStarted(false)
        }
    }


    useEffect(() => {
        if (!selectedRide || selectedRide.status !== "waiting") return;

        const getRideTime = () => {
            const rideDate = new Date(selectedRide.rideDetails.date);
            const [hours, minutes, period] = selectedRide.rideDetails.time.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);

            rideDate.setHours(
                period === "PM" ? (parseInt(hours) === 12 ? 12 : parseInt(hours) + 12)
                    : (parseInt(hours) === 12 ? 0 : parseInt(hours)),
                parseInt(minutes),
                0
            );

            return rideDate;
        };

        const interval = setInterval(() => {
            const rideTime = getRideTime();
            const now = new Date();
            const diff = rideTime.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft({
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    status: "started"
                });
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds, status: "upcoming" });
        }, 1000);

        return () => clearInterval(interval);
    }, [selectedRide])

    //for declining passenger
    const decline_passenger = async (rideId: string, passengerId: string) => {
        const updatedRide = await declinePassenger(rideId, passengerId, declineMessage)
        setSelectedRide(updatedRide.ride)
        setActiveRides((prevRides: any) => prevRides.map((ride: any) => ride._id === rideId ? updatedRide.ride : ride))
        setOpenDeclineDialog(false)
        setDeclineMessage('')
        socket.emit('passenger-declined', { rideId: rideId, passengerId: passengerId, declineMessage: declineMessage, ride: updatedRide.ride, notificationForPassenger: updatedRide.notificationForPassenger })
    }

    return (
        <>

            {/* //messages component */}
            {selectedRide && passengerForChat && <Messages chat_id={`${passengerForChat._id}_${user?._id}`} ride={selectedRide} openChat={openChat} setOpenChat={setOpenChat} receiver={passengerForChat} />}

            {open && <div className='w-screen h-screen fixed z-[100] top-0 left-0'>
                <Map selectedRide={selectedRide} setOpen={setOpen} open={open} passengers={passengers} />
            </div>}

            <div className='absolute'>
                <Dialog open={isStarted} onOpenChange={setIsStarted}>
                    <DialogTrigger></DialogTrigger>
                    <DialogContent className={`inter h-[15em] flex items-center justify-center ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#f0f0f0] text-[#202020]'} border-none`}>
                        <DialogHeader>
                            <DialogTitle></DialogTitle>
                            {hasStarted ? (
                                <div className='loader'></div>
                            ) : (
                                <div className='flex text-center items-center justify-center flex-col gap-2'>
                                    <CheckCircle size={40} className='text-[#00563c]' />
                                    <h1 className='text-2xl font-semibold'>{message}</h1>
                                    <h1 className='text-sm'>{subline}</h1>
                                </div>
                            )}
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='absolute'>
                <Dialog open={openDeclineDialog} onOpenChange={setOpenDeclineDialog}>
                    <DialogTrigger>
                    </DialogTrigger>
                    <DialogContent className={`inter ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#f0f0f0] text-[#202020]'} border-none`}>
                        <DialogHeader>
                            <DialogTitle className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Tell us why you want to decline this user request</DialogTitle>

                            <textarea rows={5} value={declineMessage} onChange={(e) => setDeclineMessage(e.target.value)} className={`w-full resize-none mt-2 p-2 outline-none rounded-md ${toggleTheme ? 'border border-[gray] text-[#fefefe]' : 'border border-[#b1b1b1] text-[#202020]'}`} placeholder='Tell us why you want to decline this user request' />
                        </DialogHeader>
                        <DialogFooter className='mt-4'>
                            <button className='bg-red-500 text-white px-6 py-2.5 font-medium hover:bg-red-400 rounded-md cursor-pointer active:bg-red-600' onClick={() => decline_passenger(selectedRide._id, passengerForChat._id)}>Decline</button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div >

            <div className={`inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} overflow-hidden w-full min-h-screen flex`}>

                <div ref={sideBarRef} className={`xl:w-1/4 ${openMenu ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'} transition-all duration-300 !z-[10] fixed w-full max-w-[400px] xl:relative h-screen overflow-y-auto px-6 py-4 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f7f7f7]'}`} style={{ scrollbarWidth: 'thin' }}>
                    <div className='flex justify-between items-center gap-2'>
                        <div className='flex items-center gap-2'>
                            <div onClick={() => {
                                router.back()
                            }} className={`p-2 cursor-pointer rounded-full ${toggleTheme ? 'bg-[#000000]' : 'bg-[#f0f0f0]'}`}>
                                <ChevronLeft size={20} />
                            </div>
                            <h1 className='text-xl font-semibold'>All Active Rides</h1>
                        </div>

                        <X className='cursor-pointer lg:hidden' onClick={() => setOpenMenu(false)} size={20} />
                    </div>

                    <SearchRides toggleTheme={toggleTheme} activeRides={activeRides} setActiveRides={setActiveRides} />

                    <div className='mt-4'>
                        {activeRides.length === 0 && (
                            <div className='flex items-center justify-center h-full'>
                                <h1 className='text-sm font-medium'>No active rides</h1>
                            </div>
                        )}
                        {activeRides.length > 0 && (
                            <Accordion type="single" collapsible>
                                {activeRides.map((ride: any, index: number) => {
                                    return (
                                        <AccordionItem className={`${toggleTheme ? 'border-b border-[#000000]' : 'border-b'}`} onClick={() => setSelectedRide(ride)} key={index} value={`item-${index}`}>
                                            <AccordionTrigger className='cursor-pointer'>

                                                <div className='flex items-center gap-2'>
                                                    {ride.status === 'waiting' ? (
                                                        <div className='p-2.5 rounded-full bg-[#2962FF]'>
                                                            <TargetIcon color='#fefefe' className='w-7 h-7' />
                                                        </div>
                                                    ) : ride.status === 'started' ? (
                                                        <div className='p-2.5 rounded-full bg-[#4CAF50]'>
                                                            <Car color='#fefefe' size={30} />
                                                        </div>
                                                    ) : ride.status === 'ready' ? (
                                                        <div className='p-2.5 rounded-full bg-[#FF7043]'>
                                                            <PlayCircle color='#fefefe' size={30} />
                                                        </div>
                                                    ) : ride.status === 'expired' ? (
                                                        <div className='p-2.5 rounded-full bg-[#ff0000]'>
                                                            <XCircle color='#fefefe' size={30} />
                                                        </div>
                                                    ) : ride.status === 'cancelled' ? (
                                                        <div className='p-2.5 rounded-full bg-[brown]'>
                                                            <AlertCircle color='#fefefe' size={30} />
                                                        </div>
                                                    ) : (
                                                        <div className='p-2.5 rounded-full bg-[green]'>
                                                            <Car color='#fefefe' size={30} />
                                                        </div>
                                                    )}

                                                    <div className='flex flex-col gap-1.5'>
                                                        <h1 className='text-base font-medium'>{ride.status === 'waiting' ? (
                                                            (() => {
                                                                const rideDate = new Date(ride.rideDetails.date);
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0);
                                                                rideDate.setHours(0, 0, 0, 0);

                                                                if (rideDate.getTime() === today.getTime()) {
                                                                    return `Starting at ${ride.rideDetails.time}`;
                                                                } else if (rideDate.getTime() > today.getTime()) {
                                                                    return `Starting on ${rideDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
                                                                } else {
                                                                    return `Completed on ${rideDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
                                                                }
                                                            })()
                                                        ) : ride.status === 'started' ? (
                                                            remainingDistances[ride._id] ?
                                                                `${remainingDistances[ride._id]}km away from Dest` :
                                                                'Current ride'
                                                        ) : ride.status === 'ready' ? (
                                                            'Ride is ready to start'
                                                        ) : ride.status === 'expired' ? (
                                                            'Ride has been expired'
                                                        ) : ride.status === 'cancelled' ? (
                                                            'Ride has been cancelled'
                                                        ) : 'Completed ride'}</h1>
                                                        <h1 className={`text-xs ${ride.status === 'waiting' ? 'text-[#2962FF]' : ride.status === 'started' ? 'text-[#4CAF50]' : ride.status === 'ready' ? 'text-[#FF7043]' : ride.status === 'expired' ? 'text-[#ff0000]' : ride.status === 'cancelled' ? 'text-[brown]' : 'text-[green]'}`}>{ride.status === 'waiting' ? 'Waiting ride' : ride.status === 'started' ? 'Active ride' : ride.status === 'ready' ? 'Ride ready' : ride.status === 'expired' ? 'Ride expired' : ride.status === 'cancelled' ? 'Ride cancelled' : 'Ride completed'}</h1>
                                                    </div>
                                                </div>

                                            </AccordionTrigger>
                                            <AccordionContent className='flex translate-x-3 gap-4 mt-2 w-full' style={{ wordBreak: 'break-word' }}>

                                                <div className='flex flex-col items-center'>
                                                    <div className={`${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#d0d0d0]'} p-1 rounded-full w-fit`}><MapPinIcon color={toggleTheme ? '#f0f0f0' : '#202020'} className='w-4 h-4' /> </div>
                                                    <div className={`${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#d0d0d0]'} h-8 w-[2px] my-1`}></div>
                                                    <div className={`${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#d0d0d0]'} p-1 rounded-full w-fit`}><Navigation size={15} color={toggleTheme ? '#f0f0f0' : '#202020'} /> </div>
                                                </div>

                                                <div className='flex-1 flex flex-col gap-5'>
                                                    <h1 className={`text-xs font-normal flex flex-col gap-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Pick up <p className={`text-[13px] font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{ride.rideDetails.pickupLocation.pickupName.split(",").slice(0, 3).join(",")}</p></h1>

                                                    <h1 className={`text-xs font-normal flex flex-col gap-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Drop off <p className={`text-[13px] font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{ride.rideDetails.dropoffLocation.dropoffName.split(",").slice(0, 3).join(",")}</p></h1>

                                                </div>

                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}

                            </Accordion>
                        )}
                    </div>
                </div>

                <RideInfo selectedRide={selectedRide} timeLeft={timeLeft} startRide={startRide} open={open} setOpen={setOpen} payingByYou={payingByYou} passengers={passengers} setOpenMenu={setOpenMenu} setOpenChat={setOpenChat} setOpenDeclineDialog={setOpenDeclineDialog} menuRef={menuRef} setPassengerForChat={setPassengerForChat} isCancelled={isCancelled} setIsCancelled={setIsCancelled}/>
            </div>

            {selectedRide && selectedRide.passengers.some((passenger: any) => passenger.status != 'dropped') && <div className={`fixed ${selectedRide && selectedRide.status === 'started' ? 'z-[10] opacity-[1] bottom-10' : '-z-[10] opacity-[0] bottom-6'} mx-auto left-0 right-[0%] flex justify-center ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} transition-all duration-300`}>
                <VerifyPax passengers={selectedRide?.passengers} ride={selectedRide} setSelectedRide={setSelectedRide} setActiveRides={setActiveRides} activeRides={activeRides} />
            </div>}
        </>
    )
}

export default ManageRides