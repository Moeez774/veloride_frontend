'use client'
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { User2, Car, Wallet, Leaf, HelpCircle, Settings, ArrowLeft } from 'lucide-react'

const Navigators = ({ icon, value, activeValue, setActiveValue, toggleTheme, setShowSideBar }: { icon: any, value: string, activeValue: string | null, setActiveValue: Dispatch<SetStateAction<string | null>>, toggleTheme: boolean | undefined, setShowSideBar: Dispatch<SetStateAction<boolean>> }) => {
    return (
        <Link href={`/dashboard?page=${value}`}><button onClick={() => setShowSideBar(false)} className={`p-2 cursor-pointer rounded-full ${activeValue === value && !toggleTheme ? 'bg-[#f7f7f7]' : activeValue === value && toggleTheme ? 'bg-[#202020]' : 'bg-transparent'}`}>
            {icon}
        </button></Link>
    )
}

const Sidebar = ({ toggleTheme, setShowSideBar }: { toggleTheme: boolean | undefined, setShowSideBar: Dispatch<SetStateAction<boolean>> }) => {
    const [activePage, setActivePage] = useState<string | null>('profile')
    const queries = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        if (!queries.get("page")) return
        setActivePage(queries.get("page") || null)
    }, [queries])
    return (
        <div className={`${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] md:border-none' : 'bg-[#fefefe] border border-[#f0f0f0] md:border'}  flex flex-col items-center justify-between py-8 h-[97vh] rounded-full w-24`}>
            <div className='flex w-full px-4 items-center flex-col gap-6'>

                {/* logo */}
                <div className='flex items-center'>
                    <img className={`transition-all cursor-pointer duration-200 w-10`} onClick={() => router.push("/")} src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
                </div>

                <hr className='w-full' style={{ borderColor: toggleTheme ? '#202020' : '#f0f0f0' }} />

                <div className='flex flex-col gap-4'>
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='profile' icon={<User2 size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='rides' icon={<Car size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='wallet' icon={<Wallet size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='rewards' icon={<Leaf size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='help' icon={<HelpCircle size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                    <Navigators toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} activeValue={activePage} setActiveValue={setActivePage} value='settings' icon={<Settings size={20} style={{ strokeWidth: '1' }} color={toggleTheme ? '#fefefe' : '#202020'} />} />
                </div>

            </div>

            <button onClick={() => router.back()} className={`${toggleTheme ? 'bg-[#202020] hover:bg-[#202020cc]' : 'bg-[#f0f0f0] hover:bg-[#f7f7f7]'} cursor-pointer items-center flex flex-col p-3 rounded-full`}>
                <ArrowLeft size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
            </button>
        </div>
    )
}

export default Sidebar