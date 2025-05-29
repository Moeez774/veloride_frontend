import React, { SetStateAction, Dispatch, useState } from 'react'
import countries from '@/public/data/countries.json'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toggleTheme } from '@/app/(HomePage)/MainMap'

const PhoneInput = ({ number, setNumber, country, setCountry }: { number: string, setNumber: Dispatch<SetStateAction<string>>, country: string, setCountry: Dispatch<SetStateAction<string>> }) => {

  return (
    <div className='flex items-end gap-2 w-full'>

      <Select value={country} onValueChange={setCountry}>
        <SelectTrigger className="w-[140px] py-6">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent className={`w-[140px] max-h-[300px] overflow-y-auto ${toggleTheme() ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020]'} border`}>
          {countries.map((country) => (
            <SelectItem key={country.code} className='flex items-center gap-2' value={country.phone}>
              <img src={country.flag} alt={country.name} className='w-4 h-4' /> {country.phone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className='flex flex-col w-full gap-1.5'>
        <label className='text-[13px]'>Phone number</label>
        <input value={number} maxLength={10} onChange={(e) => setNumber(e.target.value)} className='border outline-none font-normal focus:shadow-lg transition-all duration-300 flex gap-3 items-center justify-center border-[#c7c7c7] rounded-md shadow-sm p-[0.90rem] w-full' />
      </div>
    </div>
  )
}

export default PhoneInput