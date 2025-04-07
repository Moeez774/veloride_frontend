'use client'
import { useAuth } from '@/context/AuthProvider'
import { HomeIcon } from '@heroicons/react/16/solid'
import { Car, DoorOpen, Gift, Leaf, LifeBuoy, MessageCircle, ShieldCheck, User2, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React, { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const MobileNavigator = () => {

    const pathname = usePathname()
    const router = useRouter()
    const [openMenu, setMenu] = useState(false)

    const authContext = useAuth()
    const user = authContext?.user || null
    const setUser = authContext?.setUser

    // all links of profile drop down
    const items = [{ icon: <User2 size={27} color='#202020' />, text: "Profile & Settings", link: '/chats' }, { icon: <MessageCircle size={27} color='#202020' />, text: "Messages", link: '/chats' }, { icon: <LifeBuoy size={27} color='#202020' />, text: "Support & Help", link: '/chats' }, { icon: <Gift size={27} color='#202020' />, text: "Refer & Earn", link: '/chats' }, { icon: <ShieldCheck size={27} color='#202020' />, text: "Privacy & Security", link: '/chats' }, { icon: <DoorOpen size={27} color='#202020' />, text: "Log out", link: '/hop-in' }]

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

    if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname.startsWith('/find-ride') || pathname.startsWith('/offer-ride') || pathname.startsWith('/ride-detail') || pathname.startsWith('/chats') || pathname.startsWith('/matched-rides')) return null

    return (
        <div className='bg-white relative z-50 py-4 px-6 justify-between transition-all duration-200 h-[5rem] flex items-end shadow-lg rounded-t-lg' style={{ border: 'none', borderTop: '1px solid #a7a7a7', userSelect: 'none', borderRight: '1px solid #a7a7a7', borderLeft: '1px solid #a7a7a7' }}>

            <div className='flex flex-col justify-center items-center cursor-pointer gap-0'>
                <HomeIcon className='w-8 h-8' color='#202020' />
                <h1 className='inter text-[11px]'>Home</h1>
            </div>

            <div className='flex flex-col justify-center items-center cursor-pointer gap-1'>
                <Car size={25} color='#202020' />
                <h1 className='inter text-[11px]'>My rides</h1>
            </div>

            <div className='flex flex-col justify-center items-center cursor-pointer gap-1'>
                <Wallet size={25} color='#202020' />
                <h1 className='inter text-[11px]'>Wallet</h1>
            </div>

            <div className='flex flex-col justify-center items-center cursor-pointer gap-1'>
                <Leaf size={25} color='#202020' />
                <h1 className='inter text-[11px]'>Rewards</h1>
            </div>

            <div className='flex flex-col justify-center items-center cursor-pointer gap-1'>

                {/* // for that case in which user is not logged in */}
                <Dialog open={openMenu} onOpenChange={() => setMenu(!openMenu)}>
                    <DialogTrigger>
                        {!user && <User2 size={25} color='#202020' />}

                        {/* // for lgged in user */}
                        {user && user.photo?.startsWith("hsl") && (
                            <div className='rounded-full flex justify-center items-center cursor-pointer text-white w-[1.90rem] h-[1.90rem]' onClick={() => setMenu(true)} style={{ background: user.photo }}>
                                <h1 className='inter -translate-x-[1px] text-[15px]'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                            </div>
                        )}

                        {/* user with profile */}
                        {user && !user.photo?.startsWith("hsl") && (
                            <div onClick={() => setMenu(true)}>
                                <img className='w-7 cursor-pointer rounded-full' src={user.photo || undefined} alt="" />
                            </div>
                        )}
                    </DialogTrigger>
                    <DialogContent className='py-10 px-4'>
                        <DialogHeader>
                            <DialogTitle className='inter mb-7'>My Account</DialogTitle>
                            <div className='inter flex gap-5 justify-center flex-wrap'>
                                {items.map((item, index) => {
                                    return (
                                        <div key={index} className='flex flex-col gap-1 items-center'>
                                            <Link href={item.link} prefetch={true} ><button className='p-3 active:bg-[#fefefe] cursor-pointer transition-all duration-200 rounded-full bg-[#f0f0f0]' onClick={async () => {
                                                if (index === items.length - 1) {
                                                    await logOut()
                                                    await signOut(auth)
                                                    router.push('/hop-in')
                                                }
                                                setMenu(false)
                                            }}>
                                                {item.icon}
                                            </button></Link>
                                            <h1 className='text-[13px] text-center w-20'>{item.text}</h1>
                                        </div>
                                    )
                                })}

                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <h1 className='inter text-[11px]'>Profile</h1>
            </div>

        </div>
    )
}

export default MobileNavigator
