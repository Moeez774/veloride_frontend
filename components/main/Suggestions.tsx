'use client'
import React, { Dispatch, Ref, SetStateAction, useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
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
            {showSearch && <div ref={searchRef} className='flex justify-center z-[100] items-center absolute'>

                <ScrollArea className="border p-2 h-32 flex justify-center items-center rounded-md shadow-2xl bg-[#fefefe] w-[80vw] sm:w-[20rem] lg:w-[22rem]">

                    {(!suggestions || suggestions.length === 0) && !loader && <h1 className='inter text-center h-[6.3rem] flex justify-center items-center text-[#202020] text-sm'>No results</h1>}

                    {loader && suggestions.length === 0 && <div className='h-[5.8rem] flex justify-center items-center'>
                        <div className="searchLoader"></div>
                    </div>}

                    <div className='flex flex-col items-start w-full'>
                        {suggestions && suggestions.map((e: any, index: number) => {
                            return (
                                <button key={index} onClick={() => {
                                    setLocation({ long: e.geometry.coordinates[0], lat: e.geometry.coordinates[1] })
                                    setValue(`${e.properties.address_line1}, ${e.properties.address_line2}`)
                                    setShowSearch(false)
                                }} className='inter w-full text-start rounded-md cursor-pointer p-2 hover:bg-gray-100 transition-all duration-200 text-[#202020] text-sm'>
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
