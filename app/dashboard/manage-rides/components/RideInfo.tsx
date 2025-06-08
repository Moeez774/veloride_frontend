'use client'
import { getContacts } from '@/context/ContactsProvider'
import React, { Dispatch, RefObject, SetStateAction, useRef, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, CheckCheck, Coins, Info, Menu, PlayCircle, Wallet } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Clock, EllipsisVertical, MessageCircle, PhoneCall, XCircle } from 'lucide-react'
import Map from '../../(Rides)/Map'

const RideInfo = ({ selectedRide, timeLeft, startRide, open, setOpen, payingByYou, passengers, setPassengerForChat, setOpenChat, setOpenDeclineDialog, setOpenMenu, isCancelled, setIsCancelled, menuRef }: { selectedRide: any, timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
    status: string;
}, startRide: (rideId: string, status: string) => Promise<void>, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, payingByYou: number, passengers: any, setPassengerForChat: (pax: any) => void, setOpenChat: Dispatch<SetStateAction<boolean>>, setOpenDeclineDialog: Dispatch<SetStateAction<boolean>>, setOpenMenu: Dispatch<SetStateAction<boolean>>, isCancelled: boolean, setIsCancelled: Dispatch<SetStateAction<boolean>>, menuRef: RefObject<SVGSVGElement> }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme || null
    const [showToolTip, setShowToolTip] = useState(false)

    const completeRide = async () => {
        if(selectedRide.passengers.some((passenger: any) => passenger.status != 'dropped')) {
            alert('Please drop all passengers before completing the ride')
            return
        }
        await startRide(selectedRide._id, 'completed')
    }

    return (
        <>
            {selectedRide && <div className='flex-1 xl:max-w-5xl px-3 sm:px-6 py-4 mx-auto w-full h-screen overflow-y-auto'>

                <div className='relative w-full flex md:flex-row flex-col gap-y-4 md:items-center justify-between'>

                    {/* //last 8 words of ride._id */}
                    <div className='flex items-center gap-2'>
                        <h1 className={`text-base flex items-center gap-2 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-medium`}><Menu size={20} onClick={() => setOpenMenu(true)} className='cursor-pointer xl:hidden' ref={menuRef} /> Ride OTP: <p className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-2xl font-semibold`}>{selectedRide.otp}</p></h1>

                        <TooltipProvider>
                            <Tooltip open={showToolTip} onOpenChange={() => setShowToolTip(false)}>
                                <TooltipTrigger onMouseLeave={() => setShowToolTip(false)} onMouseEnter={() => setShowToolTip(true)} onClick={() => setShowToolTip(true)} onBlur={() => setShowToolTip(false)}><Info size={16} className='cursor-pointer' color={toggleTheme ? '#b1b1b1' : '#5b5b5b'} /></TooltipTrigger>
                                <TooltipContent className='max-w-[200px] bg-[#00563c] text-[#fefefe] text-center'>
                                    <p>Ask this OTP from the passenger before starting the ride. Enter it in the verification tab to confirm their identity and prevent fraud.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {(timeLeft.status === "upcoming" && selectedRide.status === "waiting") && <div className={`flex absolute md:relative items-center sm:mx-auto right-0 gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full ${toggleTheme ? 'text-[#fefefe] bg-[#202020]/80' : 'text-[#202020] bg-[#f0f0f0]/80'} shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border ${toggleTheme ? 'border-[#202020]' : 'border-[#e0e0e0]'} w-fit z-50 md:justify-center`}>
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
                    </div>}

                    {selectedRide.status !== 'cancelled' && selectedRide.status !== 'expired' && selectedRide.status !== 'completed' && <div className='flex items-center gap-2'>
                        {(selectedRide.status !== 'completed' && selectedRide.status !== 'expired') &&
                            <Dialog open={isCancelled} onOpenChange={setIsCancelled}>
                                <DialogTrigger className={`${toggleTheme ? 'border border-[#b1b1b1] bg-transparent hover:bg-[#202020cc]' : 'border bg-transparent hover:bg-[#f7f7f7cc]'} py-2.5 px-4 md:px-6 text-sm rounded-full cursor-pointer active:bg-transparent font-medium`} onClick={() => setIsCancelled(true)}>Cancel ride</DialogTrigger>
                                <DialogContent className={`inter ${toggleTheme ? 'text-[#fefefe] bg-[#202020]' : 'bg-[#f0f0f0] text-[#202020]'} border-none`}>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure you want to cancel this ride?</DialogTitle>
                                        <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-sm text-start`}>This action will cancel the ride and refund the passenger. You will not be able to start the ride again.</p>
                                    </DialogHeader>
                                    <DialogFooter className='flex items-center gap-2 mt-4'>
                                        <button onClick={() => setIsCancelled(false)} className={`transition-all duration-200 ${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] border border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] hover:bg-[#f0f0f0] border text-[#202020]'} py-2.5 px-4 md:px-6 text-sm rounded-md cursor-pointer active:bg-transparent font-medium`}>No</button>
                                        <button className='transition-all duration-200 bg-[#00563c] hover:bg-[#00563ccc] text-[#fefefe] py-2.5 px-4 md:px-6 text-sm rounded-md cursor-pointer active:bg-[#00563c] font-medium' onClick={async () => {
                                            setIsCancelled(false)
                                            await startRide(selectedRide._id, 'cancelled')
                                        }}>Yes</button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        }
                        {selectedRide.status === 'ready' &&
                            <button onClick={() => {
                                startRide(selectedRide._id, 'started')
                            }} className='py-2.5 px-4 md:px-6 text-sm md:text-[15px] hover:bg-[#00563ccc] cursor-pointer active:bg-[#00563c] bg-[#00563c] text-[#fefefe] rounded-full flex items-center gap-2 font-medium'>Start ride <PlayCircle size={20} />
                            </button>
                        }
                        {selectedRide.status === 'started' && !selectedRide.passengers.some((passenger: any) => passenger.status != 'dropped') && <button onClick={completeRide} className='py-2.5 px-4 md:px-6 text-sm md:text-[15px] hover:bg-[#00563ccc] cursor-pointer active:bg-[#00563c] bg-[#00563c] text-[#fefefe] rounded-full flex items-center gap-2 font-medium'>Complete ride <CheckCheck size={20} /></button>}
                    </div>}
                </div>

                <div className='w-full mt-8 md:mt-6 flex-wrap gap-y-6 gap-x-8 sm:gap-0 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='rounded-full p-3 bg-[#2196F3]'><Coins size={20} color='#fefefe' /></div>
                        <h1 className='flex flex-col md:text-lg font-semibold'>Rs. {selectedRide.budget.totalBudget} <p className={`text-xs mt-1 font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Total budget</p></h1>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div className='rounded-full p-3 bg-[#9C27B0]'><DollarSign size={20} color='#fefefe' /> </div>
                        <h1 className='flex flex-col md:text-lg font-semibold'>Rs. {Math.round(selectedRide.budget.totalBudget / (selectedRide.rideDetails.bookedSeats + 1.5))} Per Seat <p className={`text-xs mt-1 font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Current fare</p></h1>
                    </div>

                    <div className='flex items-center gap-2'>
                        <div className='rounded-full p-3 bg-[#FF7043]'><Wallet size={20} color='#fefefe' /> </div>
                        <h1 className='flex flex-col md:text-lg font-semibold'>Rs. {
                            payingByYou
                        } <p className={`text-xs mt-1 font-normal ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Paying by You</p></h1>
                    </div>
                </div>

                <div className='w-full mt-6 h-[25em] md:h-[18em] lg:h-[15em] bg-[#f0f0f0]'>
                    <Map setOpen={setOpen} open={open} selectedRide={selectedRide} passengers={passengers} />
                </div>

                <div className='mt-4 w-full'>
                    <h1 className='text-lg font-semibold'>Ride Info</h1>

                    <div className='mt-3'>
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow className={`w-full overflow-x-auto whitespace-nowrap  ${toggleTheme ? 'bg-[#202020] border-b border-[#000000] hover:bg-[#202020cc] text-[#fefefe]' : 'bg-[#f7f7f7] border-b hover:bg-[#f7f7f7cc] text-[#202020]'}`}>
                                        {['Ride ID', 'Vehicle', 'Total seats', 'Booked seats', 'Distance', 'Duration', 'Status'].map((item, index) => {
                                            if (item === 'Status') {
                                                return <TableHead className={`px-6 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} key={index}>{item}</TableHead>
                                            } else {
                                                return <TableHead className={`px-6 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} key={index}>{item}</TableHead>
                                            }
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className={`${toggleTheme ? 'hover:bg-[#202020cc]' : 'hover:bg-[#f7f7f7cc]'}`}>
                                        <TableCell className="font-medium py-4 px-6">#{selectedRide._id.slice(-5)}</TableCell>
                                        <TableCell className="font-medium py-4 px-6">{selectedRide.rideDetails.vehicle}</TableCell>
                                        <TableCell className="py-4 px-6">{selectedRide.rideDetails.seats}</TableCell>
                                        <TableCell className="px-6 py-4">{selectedRide.rideDetails.bookedSeats}</TableCell>
                                        <TableCell className="px-6 py-4">{selectedRide.rideDetails.distance}km</TableCell>
                                        <TableCell className="px-6 py-4">{Math.round(selectedRide.rideDetails.duration)}mins</TableCell>
                                        <TableCell className={`px-6 py-4 ${selectedRide.status === 'started' ? 'text-[#4CAF50]' : selectedRide.status === 'waiting' ? 'text-[#2962FF]' : selectedRide.status === 'ready' ? 'text-[#FF7043]' : selectedRide.status === 'expired' ? 'text-[#ff0000]' : selectedRide.status === 'cancelled' ? 'text-[brown]' : 'text-[green]'} font-medium`}>{selectedRide.status.split("-")[0].charAt(0).toUpperCase() + selectedRide.status.split("-").join(" ").slice(1)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className='mt-4 w-full'>
                    <h1 className='text-lg font-semibold'>Passengers</h1>

                    <div className='mt-3'>
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow className={`${toggleTheme ? 'bg-[#202020] border-b border-[#000000] hover:bg-[#202020cc] text-[#fefefe]' : 'bg-[#f7f7f7] border-b hover:bg-[#f7f7f7cc] text-[#202020]'}`}>
                                        {['Name', 'Phone', 'Booked seats', 'Rating', 'Paying', 'Status', 'Actions'].map((item, index) => {
                                            return <TableHead key={index} className={`px-6 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{item}</TableHead>
                                        })}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedRide.passengers.length > 0 ? selectedRide.passengers.map((passenger: any, index: number) => {
                                        return (
                                            <TableRow className={`w-full ${toggleTheme ? 'hover:bg-[#202020cc]' : 'hover:bg-[#f7f7f7cc]'}`} key={index}>
                                                <TableCell className="font-medium py-4 px-6">{passenger.fullname}</TableCell>
                                                <TableCell className="px-6 py-4">{passenger.phone}</TableCell>
                                                <TableCell className="px-6 py-4">{passenger.seatsBooked}</TableCell>
                                                <TableCell className="px-6 py-4">{passenger.rating}</TableCell>
                                                <TableCell className="px-6 py-4">Rs. {Math.round(passenger.paying * passenger.seatsBooked)}</TableCell>
                                                <TableCell className={`px-6 py-4 ${passenger.status === 'pending' ? 'text-[#2962FF]' : passenger.status === 'verified' ? 'text-[#4CAF50]' : passenger.status === 'declined' ? 'text-[#ff0000]' : passenger.status === 'not_verified' ? 'text-[#5b5b5b]' : passenger.status === 'dropped' ? 'text-[brown]' : 'text-[#5b5b5b]'}`}>{passenger.status.charAt(0).toUpperCase() + passenger.status.slice(1)}</TableCell>
                                                <TableCell className="px-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger className='cursor-pointer !z-[150] relative outline-none'>
                                                            <EllipsisVertical size={20} />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] border-none text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'}`}>
                                                            <DropdownMenuItem onClick={() => {
                                                                const pax = {
                                                                    _id: passenger.userId,
                                                                    phone: passenger.phone,
                                                                    fullname: passenger.fullname,
                                                                    photo: passenger.photo,
                                                                    rating: passenger.rating,
                                                                    paying: passenger.paying,
                                                                    seatsBooked: passenger.seatsBooked,
                                                                    luggage: passenger.luggage,
                                                                    pet: passenger.pet,
                                                                    smoking: passenger.smoking,
                                                                }
                                                                setPassengerForChat(pax)
                                                                setOpenChat(true)
                                                            }}><MessageCircle size={20} /> Message</DropdownMenuItem>
                                                            <DropdownMenuItem><PhoneCall size={20} /> Call</DropdownMenuItem>
                                                            {passenger.status !== 'declined' && <DropdownMenuItem onClick={() => {
                                                                const pax = {
                                                                    _id: passenger.userId,
                                                                    phone: passenger.phone,
                                                                    paying: passenger.paying,
                                                                    fullname: passenger.fullname,
                                                                    photo: passenger.photo,
                                                                    rating: passenger.rating,
                                                                    seatsBooked: passenger.seatsBooked,
                                                                    luggage: passenger.luggage,
                                                                    pet: passenger.pet,
                                                                    smoking: passenger.smoking,
                                                                }
                                                                setPassengerForChat(pax)
                                                                setOpenDeclineDialog(true)
                                                            }}><XCircle size={20} /> Decline Request</DropdownMenuItem>}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : <TableRow className='w-full'>
                                        <TableCell colSpan={7} className={`w-full ${toggleTheme ? 'hover:bg-[#202020cc] bg-[#000000] text-[#fefefe]' : 'hover:bg-[#f7f7f7cc] bg-[#f7f7f7] text-[#202020]'} text-center my-2`}>No passengers yet</TableCell>
                                    </TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

            </div>}
        </>
    )
}

export default RideInfo