'use client'
import React, { SetStateAction, Dispatch, useState } from 'react'
import countries from '@/public/data/countries.json'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
  number: string,
  setNumber: Dispatch<SetStateAction<string>>,
  country: string,
  setCountry: Dispatch<SetStateAction<string>>,
  error?: string
}

const PhoneInput: React.FC<Details> = ({ number, setNumber, country, setCountry, error }) => {

  const context = getContacts()
  const toggleTheme = context?.toggleTheme
  return (
    <div className='flex w-full flex-col gap-1.5'>
      <label className='text-[13px]'>Phone number</label>
      <div className='flex items-center gap-2'>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className={`w-[130px] border py-6 ${error ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="+1" />
          </SelectTrigger>
          <SelectContent className={`${toggleTheme ? 'bg-[#202020] border border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] border text-[#202020]'} max-h-[300px] overflow-y-auto`}>
            {countries.map((country, index) => (
              <SelectItem key={index} className='flex items-center gap-1' value={country.phone}>
                <img className='w-5' src={country.flag} alt="" />
                {country.phone}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          value={number}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            setNumber(value)
          }}
          type="tel"
          pattern="[0-9]*"
          maxLength={10}
          inputMode="numeric"
          className={`border outline-none font-normal transition-all duration-300 flex gap-3 items-center justify-center rounded-md p-[0.90rem] w-full ${error ? 'border-red-500 focus:border-red-500' : 'border-[#c7c7c7] focus:border-[#00563c]'}`}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}

export default PhoneInput