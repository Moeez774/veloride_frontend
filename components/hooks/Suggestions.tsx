'use client'
import React, { Dispatch, Ref, SetStateAction, useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { getContacts } from '@/context/ContactsProvider'
interface Details {
    setValue: Dispatch<SetStateAction<string | null>>,
    loader: boolean,
    suggestions: any[],
    setShowSearch: Dispatch<SetStateAction<boolean>>,
    showSearch: boolean,
    inputRef: any,
    setLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>
}

const Suggestions: React.FC<Details> = ({ loader, setValue, suggestions, showSearch, setShowSearch, inputRef, setLocation }) => {

    const searchRef = useRef<HTMLDivElement>(null)
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    // for handling outside clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if ((inputRef?.current && !inputRef?.current.contains(e.target as Node)) && (searchRef.current && !searchRef.current.contains(e.target as Node))) {
                setShowSearch(false)
            }
        }

        window.addEventListener("mousedown", handleClick)

        return () => {
            window.removeEventListener("mousedown", handleClick)
        }

    }, [setShowSearch])
    return (
        <>
            {showSearch && <div ref={searchRef} className='flex w-full justify-center z-[100] items-center absolute'>

                <ScrollArea className={`w-full border p-2 h-32 flex justify-center items-center rounded-md shadow-2xl ${toggleTheme? 'bg-[#0c0c0c] border-[#5b5b5b] text-[#fefefe]': 'bg-[#fefefe] text-[#202020]'}`}>

                    {(!suggestions || suggestions.length === 0) && !loader && <h1 className='inter text-center h-[6.3rem] flex justify-center items-center font-normal text-sm'>No results</h1>}

                    {loader && suggestions.length === 0 && <div className='h-[5.8rem] flex justify-center items-center'>
                        <div className={`${toggleTheme? 'darksearchLoader': 'searchLoader'}`}></div>
                    </div>}

                    <div className='flex font-normal flex-col items-start w-full'>
                        {suggestions && suggestions.map((e: any, index: number) => {
                            return (
                                <button key={index} onClick={() => {
                                    setLocation({ long: e.geometry.coordinates[0], lat: e.geometry.coordinates[1] })
                                    setValue(`${e.properties.address_line1}, ${e.properties.address_line2}`)
                                    setShowSearch(false)
                                }} className={`inter w-full text-start rounded-md cursor-pointer p-2 ${toggleTheme? 'hover:bg-[#202020]': 'hover:bg-gray-100'} text-sm`}>
                                    {e.properties.address_line1}, {e.properties.address_line2}
                                </button>

                            )
                        })}
                    </div>
                </ScrollArea>
            </div>}
        </>
    )
}

export default Suggestions
