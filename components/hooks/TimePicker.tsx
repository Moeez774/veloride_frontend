import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { getContacts } from '@/context/ContactsProvider'

interface Details {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    type?: string
}

const MyTimePicker: React.FC<Details> = ({ value, setValue, type }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const [timeSelection, setTimeSelection] = useState(false)
    const times = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', , '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM']

    return (
        <div className='relative flex'>
            <div className={`relative w-[8.5rem] cursor-pointer flex justify-between items-center ${toggleTheme && type ? 'bg-transparent border-none' : toggleTheme && !type ? 'bg-[#202020] border border-[#2d2d2d]' : !toggleTheme && type ? 'bg-transparent shadow-none border-none' : 'bg-white border shadow-md'} p-3 rounded-md`} onClick={() => setTimeSelection(!timeSelection)}>
                <div className='flex items-center gap-1'>
                    <Clock size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                    <h1 className={`text-sm inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} style={{ userSelect: 'none' }}>{value}</h1>
                </div>
                <ChevronDown size={17} className={`transition-all duration-200 ${timeSelection ? 'rotate-x-180' : 'rotate-x-0'}`} color={toggleTheme ? '#fefefe' : '#202020'} />
            </div>

            <div style={{ transition: 'all 0.05s ease-in-out', transform: timeSelection ? 'scale(1)' : 'scale(0.8)' }} className={`absolute ${timeSelection ? 'z-10 opacity-[1]' : '-z-10 opacity-0'} translate-y-[3rem]`}>
                <ScrollArea className={`h-[200px] ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] text-[#fefefe]' : 'bg-white border text-[#202020]'} -z-10 relative flex flex-col w-[8.5rem] rounded-md p-2`}>
                    {times.map((e, index) => {
                        return (
                            <h1 key={index} onClick={() => {
                                if (timeSelection) {
                                    setValue(e || 'Time')
                                    setTimeSelection(false)
                                }
                            }} className={`text-[15px] ${timeSelection ? 'cursor-pointer' : 'cursor-default'} rounded-md px-2 py-1 ${toggleTheme ? 'hover:bg-[#202020]' : 'hover:bg-gray-100'} transition-all flex items-center justify-between duration-200`}>
                                {e}
                                {value === e && <Check size={15} color={toggleTheme ? '#fefefe' : '#202020'} />}
                            </h1>
                        )
                    })}
                </ScrollArea>
            </div>
        </div>
    );
};

export default MyTimePicker;
