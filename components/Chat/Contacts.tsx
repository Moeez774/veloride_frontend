import socket from '@/utils/socket'
import { format, isToday } from 'date-fns'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface Details {
    setChat: Dispatch<SetStateAction<any>>,
    contact: any,
    user: any,
    openChat: boolean,
    setOpenChat: Dispatch<SetStateAction<boolean>>,
    chat: any
}

const Contacts: React.FC<Details> = ({ setChat, contact, user, setOpenChat, openChat, chat }) => {

    const [lastMessage, setLastMessage] = useState('')
    const [newTime, setNewTime] = useState('')
    const [unReads, setUnReads] = useState(0)

    const updateTime = (time: string) => {
        const date = new Date(time)
        if (isToday(date)) setNewTime(format(date, "h:mm a"))
        else setNewTime(format(date, "MMM dd, yyyy"))
    }

    //for setting latest message and time
    useEffect(() => {
        for (const item of contact.contacts) {
            if (item.contact_id === user?._id) {
                setLastMessage(item.message)
                updateTime(item.time)
                break
            }
        }
    }, [contact.contacts, user?._id])

    //for updating things in realtime
    useEffect(() => {

        const realTimeUpdate = (data: any) => {
            for (const item of contact.contacts) {
                if (item.chat_id === data.chat_id) {
                    setLastMessage(data.message)
                    updateTime(data.time)
                    break
                }
            }
        }

        // for updating unreads
        const updateUnReads = (data: any) => {
            for (const item of contact.contacts) {
                if (item.chat_id === data.chat_id) {
                    if(window.matchMedia("(max-width: 1023px)").matches) setUnReads(prev => prev + 1)
                         else if (chat._id!=data.sender_id && window.matchMedia("(min-width: 1024px)").matches) setUnReads(prev => prev + 1)
                    break
                }
            }
        }

        socket.on("message-sent", realTimeUpdate)
        socket.on("unRead-message", updateUnReads)

        return () => {
            socket.off("message-sent", realTimeUpdate)
            socket.off("unRead-message", updateUnReads)
        }
    }, [chat, contact])

    useEffect(() => {
        if(!chat) return
        //for removing unreads label on opening chat
        if(contact._id===chat._id) setUnReads(0)
    }, [chat])

    return (
        <div onClick={() => {
            setChat(null)
            setChat(contact)
            setOpenChat(true)
        }} className='flex w-full px-4 md:px-6 py-2.5 hover:bg-[#f0f0f0] transition-all duration-200 cursor-pointer gap-3'>
            {contact.photo?.startsWith("hsl") && (
                <div className={`rounded-full flex justify-center items-center text-white h-11 w-11 sm:h-12 sm:w-12 lg:w-9 lg:h-9`} style={{ background: contact.photo }}>
                    <h1 className='inter text-xl sm:text-2xl lg:text-base font-medium'>{contact.fullname?.charAt(0).toUpperCase()}</h1>
                </div>
            )}

            {/* user with profile */}
            {!contact.photo?.startsWith("hsl") && (
                <div>
                    { unReads!=0 && <div className='absolute hidden lg:flex -translate-x-1 -translate-y-1 w-5 h-5 mr-4 lg:mr-0 rounded-full text-[12px] justify-center text-[#fefefe] bg-[#00b37e]'><p className='translate-y-[0.4px] -translate-x-[0.6px]'>{unReads}</p></div> }
                    <img className={`w-11 sm:w-12 lg:w-9 transition-all duration-200 rounded-full`} src={contact.photo || undefined} alt="" />
                </div>
            )}
            <div className='flex flex-1 flex-col overflow-hidden text-ellipsis whitespace-nowrap justify-center gap-0.5'>
                <div className='flex lg:flex-col justify-between lg:justify-start items-center lg:items-start gap-0.5'>
                    <div className='flex justify-between w-full items-center'>
                        <h1 className='inter lg:text-[14px] sm:font-medium'>{contact.fullname}</h1>
                        { unReads!=0 && <div className='flex lg:hidden w-5 h-5 mr-4 lg:mr-0 rounded-full text-[12px] justify-center text-[#fefefe] bg-[#00b37e]'><p className='translate-y-[0.4px] -translate-x-[0.4px]'>{unReads}</p></div> }
                    </div>
                    <h1 className='text-xs sm:text-[13px] lg:text-[11px] font-normal translate-y-0.5 text-[#7e7e7e]'>{newTime}</h1>
                </div>
                <h1 className='text-[13px] lg:text-xs font-normal text-[#7e7e7e]'>{lastMessage}</h1>
            </div>
        </div>
    )
}

export default Contacts
