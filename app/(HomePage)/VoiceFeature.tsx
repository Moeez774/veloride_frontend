'use client'
import { getContacts } from '@/context/ContactsProvider'
import React from 'react'
import { FaSoundcloud } from 'react-icons/fa'

const VoiceFeature = ({ ref }: { ref: React.RefObject<HTMLDivElement | null> }) => {
  const context = getContacts()
  const toggleTheme = context?.toggleTheme

  return (
    <div className={`max-w-7xl relative h-fit py-10 flex items-center justify-between mx-auto w-full px-8 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>

      <div>
        <img className='w-[350px]' src="/Images/Voice assistant-pana.svg" alt="" />
      </div>

      <div className='flex flex-col items-center text-center gap-1 w-1/2'>
        <h1 className='text-[2.5rem] font-semibold'>Just Say It. We'll Do It</h1>
        <p className='text-sm w-96'>
          Find rides and get things done hands-free with voice commands.
        </p>
        <button onClick={() => {
          ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }} className='bg-[#00563c] cursor-pointer hover:bg-[#00563c]/80 transition-all duration-300 active:bg-[#00563c]/60 flex items-center gap-2 text-white px-8 font-semibold mt-6 py-3 rounded-full'>
          Try it now <FaSoundcloud className='text-2xl' />
        </button>
      </div>

      <div>
        <img className='w-[350px]' src="/Images/Voice assistant-cuate.svg" alt="" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>

    </div>
  )
}

export default VoiceFeature