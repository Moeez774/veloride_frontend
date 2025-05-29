import { sendMessage } from '@/functions/function'
import socket from '@/utils/socket'
import { format, isToday } from 'date-fns'
import { CheckCheck, ChevronLeft, MoreVertical, Phone, Send } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import '@/components/commonOnes/Commons.css'
interface Details {
    contact: any,
    user: any,
    setOpenChat: Dispatch<SetStateAction<boolean>>,
    setChat: Dispatch<SetStateAction<any>>,
    showProfile: boolean,
    setShowProfile: Dispatch<SetStateAction<boolean>>
}

const Chat: React.FC<Details> = ({ contact, user, setOpenChat, setChat, showProfile, setShowProfile }) => {

    const [messages, setMessages] = useState<any[]>([])
    const [chat_id, setChatId] = useState('')
    const [message, setMessage] = useState('')
    const [isExist, setIsExist] = useState(true)
    const [loader, setLoader] = useState(true)
    const [isTyping, setIsTyping] = useState(false)

    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        })
    }

    // for scrolling to bottom on chat load and also on new message
    useEffect(() => {
        unstable_batchedUpdates(() => scrollToBottom())
    }, [messages])

    //for getting chat id first from contacts array so we can fetch exact chat
    useEffect(() => {
        for (const item of contact.contacts) {
            if (item.contact_id === user._id) {
                setChatId(item.chat_id)
                break
            }
        }
        const addMessage = (data: any) => {
            if (data.chat_id === chat_id) setMessages((prev) => [...prev, data])
        }

        socket.on("message-sent", addMessage)

        socket.on("typing", (chat_id) => setIsTyping(true))

        socket.on("stopTyping", () => setIsTyping(false))

        return () => {
            socket.off("message-sent", addMessage)
            socket.off("typing")
            socket.off("stopTyping")
        }
    }, [contact, chat_id])

    //fetching all messages
    useEffect(() => {
        setMessages([])
        if (chat_id === '') return
        setLoader(true)
        const fetchMessages = async () => {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/fetch-chat`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chat_id: chat_id })
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                setMessages(response.data)
                setLoader(false)
            }
        }

        fetchMessages()
    }, [chat_id])

    //for sending message
    const messageIt = async () => await sendMessage(chat_id, user._id || "", contact._id, message, user?.photo || "", contact.photo, user?.fullname || "", contact.fullname, isExist, setIsExist, setMessage)

    //converting time of message in exact format
    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp)
        if (isToday(date)) return format(date, "h:mm a")
        else return format(date, "MMM dd, yyyy")
    }

    // for blocking going back
    useEffect(() => {
        if (window.matchMedia("(max-width: 1023px)").matches) {
            const handlePopState = (event: PopStateEvent) => {
                setOpenChat(false)
                setShowProfile(false)
                event.preventDefault()
                window.history.pushState(null, "", window.location.href)
            }
            window.history.pushState(null, "", window.location.href)
            window.addEventListener("popstate", handlePopState)

            return () => window.removeEventListener("popstate", handlePopState)
        }
    }, [])

    const handleTyping = () => {
        socket.emit("typing", chat_id)
        setTimeout(() => socket.emit("stopTyping", chat_id), 2000)
    }

    return (
        <>
            {loader && <div className='w-full h-full bg-[#f0f0f0]'>
                <div className='loader'></div>
            </div>
            }

            {messages.length != 0 && <div className='flex py-4 px-2 sm:p-4 items-center justify-between gap-4' style={{ userSelect: 'none' }}>
                <div className='flex items-center lg:gap-3'>
                    <ChevronLeft size={20} className='lg:hidden cursor-pointer mr-1' onClick={() => {
                        setOpenChat(false)
                        setChat(null)
                    }} color='#202020' />
                    {contact.photo?.startsWith("hsl") && (
                        <div onClick={() => {
                            setOpenChat(false)
                            setShowProfile(true)
                        }} className={`rounded-full cursor-pointer lg:cursor-default flex justify-center items-center text-white w-10 h-10`} style={{ background: contact.photo }}>
                            <h1 className='inter text-lg'>{contact.fullname?.charAt(0).toUpperCase()}</h1>
                        </div>
                    )}

                    {/* user with profile */}
                    {!contact.photo?.startsWith("hsl") && (
                        <div>
                            <img onClick={() => {
                                setOpenChat(false)
                                setShowProfile(true)
                            }} className={`w-10 cursor-pointer lg:cursor-default transition-all duration-200 rounded-full`} src={contact.photo || undefined} alt="" />
                        </div>
                    )}
                    <h1 className='text-[15px] ml-3 lg:ml-0 sm:text-base lg:text-sm'>{contact.fullname}</h1>
                </div>

                <div className='flex items-center gap-2 sm:gap-3'>
                    <button className='bg-[#f0f0f0] cursor-pointer transition-all duration-200 active:bg-[#e9e9e9] hover:bg-[#e0e0e0] p-2.5 rounded-full'><Phone size={20} color='#202020' /></button>
                    <button className='bg-[#f0f0f0] cursor-pointer transition-all duration-200 active:bg-[#e9e9e9] hover:bg-[#e0e0e0] p-2.5 rounded-full'><MoreVertical size={20} color='#202020' /></button>
                </div>
            </div>}

            {messages.length != 0 && <hr />}

            {messages.length != 0 && <div className='relative flex flex-col pt-6 px-4 overflow-y-auto w-full h-[calc(100vh-140px)] md:h-[calc(100vh-160px)] mx-auto' ref={chatContainerRef} style={{ scrollbarWidth: 'thin' }}>

                <div className='relative flex flex-col max-w-[52rem] mx-auto w-full'>
                    <div className='flex flex-col pb-8 gap-4'>
                        {messages && messages.map((e, index) => {
                            return (
                                <div key={index} className={`flex ${e.sender_id === user._id ? 'items-end' : 'items-start'} flex-col gap-1.5`}>
                                    <div className={`${e.sender_id === user._id ? 'bg-[#A5E8D4]' : 'bg-[#fefefe]'} rounded-[3px] py-3 md:py-4 pl-2.5 w-fit max-w-3/5 pr-10`} style={{ wordBreak: 'break-word' }}>
                                        <h1 className='text-sm'>{e.message}</h1>
                                    </div>
                                    {e.sender_id === user._id ? (<h1 className='text-xs font-medium flex gap-0.5 items-end justify-start'><CheckCheck size={17} color='#00b37e' /><p className='text-[11px] text-[#9B9B9B]'>{formatMessageTime(e.time)}</p></h1>) :
                                        (
                                            <div className='flex items-center gap-1.5'>
                                                <h1 className='text-xs font-medium flex items-end gap-2'><p className='text-[11px] text-[#9B9B9B]'>{formatMessageTime(e.time)}</p></h1>
                                            </div>
                                        )}
                                </div>
                            )
                        })}
                        {isTyping && <div className="chatLoader mb-4">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                        }
                    </div>
                </div>
            </div>}
            {messages.length != 0 && <div className='md:mb-8 w-full px-2 sm:px-4 flex justify-center mx-auto items-center gap-2 bottom-0'>

                {user.photo?.startsWith("hsl") && (
                    <div className={`rounded-full hidden md:flex justify-center items-center text-white h-8 w-8 md:w-9 md:h-9`} style={{ background: user.photo }}>
                        <h1 className='inter text-xs md:text-base'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                    </div>
                )}

                {/* user with profile */}
                {!user.photo?.startsWith("hsl") && (
                    <div className='hidden md:block'>
                        <img className={`w-8 md:w-10 transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                    </div>
                )}
                <div className='max-w-lg w-full'>
                    <input type="text" value={message} onChange={(e) => {
                        setMessage(e.target.value)
                        handleTyping()
                    }} placeholder='Type a message' onKeyDown={(e) => {
                        if (e.key === "Enter") messageIt()
                    }} className='text-[15px] pl-3 pr-1 outline-none w-full py-3 md:py-[0.90rem] bg-[#fefefe] rounded-sm text-[#202020]' style={{ border: '1px solid #e0e0e0' }} />
                </div>

                <div>
                    <button onClick={() => messageIt()} className='p-[0.90rem] sm:py-3 md:py-[0.95rem] cursor-pointer transition-all duration-200 active:bg-[#00b377] hover:bg-[#00b37dd7] rounded-full sm:rounded-sm bg-[#00b37e] sm:px-7 md:px-8 xl:px-10 flex items-center gap-1 text-sm text-[#fefefe]'><Send className='translate-y-0.5 sm:translate-y-0' size={20} color='#fefefe' /> <p className='hidden sm:block'>Send</p></button>
                </div>
            </div>}
        </>
    )
}

export default Chat