"use client"
import React, { Dispatch, SetStateAction } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Details {
  date: string | undefined,
  setDate: Dispatch<SetStateAction<string | undefined>>
}

const DatePicker: React.FC<Details> = ({ date, setDate }) => {
  const [showDate, setShowDate] = React.useState(false)

  return (
    <Popover open={showDate} onOpenChange={() => setShowDate(!showDate)}>
      <PopoverTrigger asChild>
        <div
          className="h-12 text-sm justify-between gap-2 px-3 cursor-pointer flex items-center bg-white rounded-md shadow-md text-[#202020] inter"
        >

          <div className="flex items-center gap-1">
            <CalendarIcon size={20} />
            <div className="translate-y-[0.5px]">{date ? format(date, "PPP") : <span className="text-sm">Pick a date</span>}</div>
          </div>

          <div>
            <ChevronDown size={17} className='transition-all translate-x-[0.5px] duration-200' style={{ transform: showDate ? 'rotateX(180deg)' : 'rotateX(0deg)' }} color='#202020' />          </div>

        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto relative z-[100] p-0">
        <Calendar className="inter"
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
