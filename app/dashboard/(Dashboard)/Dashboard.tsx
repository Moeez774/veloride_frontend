'use client'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthProvider'
import Profile from './Pages/Profile'
import { DownloadCloud, Menu } from 'lucide-react'
import Rides from './Pages/Rides'
import Wallet from './Pages/Wallet'

const Dashboard = ({ toggleTheme, setShowSideBar, showSideBar }: { toggleTheme: boolean | undefined, setShowSideBar: Dispatch<SetStateAction<boolean>>, showSideBar: boolean }) => {
  const [activePage, setActivePage] = useState<string | null>('profile')
  const queries = useSearchParams()
  const authContext = useAuth()
  const user = authContext?.user || null
  const today = new Date()

  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    if (!queries.get("page")) return
    setActivePage(queries.get("page") || null)
  }, [queries])
  return (
    <div className={`h-[97vh] pt-6 w-full gap-4 flex flex-col ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>

      <div className='flex flex-col w-full sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center'>
        {user && <h1 className='flex items-center ml-2 xl:ml-0 gap-1 text-2xl'><Menu onClick={() => setShowSideBar(true)} size={23} className='mr-2 cursor-pointer xl:hidden' color={toggleTheme ? '#fefefe' : '#202020'} /> Welcome back, <p className='font-semibold'>{user?.fullname ? user?.fullname.split(" ")[0] : ""}!</p></h1>}

        {activePage === 'wallet' && <div className='mr-1 xl:mr-6 flex items-center gap-2'>
          <div className={`rounded-md py-2.5 px-[0.90rem] ${toggleTheme ? 'bg-[#0d0d0d] border-[#202020]' : 'bg-[#fefefe] border'}`}>
            <h1 className='font-medium text-sm md:text-base'>{formattedDate}</h1>
          </div>
        </div>}
      </div>

      {showSideBar && <div className='absolute z-20 w-full left-0 top-0 h-screen' style={{ background: 'rgba(0, 0, 0, 0.2)' }}></div>}

      {user && <div className='inter flex-1 w-full max-h-[calc(100vh-90px)]'>
        {activePage === 'profile' && <Profile toggleTheme={toggleTheme} user={user} />}
        {activePage === 'rides' && <Rides toggleTheme={toggleTheme} user={user} />}
        {activePage === 'wallet' && <Wallet formattedDate={formattedDate} toggleTheme={toggleTheme} user={user} />}
      </div>}
    </div>
  )
}

export default Dashboard