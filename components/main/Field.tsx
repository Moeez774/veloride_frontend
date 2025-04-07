'use client'
import { MapPinIcon } from '@heroicons/react/16/solid'
import { Navigation } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
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
            <div>
                <div className={`bg-[#EAEAEA] px-3 w-[80vw] sm:w-[70vw] md:w-[20rem] lg:w-[22rem] rounded-md border-solid shadow-md flex items-center`}>

                    <input ref={inputRef} value={value || ''} onChange={handleInputChange} type='text' placeholder={placeholder} className={`py-3 placeholder:text-[#a4a4a4] text-sm sm:text-base flex-1 pr-1 outline-none`} onFocus={() => {
                        setShowSearch(true)
                    }} />

                    {placeholder === 'Pickup Location' && <MapPinIcon color={'#979797'} className='h-7 w-7 translate-x-1' />}
                    {placeholder === 'Drop-off Location' && <Navigation size={20} color={'#979797'} className='' />}
                </div>

                <Suggestions setLocation={setLocation} loader={loader} suggestions={suggestions} setValue={setValue} inputRef={inputRef} showSearch={showSearch} setShowSearch={setShowSearch} />
            </div>

        </>
    )
}

export default Field
