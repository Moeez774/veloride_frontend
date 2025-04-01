import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import times from './Times';

interface Details {
    value: string,
    setValue: Dispatch<SetStateAction<string>>
}

const MyTimePicker: React.FC<Details> = ({ value, setValue }) => {
    const [timeSelection, setTimeSelection] = useState(false)


    return (
        <div className='relative flex '>
            <div className='relative w-[8.5rem] cursor-pointer flex justify-between items-center bg-white p-3 rounded-md shadow-md' onClick={() => setTimeSelection(!timeSelection)}>

                <div className='flex items-center gap-1'>
                    <Clock size={20} color='#202020' />
                    <h1 className='text-sm inter' style={{ userSelect: 'none' }}>{value}</h1>
                </div>

                <ChevronDown size={17} className={`transition-all  duration-200 ${timeSelection? 'rotate-x-180': 'rotate-x-0'}`} color='#202020' />

            </div>

            <div style={{ transition: 'all 0.05s ease-in-out', transform: timeSelection? 'scale(1)': 'scale(0.8)' }} className={`absolute ${timeSelection ? 'z-10 opacity-[1]' : '-z-10 opacity-0'} translate-y-[3rem]`}>
                <ScrollArea className="h-[200px] bg-white -z-10 relative flex flex-col w-[8.5rem] rounded-md border p-2">
                    {times.map((e, index) => {
                        return (
                            <h1 key={index} onClick={() => {
                                if (timeSelection) {
                                    setValue(e || 'Time')
                                    setTimeSelection(false)
                                }
                            }} className={`text-[15px] ${timeSelection ? 'cursor-pointer' : 'cursor-default'} rounded-md px-2 py-1 hover:bg-gray-100 transition-all flex items-center justify-between duration-200`}>

                                {e}

                                {value === e && <Check size={15} color='#202020' />}
                            </h1>
                        )
                    })}
                </ScrollArea>
            </div>
        </div>
    );
};

export default MyTimePicker;
