import React, { Dispatch, SetStateAction } from 'react'

interface Details {
    item: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    text: string,
}

const Checkbox: React.FC<Details> = ({ item, setter, text }) => {
    return (
        <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-[#d4d4d4] rounded-full cursor-pointer shadow-md' onClick={() => setter(!item)}> <div className='w-6 h-6 bg-[#00b37e] rounded-full transition-all duration-200' style={{ transform: item ? 'scale(1)' : 'scale(0)' }}></div> </div>

            <h1 className='inter text-xs font-normal'>{text}</h1>
        </div>
    )
}

export default Checkbox
