import { ArrowLeft, Search } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import './Commons.css'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Details {
    scroll: boolean,
    showSearchBar: boolean,
    val: string,
    setVal: Dispatch<SetStateAction<string>>
    setShowSearchBar: Dispatch<SetStateAction<boolean>>,
    setMobileSearchBar: Dispatch<SetStateAction<boolean>>,
    mobileSearchBar: boolean
}

const SearchInput: React.FC<Details> = ({ scroll, showSearchBar, setShowSearchBar, val, setVal, mobileSearchBar, setMobileSearchBar }) => {
    return (

        <>

        {/* // searchbar for screens below 950px */}
            <div>
                <Sheet open={mobileSearchBar} onOpenChange={() => {
                    setMobileSearchBar(false)
                }}>
                    <SheetTrigger className='flex cursor-pointer items-center'></SheetTrigger>
                    <SheetContent side='top' className='w-full py-10 h-screen'>
                        <SheetHeader>
                            <SheetTitle></SheetTitle>
                            <div className='flex bg-[#f0f0f0] rounded-full pl-3 justify-between items-center'>
                                <div className='flex items-center w-full'>

                                    <ArrowLeft size={20} onClick={() => setVal('')} color={val.length > 0 ? '#202020' : 'gray'} className='cursor-pointer transition-all duration-200' />

                                    <input value={val} onChange={(e) => setVal(e.target.value)} type="text" className={`inter text-[#202020] bg-transparent text-sm sm:text-base w-full outline-none py-2 px-2 transition-all duration-200`} placeholder='Best rides for Lahore...' />
                                </div>

                                <div className={` ${'p-3'} cursor-pointer rounded-full transition-all duration-200 hover:bg-[#d6d6d6]`}>
                                    <Search size={18} color='#202020' />
                                </div>
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

        </>
    )
}

export default SearchInput
