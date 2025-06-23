'use client'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { HomeIcon } from '@heroicons/react/16/solid'
import { Bell, Moon, SlidersHorizontal, Sun } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Notifications from './Notifications'
import { useRide } from '@/context/states'
const MobileNavigator = () => {

    const pathname = usePathname()
    const router = useRouter()
    const { notifications } = useRide()
    const authContext = useAuth()
    const user = authContext?.user || null
    const [openNotifications, setOpenNotifications] = useState(false)
    const setUser = authContext?.setUser
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const setToggleTheme = context?.setToggleTheme
    const [isOpen, setIsOpen] = useState(false)
    const optionsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleOutsideClicks = (e: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current?.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        window.addEventListener('mousedown', handleOutsideClicks)

        return () => {
            window.removeEventListener('mousedown', handleOutsideClicks)
        }
    }, [])

    return (
        <div className='relative'>

            <Notifications toggleTheme={toggleTheme} user={user} openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />

           { !isOpen && notifications.length > 0 && notifications.find((notfi) => !notfi?.is_read) && <div className={`absolute top-0 right-0 m-[30px] z-[200] w-3 h-3 bg-red-500 rounded-full`}></div> }

            <div ref={optionsRef} className={`w-fit h-12 z-[150] relative flex flex-col overflow-hidden transition-all duration-200 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'} mb-8 mr-8`}>
                <button onClick={() => {
                    setOpenNotifications(true)
                    setIsOpen(false)
                }} className={`cursor-pointer rounded-full p-3 ${toggleTheme ? 'hover:bg-[#f0f0f0]' : 'hover:bg-[#353535]'}`}><Bell size={25} color={toggleTheme ? '#202020' : '#fefefe'} /></button>
            </div>
        </div>
    )
}

export default MobileNavigator
