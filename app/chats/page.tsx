'use client'
import Chat from '@/app/chats/(Chats)/Chat'
import Contacts from '@/app/chats/(Chats)/Contacts'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { StarIcon } from '@heroicons/react/16/solid'
import { ChevronDown, ChevronLeft, FileWarning, HelpCircle, MoreVertical, Phone, Send } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaShare } from 'react-icons/fa'

const page = () => {

  const router = useRouter()

  //getting data
  const contactsContext = getContacts()
  const contacts = contactsContext?.contacts || null
  const fetchContacts = contactsContext?.fetchContacts
  const authContext = useAuth()
  const user = authContext?.user || null

  const [showMore, steShowMore] = useState(false)
  const [chat, setChat] = useState<any>()
  const [openChat, setOpenChat] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    if (!contacts) return
    setChat(contacts[0])
  }, [contacts])

  useEffect(() => {
   if(fetchContacts) fetchContacts()
  }, [])

  return (
    <div className='flex inter text-[#202020] min-h-screen w-full h-full max-w-[90rem] mx-auto' style={{ overflow: 'hidden' }}>

      {/* //left bar */}
      <div className={`${openChat || showProfile ? 'hidden lg:flex' : 'flex'} w-full lg:w-[15rem] xl:w-[18rem] h-full flex-col relative`}>
        <div className='flex w-full p-1.5 md:p-3 lg:p-0 relative justify-end items-center'>
          <ChevronLeft size={25} onClick={() => router.back()} className='absolute cursor-pointer left-0 m-4' color='#202020' />
          <img className='w-14 mr-3' src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview.png" alt="" />
        </div>

        <div className='flex flex-col gap-4 overflow-y-auto h-[calc(100vh-73px)]' style={{ scrollbarWidth: 'thin' }}>
          <h1 className='font-semibold px-6 text-3xl md:text-4xl lg:text-2xl text-[#202020] exo2'>Chats</h1>

          <hr className='mx-4' style={{ borderColor: '#f0f0f0' }} />

          {/* //first contacts part */}
          <div className={`${showMore ? 'h-auto' : 'h-auto lg:h-[20rem]'} flex flex-col`}>
            <h1 className='inter hidden lg:block text-[13px] px-6 font-medium text-[#c0c0c0]'>Recent Conversations</h1>

            {/* //buttons for mobile screens */}
            <div className='flex lg:hidden gap-3 sm:gap-6 inter font-medium text-[14px] sm:text-[15px] md:text-base md:gap-8 my-4 justify-center'>
              <button className='py-1.5 w-[7.5rem] sm:w-32 md:w-40 rounded-4xl bg-[#00b37e] text-[#fefefe]'>Recents</button>
              <button className='py-1.5 w-[7.5rem] sm:w-32 md:w-40 rounded-4xl bg-[#f0f0f0] text-[#202020]'>Help</button>
            </div>

            {/* //samples */}
            <div className='flex flex-col overflow-hidden gap-2 lg:gap-0 pt-4'>
              {contacts && contacts.map((e, index) => {
                return <Contacts chat={chat} contact={e} setOpenChat={setOpenChat} openChat={openChat} user={user} key={index} setChat={setChat} />
              })}
            </div>

            {contacts && contacts.length > 3 && <h1 onClick={() => steShowMore(!showMore)} className='inter cursor-pointer text-[13px] px-6 mt-1 inter hidden lg:flex items-center gap-1'><ChevronDown style={{ transition: 'all 0.2s ease-in-out', transform: showMore ? 'rotateX(180deg)' : 'rotateX(0deg)' }} size={20} color='#202020' /> {showMore ? 'Less' : 'More'}</h1>}
          </div>

          {/* //third contacts part */}
          <div className='lg:h-[8em] hidden lg:flex flex-col gap-4'>
            <h1 className='inter text-[13px] px-6 font-medium text-[#c0c0c0]'>Safety & Security</h1>

            <div className='flex flex-col gap-1'>
              <h1 className='flex items-center gap-3 inter px-6 py-2.5 cursor-pointer transition-all duration-200 hover:bg-[#f0f0f0] text-sm font-medium'><FileWarning size={23} color='#202020' /> Quick Report</h1>
              <h1 className='flex items-center gap-3 inter py-2 cursor-pointer transition-all duration-200 hover:bg-[#f0f0f0]  px-6 text-sm font-medium'><Phone size={23} color='#202020' /> Emergencey Call</h1>
              <h1 className='flex items-center gap-3 inter py-2 px-6 cursor-pointer transition-all duration-200 hover:bg-[#f0f0f0]  text-sm font-medium'><HelpCircle size={23} color='#202020' /> Help & FAQ</h1>
            </div>
          </div>
        </div>

      </div>

      {/* main chat */}
      <div className={`${openChat ? 'flex' : showProfile && openChat ? 'hidden lg:flex' : 'hidden lg:flex'} flex-1 flex-col bg-[#f0f0f0]`}>
        {chat && <Chat showProfile={showProfile} setShowProfile={setShowProfile} contact={chat} setOpenChat={setOpenChat} setChat={setChat} user={user} />}
      </div>

      {/* //right bar */}
      <div className={`w-full flex-1 justify-center lg:justify-start lg:flex-none lg:w-[14rem] xl:w-[16rem] ${showProfile ? 'flex' : 'hidden lg:flex'} flex-col items-center px-3 gap-6 py-10`}>
        <ChevronLeft size={25} color='#202020' className='cursor-pointer lg:hidden my-6 mx-4 fixed top-0 left-0' onClick={() => {
          setShowProfile(false)
          setOpenChat(true)
        }} />
        {chat && <div className='flex flex-col gap-6'>

          {/* profile */}
          <div className='flex flex-col items-center gap-1.5'>
            {chat.photo?.startsWith("hsl") && (
              <div className={`rounded-full flex justify-center items-center text-white w-32 h-32 sm:h-40 sm:w-40 lg:w-24 lg:h-24`} style={{ background: chat.photo }}>
                <h1 className='inter text-5xl sm:text-6xl lg:text-4xl'>{chat.fullname?.charAt(0).toUpperCase()}</h1>
              </div>
            )}

            {/* user with profile */}
            {!chat.photo?.startsWith("hsl") && (
              <div>
                <img className={`w-32 sm:w-40 md:w-24 transition-all duration-200 rounded-full`} src={chat.photo || undefined} alt="" />
              </div>
            )}
            <h1 className='inter text-2xl sm:text-3xl lg:text-xl font-semibold'>{chat.fullname}</h1>
            <h1 className='flex items-center text-[13px] gap-0.5'>Rated: 4.5<StarIcon className='w-4 h-4' color='#202020' /></h1>
          </div>

          {/* //share */}
          <div className='flex w-52 items-center justify-around'>
            <div className='flex flex-col items-center gap-1.5'>
              <button className='bg-[#f0f0f0] cursor-pointer transition-all duration-200 active:bg-[#e7e7e7] hover:bg-[#f7f6f6] p-3 rounded-full'><FaShare size={20} color='#202020' /></button>
              <h1 className='text-[13px] inter'>Share</h1>
            </div>
            <div className='flex flex-col items-center gap-1.5'>
              <button className='bg-[#f0f0f0] cursor-pointer transition-all duration-200 active:bg-[#e7e7e7] hover:bg-[#f7f6f6] p-3 rounded-full'><Phone size={20} color='#202020' /></button>
              <h1 className='text-[13px] inter'>Call</h1>
            </div>
          </div>

        </div>}
        {/* buttons */}
        {chat && <div className='text-[#00b37e] max-w-sm w-full text-start text-sm font-medium flex flex-col gap-3 mt-4'>
          <button className='bg-[#f0f0f0] py-4 rounded-lg cursor-pointer transition-all duration-200 active:bg-[#e7e7e7] hover:bg-[#f7f6f6] text-start px-4'>Block User</button>
          <button className='bg-[#f0f0f0] py-4 rounded-lg cursor-pointer transition-all duration-200 active:bg-[#e7e7e7] hover:bg-[#f7f6f6] text-start px-4'>Feedback & Reviews</button>
          <button className='bg-[#f0f0f0] py-4 rounded-lg cursor-pointer transition-all duration-200 active:bg-[#e7e7e7] hover:bg-[#f7f6f6] text-start px-4'>Recent Ride</button>
        </div>}
      </div>

    </div>
  )
}

export default page
