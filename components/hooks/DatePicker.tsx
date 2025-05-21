"use client"
import React, { Dispatch, SetStateAction } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getContacts } from '@/context/ContactsProvider'

interface Details {
  date: string | undefined,
  setDate: Dispatch<SetStateAction<string | undefined>>
}

const DatePicker: React.FC<Details> = ({ date, setDate }) => {
  const context = getContacts()
  const toggleTheme = context?.toggleTheme
  const [showDate, setShowDate] = React.useState(false)

  return (
    <Popover open={showDate} onOpenChange={() => setShowDate(!showDate)}>
      <PopoverTrigger asChild>
        <div
          className={`h-12 text-sm justify-between gap-2 px-3 cursor-pointer flex items-center ${toggleTheme ? 'bg-[#202020] border border-[#2d2d2d] text-[#fefefe]' : 'bg-white text-[#202020]'} rounded-md shadow-md inter`}
        >
          <div className="flex items-center gap-1">
            <CalendarIcon size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
            <div className="translate-y-[0.5px]">{date ? format(date, "PPP") : <span className="text-sm">Pick a date</span>}</div>
          </div>

          <div>
            <ChevronDown size={17} className='transition-all translate-x-[0.5px] duration-200' style={{ transform: showDate ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color={toggleTheme ? '#fefefe' : '#202020'} />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className={`w-full relative z-[100] p-0 ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] text-[#fefefe]' : 'bg-white text-[#202020]'}`}>
        <Calendar className={`inter w-full ${toggleTheme ? 'dark' : ''}`}
          mode="single"
          selected={date ? new Date(date) : undefined}
          onSelect={(day) => setDate(day ? day.toISOString() : undefined)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker
