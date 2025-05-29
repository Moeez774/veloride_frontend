'use client'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import Checkout from './components/Checkout'

const page = () => {
  const searchParams = useSearchParams()
  const rideId = searchParams.get('rideId')
  const amount = searchParams.get('amount') || '0'
  const by = searchParams.get('by')
  const to = searchParams.get('to')
  const authContext = useAuth()
  const user = authContext?.user
  const context = getContacts()
  const toggleTheme = context?.toggleTheme

  return (
    <div className={`mt-28 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#000000]'}`}>
      <Checkout rideId={rideId} amount={amount} by={by} to={to} toggleTheme={toggleTheme} />
    </div>
  )
}

export default page