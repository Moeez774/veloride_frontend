'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User } from '@/context/AuthProvider'
import { Bell, Dot, KeyRound, Route, EllipsisVertical, Bookmark, CheckCheck, Trash, UserRound, Car, Smile, CreditCard } from 'lucide-react'
import { useRide } from '@/context/states'
import Link from 'next/link'

const Notification = ({ isLoading, _id, isRead, type, date, message, toggleTheme, setOpenNotifications, readNotification, currentlyActive, deleteNotification }: { isLoading: boolean, _id: string, isRead: boolean, type: string, date: string, message: string, toggleTheme: boolean | undefined, setOpenNotifications: (open: boolean) => void, readNotification: (id: string) => void, currentlyActive: string, deleteNotification: (id: string) => void }) => {

    return (
        <div onClick={() => setOpenNotifications(false)} className={`relative ${toggleTheme ? 'text-[#fefefe] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f7f7f7]'} cursor-pointer flex text-sm gap-3 p-4 justify-between items-start w-full`}>

            {isRead && <div className={`absolute z-20 left-0 top-0 w-full h-full ${!toggleTheme ? 'bg-[rgba(255,255,255,0.5)]' : 'bg-[rgba(53,53,53,0.5)]'}`}>

            </div>}

            <div className='flex gap-3'>
                <div className={`p-2 rounded-md ${type === 'rideCreated' ? 'bg-green-200' : type === 'Payment' ? 'bg-blue-200' : type === 'passengerDropped' ? 'bg-green-500' : type === 'passengerCancelled' ? 'bg-red-200' : type === 'welcome' ? 'bg-[#00563c]' : type === 'rideStarted' ? 'bg-green-200' : type === 'passengerDeclined' ? 'bg-yellow-200' : type === 'otpArrived' ? 'bg-blue-200' : type === 'rideCancelled' ? 'bg-red-200' : type === 'passengerJoined' ? 'bg-yellow-200' : 'bg-gray-200'} h-fit w-fit`}>
                    {type === 'rideCreated' ? <Route color='green' size={20} /> : type === 'Payment' ? <CreditCard color='blue' size={20} /> : type === 'passengerDropped' ? <UserRound color='white' size={20} /> : type === 'passengerCancelled' ? <UserRound color='white' size={20} /> : type === 'welcome' ? <Smile color='white' size={20} /> : type === 'rideStarted' ? <Car color='green' size={20} /> : type === 'passengerDeclined' ? <UserRound color='white' size={20} /> : type === 'otpArrived' ? <KeyRound color='blue' size={20} /> : type === 'rideCancelled' ? <Trash color='red' size={20} /> : type === 'passengerJoined' ? <UserRound color='white' size={20} /> : <Bell color='gray' size={20} />}
                </div>

                <div>
                    <h1 className='font-medium'>{message}</h1>

                    {/* write date like 'May 16' and time like '10:00 AM' */}
                    <p className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs flex mt-1 items-center`}>{new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    })} <Dot /> {new Date(date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    })}</p>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className={`cursor-pointer relative z-30 p-1 ${toggleTheme ? 'hover:bg-[#575656]' : 'hover:bg-[#f0f0f0]'} rounded-full`}>
                    {isLoading && currentlyActive === _id ?
                        <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                            <circle stroke={toggleTheme ? '#fefefe' : '#575656'} className='authCircle' r="20" cy="50" cx="50"></circle>
                        </svg> :
                        <EllipsisVertical size={18} className={`cursor-pointer`} color={toggleTheme ? '#fefefe' : '#202020'} />}
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                }} className={`border ${toggleTheme ? 'bg-[#353535] border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} -translate-x-16`}>
                    {!isRead && <DropdownMenuItem onClick={() => readNotification(_id)} className='flex items-center gap-2 hover:bg-transparent'><CheckCheck size={18} /> Mark as read</DropdownMenuItem>}
                    <DropdownMenuItem className='flex items-center gap-2'><Bookmark size={18} /> Save</DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2' onClick={() => deleteNotification(_id)}><Trash size={18} /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}


const Notifications = ({ toggleTheme, user, openNotifications, setOpenNotifications }: { toggleTheme: boolean | undefined, user: User | null, openNotifications: boolean, setOpenNotifications: (open: boolean) => void }) => {
    const { notifications, setNotifications } = useRide()
    const [isLoading, setIsLoading] = useState(false)
    const [currentlyActive, setCurrentlyActive] = useState('')

    const readNotification = async (id: string) => {
        setIsLoading(true)
        setCurrentlyActive(id)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                throw new Error('Failed to read notification')
            }

            const response = await res.json()
            setNotifications(notifications.map((e) => e._id === id ? { ...e, is_read: true } : e))

        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }

    }

    const markAllAsRead = async () => {
        setIsLoading(true)
        setCurrentlyActive('all')

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read/all`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!res.ok) {
                throw new Error('Failed to mark all as read')
            }

            const response = await res.json()
            setNotifications(notifications.map((e) => ({ ...e, is_read: true })))

        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
            setCurrentlyActive('')
        }
    }

    const deleteNotification = async (id: string) => {
        setIsLoading(true)
        setCurrentlyActive(id)

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/delete?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!res.ok) {
                alert('Failed to delete notification')
                return
            }

            const response = await res.json()
            setNotifications(notifications.filter((e) => e._id !== id))
        }

        catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
            setCurrentlyActive('')
        }
    }

    return (
        <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className={`p-0 h-[550px] overflow-y-auto inter border-none ${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'}`} style={{ scrollbarWidth: 'thin' }}>
                <DialogHeader>
                    <DialogTitle className='pt-5 px-4'>Notifications</DialogTitle>
                    <hr className={`${toggleTheme ? 'border-[#353535]' : 'border-[#f0f0f0]'} mt-2`} />
                    <div className='py-3 w-full'>

                        {/* Tabs */}
                        {/* changing active tab color */}
                        <Tabs defaultValue="viewAll" className="w-full">
                            <div className='w-full flex justify-between px-4 gap-2'>
                                <TabsList className={`${toggleTheme ? 'bg-[#353535] text-[#fefefe]' : 'bg-[#f0f0f0] text-[#202020]'} w-2/3 flex justify-between`}>
                                    <TabsTrigger
                                        className={`cursor-pointer ${toggleTheme
                                            ? 'hover:bg-[#353535] text-[#fefefe] data-[state=active]:bg-black'
                                            : 'hover:bg-[#f0f0f0] text-[#202020] data-[state=active]:bg-white'
                                            }`}
                                        value="viewAll"
                                    >
                                        View all
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className={`cursor-pointer ${toggleTheme
                                            ? 'hover:bg-[#353535] text-[#fefefe] data-[state=active]:bg-black'
                                            : 'hover:bg-[#f0f0f0] text-[#202020] data-[state=active]:bg-[#fefefe]'
                                            }`}
                                        value="unread">Unread ({notifications.filter((notfi) => notfi.is_read === false).length})</TabsTrigger>
                                </TabsList>

                                <button className={`sm:text-sm text-xs cursor-pointer ${toggleTheme ? 'bg-[#353535] lg:bg-transparent hover:bg-[#353535] text-[#fefefe]' : 'bg-[#f7f7f7] lg:bg-transparent hover:bg-[#f7f7f7] text-[#202020]'} py-2 sm:w-36 w-24 flex justify-center items-center gap-2 bg-transparent rounded-md`} onClick={markAllAsRead}>{currentlyActive === 'all' ? <>
                                    <svg className='authLoader w-[1.42em]' viewBox="25 25 50 50">
                                        <circle stroke={toggleTheme ? '#fefefe' : '#575656'} className='authCircle' r="20" cy="50" cx="50"></circle>
                                    </svg>
                                </> : 'Mark all as read'}</button>
                            </div>

                            <TabsContent value="viewAll" className='mt-2 flex w-full text-start flex-col'>

                                {notifications.length > 0 ? notifications.map((e, index) => {
                                    return <Link key={index} onClick={() => readNotification(e._id)} href={`${e.reference_url}`}><Notification isRead={e.is_read} isLoading={isLoading} _id={e._id} deleteNotification={deleteNotification} setOpenNotifications={setOpenNotifications} type={e.type} currentlyActive={currentlyActive} date={e.createdAt} message={e.message} toggleTheme={toggleTheme} readNotification={readNotification} /></Link >
                                }) : <p className={`text-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>No notifications yet</p>}

                            </TabsContent>


                            <TabsContent value="unread" className='mt-2 flex w-full text-start flex-col'>

                                {notifications.length > 0 && notifications.filter((notfi) => notfi.is_read === false).length === 0 && <p className={`text-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>No unread notifications</p>}

                                {notifications.length > 0 ? notifications.filter((notfi) => notfi.is_read === false).map((e, index) => {
                                    return <Link key={index} onClick={() => readNotification(e._id)} href={`${e.reference_url}`}><Notification isRead={e.is_read} isLoading={isLoading} _id={e._id} deleteNotification={deleteNotification} setOpenNotifications={setOpenNotifications} type={e.type} currentlyActive={currentlyActive} date={e.createdAt} message={e.message} toggleTheme={toggleTheme} readNotification={readNotification} /></Link >
                                }) : <p className={`text-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>No unread notifications</p>}

                            </TabsContent>
                        </Tabs>

                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Notifications