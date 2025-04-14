import React, { useState } from 'react'
import './Commons.css'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { ExternalLink } from 'lucide-react';
interface Details {
    number: number;
    item: any;
}

const SideBar: React.FC<Details> = ({ number, item }) => {

    const [showSubs, setShowSubs] = useState(false)

    return (

        <>
            <div onClick={() => setShowSubs(!showSubs)} className='w-full text-[#202020] flex justify-between items-center cursor-pointer px-4'>
                <button className='exo2 py-4 text-xl sm:text-2xl cursor-pointer font-semibold md:text-3xl'>{item.head}</button>

                {number != 0 && <ChevronRightIcon style={{ transition: 'all 0.2s ease-in-out', transform: showSubs ? 'rotate(90deg)' : 'rotate(0deg)' }} className='w-7 h-7' />}
            </div>

            {number != 0 && <div className={`${showSubs ? 'h-[30rem] sm:h-[25rem]' : 'h-0'} mx-4 flex flex-col gap-3 overflow-hidden transition-all duration-200`}>
                {item.subs.map((e: any, index: number) => {
                    return (
                        <div key={index} className='flex py-2 gap-2 w-full justify-between items-center text-[#202020]' style={{ border: 'none', borderTop: index === 0 ? '1px solid #a7a7a7' : 'none', borderBottom: '1px solid #a7a7a7' }}>
                            <div className='flex flex-col gap-0.5'>
                                <h1 className='exo2 font-semibold'>{e.name}</h1>

                                <h1 className='text-sm inter'>{e.about}</h1>
                            </div>

                            <div>
                                <ExternalLink size={22} color='#202020' />
                            </div>
                        </div>
                    )
                })}
            </div>}
        </>
    )
}

export default SideBar
