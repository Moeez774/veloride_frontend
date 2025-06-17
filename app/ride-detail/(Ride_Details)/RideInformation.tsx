import React, { Dispatch, SetStateAction, useState } from 'react';
import { Car, Luggage, MessageCircle, Star, PawPrint, Clock, MapIcon, Users, Navigation, Calendar, Coins } from 'lucide-react';
import { FaSmoking } from 'react-icons/fa';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import Loader from '@/components/Loader';

interface RideInformationProps {
    ride: any;
    joinRide: () => Promise<void>;
    toggleTheme: boolean;
    driversTime: any;
    formattedDate: string;
    hasBooked: boolean;
    bookedSeats: number;
    setBookedSeats: Dispatch<SetStateAction<number>>;
    open: boolean;
    paying: number;
    cancelRide: () => Promise<void>;
    setOpen: Dispatch<SetStateAction<boolean>>;
    isDeclined: boolean;
    setSeeReason: Dispatch<SetStateAction<boolean>>;
    passengerStatus: string;
    user: any;
    setOpenChat: (value: boolean) => void;
}

const RideInformation: React.FC<RideInformationProps> = ({
    ride,
    toggleTheme,
    setBookedSeats,
    hasBooked,
    open,
    setOpen,
    joinRide,
    cancelRide,
    bookedSeats,
    isDeclined,
    setSeeReason,
    paying,
    driversTime,
    passengerStatus,
    user,
    formattedDate,
    setOpenChat
}) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [issue, setIssue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [statusCode, setStatusCode] = useState(0)
    const [description, setDescription] = useState('')

    const issues = [
        'Driver is taking too long',
        'Driver is not moving',
        'Driver asked to cancel ride',
        'Changed my mind',
        'Wrong pickup location',
        'Wrong dropoff location',
        'Ride price is too high',
        'I feel unsafe',
        'App issue or drug',
        'Other'
    ]

    const handleReportIssue = async () => {
        if (issue === '') {
            alert('Please select an issue')
            return
        }
        setIsLoading(true)
        setMessage('')
        setStatusCode(0)
        setShowMessage(false)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes/report`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    issueType: issue,
                    description: description.length > 0 ? description : "No description",
                    reportAgainstId: "No one",
                    reportById: user?._id,
                    rideId: ride._id,
                    from: "passenger",
                    against: "No one",
                    file: "nothing"
                })
            })

            const data = await response.json()
            if (data.statusCode === 200) {
                setOpen(false)
                await cancelRide()
            }
            setMessage(data.message)
            setStatusCode(data.statusCode)
            setShowMessage(true)
            setOpenDialog(false)
        } catch (error: any) {
            setMessage(error)
            setStatusCode(500)
            setShowMessage(true)
        }
    }
    return (
        <>
            {isLoading && <Loader setLoader={setIsLoading} setShowMessage={setShowMessage} message={message} statusCode={statusCode} showMessage={showMessage} />}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className={`inter text-start ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                    <DialogHeader>
                        <DialogTitle>Tell the issue behind cancelling the ride</DialogTitle>

                        <div className='mt-4'>

                            <div>
                                <Select value={issue} onValueChange={setIssue}>
                                    <SelectTrigger className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe] border border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'} w-[250px]`}>
                                        <SelectValue placeholder="Select issue" />
                                    </SelectTrigger>
                                    <SelectContent className={`max-h-[200px] overflow-y-auto ${toggleTheme ? 'bg-[#202020] text-[#fefefe] border border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'}`}>
                                        {issues.map((issue, index) => (
                                            <SelectItem key={index} value={issue}>{issue}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* //Description of issue */}
                            <div className='mt-4'>
                                <label htmlFor="description" className={`text-sm mb-2 text-start ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Description</label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter description' className={`resize-none h-[100px] ${toggleTheme ? 'bg-[#202020] text-[#fefefe] border border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'}`} />
                            </div>

                        </div>
                    </DialogHeader>
                    <DialogFooter className='flex mt-6 justify-between'>
                        <button onClick={() => setOpenDialog(false)} className={`px-8 text-sm transition-all duration-200 py-2.5 ${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] text-[#fefefe] border border-[#353535]' : 'bg-[#fefefe] hover:bg-[#f0f0f0] text-[#202020] border'} cursor-pointer rounded-md font-medium`}>Back</button>
                        <button className='px-8 text-sm transition-all duration-200 py-2.5 bg-[#00563c] text-[#fefefe] hover:bg-[#00563ccc] active:bg-[#00563c] cursor-pointer rounded-md font-medium' onClick={handleReportIssue} disabled={isLoading}>Cancel ride</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Ride header and pricing */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-6">
                <div className="max-w-full md:max-w-[70%]">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f0f0f0]'}`}>
                            <Car size={20} className={`${toggleTheme ? 'text-[#00563c]' : 'text-[#00563c]'}`} />
                        </div>
                        <h1 className="text-2xl font-bold truncate">Ride-{ride._id.slice(-5)}</h1>
                    </div>

                    {(ride.status === 'waiting' || ride.status === 'ready') && <div className="flex items-center gap-2 mt-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f0f0f0]'}`}>
                            <Calendar size={16} className="opacity-70" />
                        </div>
                        <p className={`text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                            {formattedDate} · {ride.rideDetails.time}
                        </p>
                    </div> }

                    <div className={`mt-4 flex items-center gap-2`}>
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f0f0f0]'}`}>
                            <Coins size={18} className={`${toggleTheme ? 'text-[#00563c]' : 'text-[#00563c]'}`} />
                        </div>
                        <div className="max-w-full">
                            {ride?.passengers?.length > 0 && ride?.passengers?.find((passenger: any) => passenger.userId === user?._id)?.status === 'dropped' ? (
                                <p className="text-green-500 font-medium">Your total fare: Rs.{Math.round(paying)}</p>
                            ) :
                            ride.status === 'expired' ? (
                                <p className="text-red-500 font-medium">Ride expired</p>
                            ) : ride.status === 'cancelled' ? (
                                <p className="text-red-500 font-medium">Ride cancelled</p>
                            ) : ride.status === 'completed' ? (
                                <p className="text-green-500 font-medium">Ride completed</p>
                            ) : hasBooked ? (
                                <div>
                                    <p className="font-medium">
                                        Your fare: Rs.{Math.round(paying)} per seat
                                    </p>
                                    <p className="text-xs opacity-70 truncate">
                                        ({bookedSeats} {bookedSeats === 1 ? 'seat' : 'seats'})
                                        {ride.rideDetails.bookedSeats < ride.rideDetails.seats ?
                                            ` · Current fare: Rs.${Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}` : ''}
                                    </p>
                                </div>
                            ) : !hasBooked && ride.rideDetails.bookedSeats < ride.rideDetails.seats ? (
                                <p className="font-medium">Current fare: Rs.{Math.round(ride.budget.totalBudget / (ride.rideDetails.bookedSeats + 1.5))}</p>
                            ) : (
                                <p className="text-amber-500 font-medium">Ride full</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto flex justify-center md:justify-end">
                    {ride.status === 'cancelled' ? (
                        <button></button>)
                        : isDeclined ? (
                            <button
                                onClick={() => setSeeReason(true)}
                                className={`w-full md:w-auto px-6 py-3 rounded-md font-medium ${toggleTheme ?
                                    'bg-[#151515] hover:bg-[#202020] text-white' :
                                    'bg-[#f0f0f0] hover:bg-[#e5e5e5] text-[#5b5b5b]'} transition-colors`}
                            >
                                See reason
                            </button>
                        ) : passengerStatus === 'dropped' ? (
                            <Link href={`/checkout?rideId=${ride._id}&amount=${Math.round(paying)}&by=${user?._id}&to=${ride.userId}`}>
                                <button className="w-full cursor-pointer md:w-auto px-6 py-3 rounded-md font-medium bg-[#00563c] hover:bg-[#00563c]/90 text-white transition-colors">
                                    Pay now
                                </button>
                            </Link>
                        ) : !hasBooked && ride.rideDetails.bookedSeats < ride.rideDetails.seats ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger
                                    onClick={() => setOpen(true)}
                                    className="w-full md:w-auto px-6 py-3 rounded-md font-medium bg-[#00563c] hover:bg-[#00563c]/90 text-white transition-colors"
                                >
                                    Join Ride
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
                            <button
                                onClick={() => setOpenDialog(true)}
                                className={`w-full md:w-auto cursor-pointer px-6 py-3 rounded-xl font-medium ${toggleTheme ?
                                    'bg-[#151515] hover:bg-[#202020] text-white' :
                                    'bg-[#f0f0f0] hover:bg-[#e5e5e5] text-[#5b5b5b]'} transition-colors`}
                            >
                                Cancel ride
                            </button>
                        ) : ride.status === 'started' ? (
                            <button
                                disabled
                                className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium cursor-not-allowed ${toggleTheme ?
                                    'bg-[#151515] text-[#b1b1b1]' :
                                    'bg-[#f0f0f0] text-[#5b5b5b]'}`}
                            >
                                Ride in progress
                            </button>
                        ) : (
                            <button
                                disabled
                                className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium cursor-not-allowed ${toggleTheme ?
                                    'bg-[#151515] text-[#b1b1b1]' :
                                    'bg-[#f0f0f0] text-[#5b5b5b]'}`}
                            >
                                Ride full
                            </button>
                        )}
                </div>
            </div>

            {/* Journey details card */}
            <div className={`rounded-2xl overflow-hidden ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'} mb-6`}>
                <div className={`p-5 ${toggleTheme ? 'border-b border-[#202020]' : 'border-b border-gray-100'}`}>
                    <h2 className="font-bold">Journey Details</h2>
                </div>

                <div className="p-5">
                    <div className="flex items-stretch">
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${toggleTheme ? 'bg-[#00563c]' : 'bg-[#00563c]'}`}></div>
                            <div className={`w-[2px] h-full my-1 ${toggleTheme ? 'bg-[#303030]' : 'bg-gray-200'}`}></div>
                            <div className={`w-3 h-3 rounded-full ${toggleTheme ? 'bg-red-500' : 'bg-red-500'}`}></div>
                        </div>

                        <div className="ml-4 flex-1">
                            <div className="mb-6">
                                <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Pickup location</p>
                                <p className="font-medium mt-1">{ride.rideDetails.pickupLocation.pickupName}</p>
                            </div>

                            <div>
                                <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Dropoff location</p>
                                <p className="font-medium mt-1">{ride.rideDetails.dropoffLocation.dropoffName}</p>
                            </div>
                        </div>

                        <div className="ml-4 hidden sm:flex items-center">
                            <div className={`py-2 px-3 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'} flex items-center gap-2`}>
                                <Car size={18} />
                                <span className="text-sm font-medium">{ride.rideDetails.vehicle}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 sm:hidden">
                        <div className={`py-2 px-3 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'} inline-flex items-center gap-2`}>
                            <Car size={18} />
                            <span className="text-sm font-medium">{ride.rideDetails.vehicle}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver info card */}
            <div className={`rounded-2xl overflow-hidden ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'} mb-6`}>
                <div className={`p-5 ${toggleTheme ? 'border-b border-[#202020]' : 'border-b border-gray-100'}`}>
                    <h2 className="font-bold">Driver Information</h2>
                </div>

                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#00563c]"
                        src={ride.additionalInfo.photo === "" ? '/Images/user(1).png' : ride.additionalInfo.photo}
                        alt={ride.driverName}
                    />

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg truncate">{ride.driverName}</h3>
                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <Star fill={toggleTheme ? '#FFD700' : '#FFD700'} size={16} color={toggleTheme ? '#FFD700' : '#FFD700'} />
                                <span className="font-medium">{ride.driver_rating}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-y-1 gap-x-1">
                            <p className={`text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                Gender: {ride.preferences.gender.charAt(0).toUpperCase() + ride.preferences.gender.slice(1)} -
                            </p>

                            {ride.userId != user?._id && (
                                <p className={`text-sm ${driversTime[ride.userId] ? 'text-[#00563c]' : 'text-red-500'}`}>
                                    {driversTime[ride.userId] ? `ETA: ${driversTime[ride.userId]}` : 'Driver is offline'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                        <button
                            onClick={() => setOpenChat(true)}
                            className={`p-3 cursor-pointer rounded-xl ${toggleTheme ? 'bg-[#151515] hover:bg-[#202020]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'} transition-colors`}
                            type="button"
                            aria-label="Message driver"
                        >
                            <MessageCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Ride metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'}`}>
                            <Users size={16} className="opacity-70" />
                        </div>
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Total seats</p>
                    </div>
                    <p className="text-xl font-bold">{ride.rideDetails.seats}</p>
                </div>

                <div className={`p-4 rounded-xl ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'}`}>
                            <Users size={16} className="opacity-70" />
                        </div>
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Booked seats</p>
                    </div>
                    <p className="text-xl font-bold">{ride.rideDetails.bookedSeats}</p>
                </div>

                <div className={`p-4 rounded-xl ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'}`}>
                            <Navigation size={16} className="opacity-70" />
                        </div>
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Distance</p>
                    </div>
                    <p className="text-xl font-bold">{Math.round(ride.rideDetails.distance)} km</p>
                </div>

                <div className={`p-4 rounded-xl ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'}`}>
                            <Clock size={16} className="opacity-70" />
                        </div>
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Duration</p>
                    </div>
                    <p className="text-xl font-bold">{Math.round(ride.rideDetails.duration)} mins</p>
                </div>

                <div className={`p-4 rounded-xl ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${toggleTheme ? 'bg-[#151515]' : 'bg-[#f5f5f5]'}`}>
                            <Car size={16} className="opacity-70" />
                        </div>
                        <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Ride type</p>
                    </div>
                    <p className="text-xl font-bold">{ride.preferences.rideType === "" ? 'Standard' : ride.preferences.rideType}</p>
                </div>
            </div>

            {/* Ride preferences */}
            <div className={`rounded-2xl overflow-hidden ${toggleTheme ? 'bg-[#121212] border border-[#202020]' : 'bg-white shadow-md'} mb-6`}>
                <div className={`p-5 ${toggleTheme ? 'border-b border-[#202020]' : 'border-b border-gray-100'}`}>
                    <h2 className="font-bold">Ride Preferences</h2>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#FFD700]">
                            <Luggage size={20} color="#FFFFFF" />
                        </div>
                        <div>
                            <p className="font-medium">
                                {ride.preferences.ridePreferences.luggageAllowed ? 'Luggage allowed' : 'No luggage'}
                            </p>
                            <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                Bring your baggage
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#46C5FF]">
                            <PawPrint size={20} color="#FFFFFF" />
                        </div>
                        <div>
                            <p className="font-medium">
                                {ride.preferences.ridePreferences.petAllowed ? 'Pets allowed' : 'No pets'}
                            </p>
                            <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                Pet-friendly ride
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#2E2E2E]">
                            <FaSmoking size={20} color="#FFFFFF" />
                        </div>
                        <div>
                            <p className="font-medium">
                                {ride.preferences.ridePreferences.smokingAllowed ? 'Smoking allowed' : 'No smoking'}
                            </p>
                            <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                Smoking policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RideInformation;