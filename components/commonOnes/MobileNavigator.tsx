'use client'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { HomeIcon } from '@heroicons/react/16/solid'
import { Moon, Sun } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const MobileNavigator = () => {

    const pathname = usePathname()
    const router = useRouter()
    const authContext = useAuth()
    const user = authContext?.user || null
    const setUser = authContext?.setUser
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const setToggleTheme = context?.setToggleTheme

    // for logging out user
    const logOut = async () => {
        try {
            let a = await fetch('http://localhost:4000/users/log-out', {
                method: "GET",
                credentials: 'include'
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                setUser && setUser(null)
                alert(response.message)
                router.refresh()
            } else {
                alert(response.message)
            }
        } catch (error) {
            console.error("Logout Error:", error)
        }
    }

    return (
        <div onClick={() => {
            if(setToggleTheme) setToggleTheme(!toggleTheme)
        }} className={`p-4 w-fit h-fit cursor-pointer transition-all duration-200 rounded-full ${toggleTheme? 'bg-[#fefefe]': 'bg-[#202020]'} m-8`}>
           { !toggleTheme? <Moon size={25} color='#fefefe' /> : <Sun size={25} color='#202020' /> }
        </div>
    )
}

export default MobileNavigator
