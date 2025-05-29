'use client'
import React, { useState, useEffect } from 'react'
import { Heart, History, Sparkles, TrendingUp, MapPin, SlidersHorizontal, Eraser, ChevronLeft, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Recents from '@/app/find-ride/saved-routes/(Saved_Routes)/Recents'
import Nearby from '@/app/find-ride/saved-routes/(Saved_Routes)/Nearby'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
const page = () => {

    const router = useRouter()
    const authContext = useAuth()
    const user = authContext?.user || null
    const userLocation = authContext?.userLocation || null

    const tabs = [{ tab: "Recents", icon: <History size={25} />, name: "Recent Searches" }, { tab: "Favorites", icon: <Heart size={25} />, name: "Favorites" }, { tab: "Veli's Tips", icon: <Sparkles size={25} />, name: "Veli's Suggestions" }, { tab: "Nearby Routes", icon: <MapPin size={25} />, name: "Nearby Routes" }, { tab: "Trending", icon: <TrendingUp size={25} />, name: "Trending Routes" }]

    // tabs is on for first element and off for others
    const [tab, setTab] = useState(tabs.map((i, index) => {
        return index === 0 ? true : false
    }))
    const [currentTab, setCurrentTab] = useState(0)
    const [currTabName, setCurrTabName] = useState('Recent Searches')
    const [recentSearches, setRecentSearches] = useState<any[]>([])
    const [nearRides, setNearRides] = useState<any[]>([])
    // state to track favorites by rideId
    const [isFavoriteMap, setIsFavoriteMap] = useState<{ [key: string]: boolean }>({})
    const [isNearMap, setIsNearMap] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            let a = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-routes/get-recents`, {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId: user?._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) setRecentSearches(response.data)
            else alert(response.message)
        }

        fetchData()
    }, [user])

    // fetch favorite by rideId
    const checkFavorite = async (rideId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-routes/get-favorite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: rideId })
            })

            const data = await res.json()
            setIsFavoriteMap(prev => ({
                ...prev,
                [rideId]: data.isFavorite
            }))
        } catch (error) {
            console.error("Failed to check favorite:", error)
        }
    }

    const getMap = (screen: string, pickupLocation: number[], dropoffLocation: number[]) => {
        const pickup = `${pickupLocation[0]},${pickupLocation[1]}`
        const dropoff = `${dropoffLocation[0]},${dropoffLocation[1]}`

        const img = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+000(${pickup}),pin-l+f00(${dropoff})/auto/${screen}?access_token=pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw`

        return img
    }

    return (
        <div className='inter md:pt-32 text-[#202020] flex flex-col items-center relative max-w-8xl w-full mx-auto'>
            <hr className='w-full' style={{ borderColor: '#f0f0f0' }} />

            {/* //switchable tabs */}
            <div className='my-6 md:my-3 max-w-[83rem] flex justify-between px-5 w-full'>

                {/* //making top bar for mobile screens */}
                <button onClick={() => router.back()} className='bg-[#f0f0f0] md:hidden transition-all duration-200 active:bg-[#e0e0e0] cursor-pointer p-3 rounded-full'><ChevronLeft size={25} color='#202020' /></button>

                <div className='flex md:hidden items-center gap-4'>
                    <button className='bg-[#f0f0f0] md:hidden transition-all duration-200 active:bg-[#e0e0e0] cursor-pointer p-3 rounded-full'><Heart size={25} color='#202020' /></button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className='outline-none'>
                            <button className='bg-[#f0f0f0] md:hidden transition-all duration-200 active:bg-[#e0e0e0] cursor-pointer p-3 rounded-full flex items-center'><MoreVertical size={25} color='#202020' /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='inter rounded-3xl p-2 font-medium -translate-x-10'>
                            <DropdownMenuItem className='flex cursor-pointer items-center gap-1'><SlidersHorizontal size={35} color='#202020' /> Filter</DropdownMenuItem>
                            <DropdownMenuItem className='flex cursor-pointer items-center gap-1'><Eraser size={35} color='#202020' /> Clear all</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className='hidden md:flex items-center gap-6 lg:gap-8'>
                    {tabs.map((e, index) => {
                        return (
                            <div key={index} className='px-1.5 cursor-pointer pt-2' onMouseEnter={() => {
                                setTab(tab.map((i, iindex) => {
                                    return iindex === index ? true : false
                                }))
                            }} onMouseLeave={() => {
                                setTab(tab.map((i, iindex) => {
                                    return iindex === currentTab ? true : false
                                }))
                            }} onClick={() => {
                                setCurrentTab(index)
                                setCurrTabName(e.name)
                                setTab(tab.map((i, iindex) => {
                                    return iindex === index ? true : false
                                }))
                            }}>
                                <div className={`flex flex-col transition-all duration-200 ${currentTab === index || tab[index] ? 'text-[#202020]' : 'text-[#969696]'} items-center gap-2 pb-4 rounded-md`}>
                                    {e.icon}
                                    <h1 className='text-[13px] font-medium'>{e.tab}</h1>
                                </div>
                                <div className={`w-full h-[2px] ${currentTab === index ? 'bg-[#202020] opacity-[1]' : currentTab != index && tab[index] ? 'opacity-[1] bg-[#f0f0f0]' : 'opacity-[0]'}`}></div>
                            </div>
                        )
                    })}
                </div>

                {/* btns */}
                <div className='hidden md:flex items-center gap-2'>
                    <button className='rounded-xl text-xs lg:text-[13px] hover:border-[#202020] transition-all duration-200 font-medium cursor-pointer p-3 lg:p-4 border border-[#d0d0d0] flex items-center gap-1'><SlidersHorizontal size={18} color='#202020' /> Filters</button>
                    <button className='rounded-xl text-xs lg:text-[13px] font-medium hover:border-[#202020] transition-all duration-200 cursor-pointer p-3 lg:p-4 border border-[#d0d0d0] flex items-center gap-1'><Eraser size={18} color='#202020' /> Clear all</button>
                </div>
            </div>

            {/* main content */}
            <div className='md:mt-10 max-w-[83rem] px-5 mx-auto w-full flex flex-col gap-5'>

                <div className='flex flex-col justify-end gap-5 h-[12.5rem] md:h-auto'>
                    <h1 className='text-5xl w-20 md:w-auto md:text-2xl text-[#202020] font-medium'>{currTabName}</h1>

                    {/* //tabs for mobile */}
                    <div className="flex w-full overflow-x-auto md:hidden items-center gap-1 md:gap-6 lg:gap-8 scrollbar-hide whitespace-nowrap">
                        {tabs.map((e, index) => (
                            <div
                                key={index}
                                className={`flex ${currentTab === index ? 'border border-[#202020]' : 'border-none'} items-center gap-1 bg-[#f0f0f0] py-3 px-5 rounded-full cursor-pointer shrink-0`}
                                onMouseEnter={() => {
                                    setTab(tab.map((i, iindex) => iindex === index));
                                }}
                                onMouseLeave={() => {
                                    setTab(tab.map((i, iindex) => iindex === currentTab));
                                }}
                                onClick={() => {
                                    setCurrentTab(index);
                                    setCurrTabName(e.name);
                                    setTab(tab.map((i, iindex) => iindex === index));
                                }}
                            >
                                {e.icon}
                                <h1 className="text-[13px] font-medium">{e.tab}</h1>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recents */}
                {(currentTab === 0 || currentTab === 1) && <Recents checkFavorite={checkFavorite} getMap={getMap} setIsFavoriteMap={setIsFavoriteMap} isFavoriteMap={isFavoriteMap} recentSearches={recentSearches} currentTab={currentTab} />}

                {currentTab === 3 && <Nearby isNearMap={isNearMap} getMap={getMap} setIsNearMap={setIsNearMap} currentTab={currentTab} nearRides={nearRides} setNearRides={setNearRides} userLocation={userLocation} user={user} />}

            </div>

        </div>
    )
}

export default page