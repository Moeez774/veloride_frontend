'use client'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getContacts } from '@/context/ContactsProvider'

const SelectOptions = ({ placeholder, options, styles, value, setValue, contentStyles }: { placeholder: string, options: string[], styles: string, value: string, setValue: (value: string) => void, contentStyles?: string }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    return (
        <div>
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger className={`${styles} outline-none cursor-pointer shadow-none`}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className={`${contentStyles} max-h-[300px] overflow-y-auto outline-none shadow-none`}>
                    {options.map((option, index) => (
                        <SelectItem className={`${toggleTheme ? 'hover:bg-[#353535] hover:text-[#fefefe]' : 'hover:bg-[#f0f0f0] hover:text-[#202020]'} cursor-pointer`} key={index} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectOptions