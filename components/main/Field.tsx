'use client'
import { MapPinIcon } from '@heroicons/react/16/solid'
import { Navigation } from 'lucide-react'
import { getContacts } from '@/context/ContactsProvider'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import './Main.css'
import Suggestions from './Suggestions'
interface Details {
    placeholder: string,
    showSearch: boolean,
    setShowSearch: Dispatch<SetStateAction<boolean>>,
    value: string | null,
    setValue: Dispatch<SetStateAction<string | null>>,
    setLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>
}

const Field: React.FC<Details> = ({ placeholder, showSearch, setShowSearch, setValue, value, setLocation }) => {

    const inputRef = useRef<any>(null)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loader, setLoader] = useState(false)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setValue(inputValue);

        if (inputValue.length > 1) {
            setLoader(true)  // Use the new value directly
            try {
                const requestOptions = {
                    method: 'GET',
                }

                const a = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=7c961581499544e085f28a826bf9ebeb`, requestOptions)

                const response = await a.json()
                setLoader(false)
                setSuggestions(response.features)

            } catch (err) {
                setLoader(false)
                alert("Error fetching locations: " + err)
            }
        } else {
            setLoader(false)
            setSuggestions([])
        }
    }

    return (
        <>
            <div className='relative w-full'>
                <div className={`${toggleTheme? 'bg-[#0c0c0c] border-[#5b5b5b]': 'bg-[#fefefe]'} pr-4 pl-6 w-full rounded-full border-solid border flex items-center`}>

                    <input ref={inputRef} value={value || ''} onChange={handleInputChange} type='text' placeholder={placeholder} className={`py-[0.90rem] placeholder:text-[#a4a4a4] text-sm lg:text-[15px] font-medium flex-1 pr-1 outline-none`} onFocus={() => {
                        setShowSearch(true)
                    }} />

                    {placeholder === 'Enter pickup location' && <MapPinIcon color={'#979797'} className='h-6 w-6 translate-x-1' />}
                    {placeholder === 'Enter drop-off location' && <Navigation size={18} color={'#979797'} className='' />}
                </div>

                <Suggestions setLocation={setLocation} loader={loader} suggestions={suggestions} setValue={setValue} inputRef={inputRef} showSearch={showSearch} setShowSearch={setShowSearch} />
            </div>
        </>
    )
}

export default Field
