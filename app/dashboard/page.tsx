'use client'
import React, { useState, useRef, useEffect } from 'react'
import Dashboard from './(Dashboard)/Dashboard'
import Sidebar from './(Dashboard)/Sidebar'
import { getContacts } from '@/context/ContactsProvider'

const page = () => {
  const themeContext = getContacts()
  const toggleTheme = themeContext?.toggleTheme

  const [showSideBar, setShowSideBar] = useState(false)
  const sideBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if(sideBarRef.current && !sideBarRef.current.contains(e.target as Node)) {
        setShowSideBar(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  return (
    <div className={`inter min-h-screen gap-4 overflow-hidden flex w-full ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]' }`}>
      <div ref={sideBarRef} className={`py-2 absolute z-30 md:relative transition-all ${showSideBar? 'translate-x-0': '-translate-x-28 md:translate-x-0'} duration-200 pl-2`}>
        <Sidebar toggleTheme={toggleTheme} setShowSideBar={setShowSideBar} />
      </div>

      <div className='flex-1 py-2 px-2 w-full'>
        <Dashboard setShowSideBar={setShowSideBar} showSideBar={showSideBar} toggleTheme={toggleTheme}  />
      </div>
    </div>
  )
}

export default page