'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CheckCheck, LucideForward, MessageCircle, MoreVertical } from 'lucide-react'
import { StarIcon } from '@heroicons/react/16/solid'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { sendMessage } from '@/functions/function'
import socket from '@/utils/socket'
import { format, isToday } from 'date-fns'
import { unstable_batchedUpdates } from 'react-dom'

interface Details {
    receiver: any,
    openChat: boolean,
    setOpenChat: Dispatch<SetStateAction<boolean>>,
    chat_id: string,
    ride: any
}

const Messages: React.FC<Details> = ({ receiver, openChat, setOpenChat, chat_id, ride }) => {

    const pathname = usePathname()
    const authContext = useAuth()
    const user = authContext?.user || null
    const theme = getContacts()
    const toggleTheme = theme?.toggleTheme || false

    //states
    const [message, setMessage] = useState('')
    const [chat, setChat] = useState<any[]>([])
    const [isExist, setIsExist] = useState(false)

    //for sending message
    const messageIt = async () => {
        socket.emit("joinRoom", (`${user?._id}_${receiver._id}`))
        await sendMessage(chat_id, user?._id || "", receiver._id, message, user?.photo || "", receiver.photo, user?.fullname || "", receiver.fullname, isExist, setIsExist, setMessage)
    }

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        })
    }

    useEffect(() => {
        unstable_batchedUpdates(() => {
            scrollToBottom()
        })
    }, [chat, openChat])

    //fetching chat
    useEffect(() => {
        if (!user) return

        const fetchChat = async () => {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/fetch-chat`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chat_id: chat_id })
            })

            let response = await a.json()
            setChat(response.data)
            if (response.data.length != 0) {
                setIsExist(true)
            }
        }

        fetchChat()
    }, [user])

    useEffect(() => {
        const addMessage = (data: any) => setChat((prev) => [...prev, data])
        socket.on("message-sent", addMessage)
        return () => {
            socket.off("message-sent", addMessage)
        }
    }, [])

    //converting time of message in exact format
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        if (isToday(date)) {
            return format(date, "h:mm a")
        } else {
            return format(date, "MMM dd, yyyy")
        }
    }

    return (
        <div className='flex items-center'>
            <Sheet open={openChat} onOpenChange={() => setOpenChat(false)}>
                <SheetTrigger>
                </SheetTrigger>
                <SheetContent style={{ scrollbarWidth: 'thin' }} className={`w-screen sm:max-w-lg px-0 mx-0 py-1 min-h-screen sm:w-full ${toggleTheme ? 'bg-[black] border border-[#202020] text-[#fefefe]' : 'bg-[#fefefe] border text-[#202020]'}`}>
                    <SheetHeader className='p-0'>
                        <SheetTitle className=''></SheetTitle>
                        <div className='inter w-full relative flex flex-col gap-0'>
                            {/* top section */}
                            <div className='flex justify-between pt-6 px-4 items-center'>
                                <div className='flex items-center gap-3'>
                                    {pathname.startsWith('/ride-detail') && <img className='w-10 rounded-full md:w-12' src={ride.additionalInfo.photo === "" ? "/Images/user(1).png" : ride.additionalInfo.photo} alt="" />}

                                    {/* if user hasn't any photo */}
                                    {!pathname.startsWith('/ride-detail') && receiver.photo?.startsWith("hsl") && (
                                        <div className={`rounded-full flex justify-center items-center text-white 'h-10 w-10 md:w-12 md:h-12`} style={{ background: receiver.photo }}>
                                            <h1 className='inter md:text-lg'>{receiver.fullname?.charAt(0).toUpperCase()}</h1>
                                        </div>
                                    )}

                                    {/* user with profile */}
                                    {!pathname.startsWith('/ride-detail') && !receiver.photo?.startsWith("hsl") && (
                                        <div>
                                            <img className={`w-10 md:w-12 transition-all duration-200 rounded-full`} src={receiver.photo || undefined} alt="" />
                                        </div>
                                    )}

                                    <div>
                                        <h1 className={`inter text-[17px] flex items-center gap-1 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{pathname.startsWith('/ride-detail') ? 'Driver' : receiver.fullname}<span className='text-[12px] font-normal translate-y-0.5' style={{ display: pathname.startsWith('/ride-detail') ? 'block' : 'none' }}>({receiver.fullname})</span></h1>
                                        <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} flex font-medium items-center gap-1 text-xs`}><StarIcon color={toggleTheme ? '#fefefe' : '#202020'} className='w-4 h-4' />{ride.additionalInfo.rating.toFixed(1)}</h1>
                                    </div>
                                </div>
                                <MoreVertical size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                            </div>

                            <hr className='mt-4' style={{ borderColor: toggleTheme ? '#202020' : '#f0f0f0' }} />

                            {/* //messages */}
                            <div className='pb-16 flex flex-col gap-8'>
                                <div ref={chatContainerRef} style={{ scrollbarWidth: 'thin' }} className='flex flex-col h-[calc(100vh-150px)] overflow-y-auto py-6 px-4 gap-6'>
                                    {chat.length != 0 && chat.map((e, index) => {
                                        return (
                                            <div key={index} className={`flex ${e.sender_id === user?._id ? 'items-end' : 'items-start'} flex-col gap-1.5`}>
                                                <div className={`${e.sender_id === user?._id ? 'bg-[#A5E8D4]' : toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} rounded-xs py-4 w-fit max-w-3/5 lg:max-w-sm pl-2.5 pr-10`} style={{ wordBreak: 'break-word' }}>
                                                    <h1 className={`text-sm ${e.sender_id === user?._id ? 'text-[#202020]' : toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{e.message}</h1>
                                                </div>
                                                {e.sender_id === user?._id ? (<h1 className='text-xs font-medium flex gap-0.5 items-end justify-start'><CheckCheck size={17} color='#00b37e' /><p className='text-[11px] text-[#9B9B9B]'>{formatMessageTime(e.time)}</p></h1>) :
                                                    (
                                                        <div className='flex items-center gap-1.5'>
                                                            <h1 className='text-xs font-medium flex items-end gap-2'><p className='text-[11px] text-[#9B9B9B]'>{formatMessageTime(e.time)}</p></h1>
                                                        </div>
                                                    )}
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* inputs */}
                                <div className={`fixed w-screen sm:max-w-lg sm:w-full bottom-0 px-6 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} h-16 rounded-tr-3xl rounded-tl-3xl flex items-center justify-between gap-3`}>
                                    <input
                                        type="text"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") messageIt()
                                        }}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className={`flex-1 py-2.5 text-[15px] md:text-base ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} outline-none ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}
                                        placeholder='Type a message...'
                                    />

                                    <div onClick={() => messageIt()} className='p-2 active:bg-[#00563c] transition-all duration-200 hover:bg-[#00563ccc] cursor-pointer rounded-full bg-[#00563c]'>
                                        <LucideForward size={25} color='#fefefe' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </div>
    )
}

export default Messages
