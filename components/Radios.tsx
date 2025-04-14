import React, { Dispatch, SetStateAction } from 'react'
interface Details {
    item: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    text: string,
    arr: any[],
    setItemName: Dispatch<SetStateAction<string>>
}

const Radios: React.FC<Details> = ({ item, setter, text, arr, setItemName }) => {
    return (
        <div className='flex items-center gap-2'>
            <div className='w-5 h-5 sm:w-6 sm:h-6 bg-[#a8a8a8] rounded-full cursor-pointer shadow-md' onClick={() => {
                setItemName(text)
                arr.forEach(type => type(type===setter))
            }}> <div className='w-6 h-6 bg-[#00563c] rounded-full transition-all duration-200' style={{ transform: item ? 'scale(1)' : 'scale(0)' }}></div> </div>

            <h1 className='inter text-[13px] font-normal'>{text}</h1>
        </div>
    )
}

export default Radios
