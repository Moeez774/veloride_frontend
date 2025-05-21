'use client'
import { Car, DoorOpen, Gift, Leaf, LifeBuoy, LogOut, MessageCircle, ShieldCheck, Sliders, User, User2, Wallet, ArrowLeft, Search, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useAuth } from '@/context/AuthProvider'
import { Bars3BottomLeftIcon, MapPinIcon } from '@heroicons/react/16/solid'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import './Commons.css'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FindARide from './FindARide'
import Link from 'next/link'
import { getContacts } from '@/context/ContactsProvider'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import MainMap from '../../app/(HomePage)/MainMap'
import { useInView } from 'react-intersection-observer';

const Header = () => {

    const pathname = usePathname()
    const router = useRouter()
    const authContext = useAuth()
    const user = authContext?.user || null
    const setUser = authContext?.setUser || undefined
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    const [scroll, setScroll] = useState(false)
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [showHeader, setShowHeader] = useState(true)
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [mobileSearchBar, setMobileSearchBar] = useState(false)
    const [val, setVal] = useState('')
    const [navigators, setNavigators] = useState<any[]>([])
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        if (showMap) {
            document.body.style.overflowY = 'hidden'
        }
        else if (!showMap) {
            document.body.style.overflowY = 'auto'
        }
    }, [showMap])

    useEffect(() => {

        const fetchFeatures = async () => {
            let a = await fetch('http://localhost:4000/data/sub-features', {
                method: "GET"
            })

            let response = await a.json()
            setNavigators(response.subs)
        }

        fetchFeatures()
    }, [])

    // Checking pathname in useEffect to avoid SSR mismatch
    useEffect(() => {
        const hideHeaderPaths = [
            '/auth', '/auth', '/dashboard', '/reset-password', '/find-ride', '/offer-ride', '/chats', '/matched-rides', '/dashboard/manage-rides']

        const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;
        const isMobileScreen = window.matchMedia("(max-width: 767px)").matches;

        if (
            hideHeaderPaths.some(path => pathname === path) ||
            pathname.startsWith('/ride-detail') ||
            (isMobileScreen && pathname.startsWith('/find-ride/saved-routes'))
        ) {
            setShowHeader(false)
        } else {
            setShowHeader(true)
        }
    }, [pathname])


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

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 0);
        }
        window.addEventListener("scroll", handleScroll)
        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        setScroll(window.scrollY > 0);
    }, [pathname])

    if (!showHeader) return null

    return (

        <>

            <div className={`absolute ${toggleTheme ? 'bg-[#000000]' : 'bg-[#fefefe]'} w-full z-10 ${scroll ? 'h-[6.5rem] lg:h-[6rem]' : 'h-0'} transition-all duration-400`}></div>

            <div ref={ref} className={`transition-all relative z-20 ${inView ? 'translate-y-0 opacity-[1]' : 'opacity-0 translate-y-3'} duration-800 rounded-b-xl h-[6.5rem] md:h-[6.5rem] lg:h-[6rem] flex max-w-7xl mx-auto items-center px-8 sm:px-10 md:px-12 py-5`}>

                {/* // searchbar for screens below 950px */}
                <div>
                    <Sheet open={mobileSearchBar} onOpenChange={() => {
                        setMobileSearchBar(false)
                    }}>
                        <SheetTrigger className='flex cursor-pointer items-center'></SheetTrigger>
                        <SheetContent side='top' className='w-full py-10 h-screen'>
                            <SheetHeader>
                                <SheetTitle></SheetTitle>
                                <div className='flex bg-[#f0f0f0] rounded-full pl-3 justify-between items-center'>
                                    <div className='flex items-center w-full'>

                                        <ArrowLeft size={20} onClick={() => setVal('')} color={val.length > 0 ? '#202020' : 'gray'} className='cursor-pointer transition-all duration-200' />

                                        <input value={val} onChange={(e) => setVal(e.target.value)} type="text" className={`inter text-[#202020] bg-transparent text-sm sm:text-base w-full outline-none py-2 px-2 transition-all duration-200`} placeholder='Best rides for Lahore...' />
                                    </div>

                                    <div className={` ${'p-3'} cursor-pointer rounded-full transition-all duration-200 hover:bg-[#d6d6d6]`}>
                                        <Search size={18} color='#202020' />
                                    </div>
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className='relative z-20 flex justify-between w-full items-center'>

                    <div className='flex items-center gap-10'>
                        {/* logo */}
                        <div className='flex items-center'>
                            <Link href={'/'} ><img className={`transition-all cursor-pointer duration-200 w-10 md:w-12`} src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" /></Link>
                        </div>
                    </div>

                    {/* navigators */}

                    <div className={`hidden transition-all lg:flex duration-200 items-center gap-1 ${showSearchBar ? 'opacity-0 z-0' : 'opacity-[1] z-20'}`}>
                        <div className='px-6 py-[7px] rounded-md hover:bg-[#eeeeee] cursor-pointer'>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <h1 className={`inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium text-sm`}>Home</h1>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <FindARide />
                    </div>

                    {!user && <div className='inter flex items-center gap-3'>
                        <Link href={'/auth'}><button className='py-2.5 font-medium hover:bg-[#00563ccc] transition-all duration-200 rounded-xl cursor-pointer active:bg-[#00563c] text-[#fefefe] px-6 sm:px-8 text-[14px] bg-[#00563c]'>Join us</button></Link>
                    </div>}

                    {user && <div className='flex items-center gap-4'>
                        <div className='flex items-center relative z-30 gap-6'>
                            <Search size={23} onClick={() => {
                                setMobileSearchBar(true)
                            }} className='transition-all duration-200 cursor-pointer' style={{ display: !showSearchBar ? 'block' : 'none' }} color={toggleTheme ? '#fefefe' : '#202020'} />

                            {/* // user's profile and logout access */}
                            <div className='hidden md:flex items-center'>

                                {user && <DropdownMenu>
                                    <DropdownMenuTrigger className='outline-none'>
                                        <div className='cursor-pointer flex items-center'>
                                            {/* if user hasn't any photo */}
                                            {user.photo?.startsWith("hsl") && (
                                                <div className={`rounded-full flex justify-center items-center text-white h-8 w-8 md:w-10 md:h-10`} style={{ background: user.photo }}>
                                                    <h1 className='inter md:text-lg'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                                                </div>
                                            )}

                                            {/* user with profile */}
                                            {!user.photo?.startsWith("hsl") && (
                                                <div>
                                                    <img className={`w-8 md:w-10 transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='inter hidden h-28 lg:flex flex-col justify-center w-60 text-[#202020] p-2 -translate-x-32'>

                                        <Link href='/dashboard'><DropdownMenuItem className='cursor-pointer text-lg'>Dashboard</DropdownMenuItem></Link>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className='cursor-pointer' onClick={async () => {
                                            await logOut()
                                            await signOut(auth)
                                            router.push('/hop-in')
                                        }}>Log out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>}

                                {!user && <Link href='/auth' ><User size={scroll ? 22 : 25} className='transition-all duration-200 cursor-pointer' color='#202020' /></Link>}

                            </div>

                            <div className='mainMap translate-y-0.5'>
                                <button className='cursor-pointer' onClick={() => setShowMap(true)}><MapPinIcon className={`w-7 h-8 transition-all duration-200`} color={toggleTheme ? '#fefefe' : '#202020'} /></button>
                            </div>
                            {showMap && <div className='relative z-[200]'>
                                <MainMap setShowMap={setShowMap} />
                            </div>}

                            <div className='bar flex items-center'>
                                <Sheet>
                                    <SheetTrigger className='flex items-center'>
                                        <Bars3BottomLeftIcon className={`bar ${scroll ? 'w-[1.40rem] h-[1.40rem]' : 'w-7 h-7'} transition-all duration-200 cursor-pointer`} />
                                    </SheetTrigger>
                                    <SheetContent side='bottom' className='w-full py-20 min-h-screen max-h-screen overflow-y-auto'>
                                        <SheetHeader>
                                            <SheetTitle></SheetTitle>

                                            {navigators && <div className='flex flex-col gap-2'>
                                                {navigators.map((e, index) => {
                                                    return <SideBar key={index} number={index} item={e} />
                                                })}
                                            </div>}

                                        </SheetHeader>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Header
