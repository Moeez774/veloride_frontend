'use client'
import { ArrowLeft, Search, WindIcon, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import { useAuth } from '@/context/AuthProvider'
import { Bars3BottomLeftIcon, MapPinIcon } from '@heroicons/react/16/solid'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import './Commons.css'
import UserProfile from './UserProfile'
import SearchInput from './SearchInput'
import FindARide from './FindARide'
import OfferARide from './OfferARide'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import MyRides from './MyRides'
import EcoStats from './EcoStats'
import MainMap from '../main/MainMap'
import Messages from '../ridesData/Messages'

const Header = () => {

    const pathname = usePathname()
    const router = useRouter()
    const authContext = useAuth()
    const user = authContext?.user || null
    const setUser = authContext?.setUser || undefined

    const [scroll, setScroll] = useState(false)
    const [showHeader, setShowHeader] = useState(true)
    const [showSearchBar, setShowSearchBar] = useState(false)
    const [mobileSearchBar, setMobileSearchBar] = useState(false)

    const [val, setVal] = useState('')
    const [navigators, setNavigators] = useState<any[]>([])
    const [showMap, setShowMap] = useState(false)

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
        if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname === '/find-ride' || pathname === '/offer-ride' || pathname.startsWith('/chats')) {
            setShowHeader(false)
        }
        else if ((window.matchMedia("(max-width: 1023px)").matches) && (pathname.startsWith('/ride-detail'))) {
            setShowHeader(false)
        } 
         else {
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
        
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        setScroll(window.scrollY > 0);
    }, [pathname]);

    if (!showHeader) return null

    return (

        <>

            <div className={`bg-white transition-all duration-200 ${scroll ? 'h-[3rem] md:h-[3.5rem] mt-0' : 'h-[4.5rem] md:h-[5rem] lg:h-[5.5rem] mt-2'} flex max-w-7xl mx-auto items-center px-8 sm:px-10 md:px-12 ${pathname === '/hop-in' ? 'shadow-md' : 'shadow-none'} py-3 rounded-md`}>

                <SearchInput setMobileSearchBar={setMobileSearchBar} mobileSearchBar={mobileSearchBar} val={val} setVal={setVal} setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar} scroll={scroll} />

                <div className='flex justify-between w-full items-center'>

                    <div className='flex items-center gap-6'>
                        {/* logo */}
                        <div className='flex items-center'>
                            <img className={`transition-all duration-200 ${scroll ? 'w-8 md:w-10' : 'w-10 md:w-12'}`} src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                        </div>

                        {/* navigators */}

                        <div className={`searchBar transition-all flex duration-200 items-center gap-1 ${showSearchBar ? 'opacity-0 z-0' : 'opacity-[1] z-20'}`}>
                            <div className='px-6 py-[7px] rounded-md hover:bg-[#eeeeee] cursor-pointer'>
                                <NavigationMenu>
                                    <NavigationMenuList>
                                        <NavigationMenuItem>
                                            <h1 className='exo2 text-sm'>Home</h1>
                                        </NavigationMenuItem>
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </div>
                            <FindARide />
                            <OfferARide />
                            <MyRides />
                            <EcoStats />
                        </div>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='flex items-center relative z-30 gap-6'>
                            <Search size={scroll ? 20 : 23} onClick={() => {

                                setMobileSearchBar(true)

                            }} className='transition-all duration-200 cursor-pointer' style={{ display: !showSearchBar ? 'block' : 'none' }} color='#202020' />

                            <X size={scroll ? 20 : 23} onClick={() => setShowSearchBar(false)} className='transition-all duration-200 cursor-pointer' style={{ display: showSearchBar ? 'block' : 'none' }} color='#202020' />

                            {/* // user's profile and logout access */}
                            <UserProfile logOut={logOut} scroll={scroll} user={user} />

                            <div className='mainMap translate-y-0.5'>
                                <button className='cursor-pointer' onClick={() => setShowMap(true)}><MapPinIcon className={`${scroll? 'w-6 h-7': 'w-7 h-8'} transition-all duration-200`} color='#202020' /></button>
                            </div>
                            { showMap && <div className='relative z-[200]'>
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
