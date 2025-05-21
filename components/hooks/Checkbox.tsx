import React, { Dispatch, SetStateAction } from 'react'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
    item: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    text: string,
}

const Checkbox: React.FC<Details> = ({ item, setter, text }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme

    return (
        <div className='flex items-center gap-2'>
            <div className={`w-5 h-5 md:w-6 md:h-6 ${toggleTheme? 'bg-[#2d2d2d]': 'bg-[#a8a8a8]'} rounded-full cursor-pointer shadow-md`} onClick={() => setter(!item)}>
                <div className={`w-5 h-5 md:w-6 md:h-6 bg-[#00563c] rounded-full transition-all duration-200`} style={{ transform: item ? 'scale(1)' : 'scale(0)' }}></div>
            </div>

            <h1 className={`inter text-xs md:text-[13px] font-normal ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{text}</h1>
        </div>
    )
}

export default Checkbox
