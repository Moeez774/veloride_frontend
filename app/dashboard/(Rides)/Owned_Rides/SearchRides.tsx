'use client'
import { Search, Sliders } from 'lucide-react'
import React, { useEffect, useRef, useState, forwardRef } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MyTimePicker from '@/components/hooks/TimePicker'

interface SearchRidesProps {
    toggleTheme: boolean;
    activeRides: any[];
    setActiveRides: any;
}

const SearchRides = forwardRef<HTMLDivElement, SearchRidesProps>(({ toggleTheme, activeRides, setActiveRides }, ref) => {
    const [search, setSearch] = useState('')
    const [filteredRides, setFilteredRides] = useState(activeRides)
    const isFetched = useRef(false)
    const [placeHolder, setPlaceHolder] = useState('by ID')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isFetched.current && activeRides.length > 0) {
            setFilteredRides(activeRides)
            isFetched.current = true
        }
    }, [activeRides])

    useEffect(() => {
        if (search != '' && placeHolder === 'by ID') {
            setActiveRides(filteredRides.filter((ride) => ride._id.toLowerCase().slice(-5).includes(search.toLowerCase())))
        }
        else if (search != '' && placeHolder === 'by Status') {
            setActiveRides(filteredRides.filter((ride) => ride.status.toLowerCase().includes(search.toLowerCase())))
        }
        else if (search != '' && placeHolder === 'by Date') {
            setActiveRides(filteredRides.filter((ride) => ride.createdAt.toLowerCase().includes(search.toLowerCase())))
        }
        else if (search != '' && placeHolder === 'by Time') {
            setActiveRides(filteredRides.filter((ride) => ride.rideDetails.time.toLowerCase().includes(search.toLowerCase())))
        }
        else {
            setActiveRides(filteredRides)
        }
    }, [search])

    const handleDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className={`mt-4 flex px-3 items-center gap-2 w-full ${toggleTheme ? 'bg-[#000000] text-[#b1b1b1]' : 'bg-[#fefefe] text-[#5b5b5b]'}`}>
            <div className='flex flex-1 gap-1 items-center'>
                <Search size={20} />
                {placeHolder != 'by Time' ? <input type='text' placeholder={`Search ${placeHolder}`} className={`w-full text-[15px] bg-transparent px-2 py-2.5 outline-none ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} value={search} onChange={(e) => setSearch(e.target.value)} /> : <MyTimePicker value={search === "" ? '12:00 AM' : search} type='normal' setValue={setSearch} />}
            </div>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className='outline-none cursor-pointer' onClick={handleDropdownClick}>
                    <Sliders size={20} className='rotate-90' />
                </DropdownMenuTrigger>
                <DropdownMenuContent ref={ref} className={`${toggleTheme ? 'bg-[#202020] border-[#353535] border text-[#fefefe]' : 'border bg-[#fefefe] text-[#202020]'}`} onClick={handleDropdownClick}>
                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setPlaceHolder('by ID')
                    }}>By ID</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setPlaceHolder('by Status')
                    }}>By Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setPlaceHolder('by Date')
                    }}>By Date</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setPlaceHolder('by Time')
                    }}>By Time</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
})

SearchRides.displayName = 'SearchRides'

export default SearchRides