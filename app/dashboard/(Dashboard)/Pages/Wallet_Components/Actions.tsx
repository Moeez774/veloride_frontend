'use client'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CreditCard, EllipsisVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthProvider'
import Link from 'next/link'

const Actions = ({ transaction, toggleTheme }: { transaction: any, toggleTheme: boolean | undefined }) => {
    const [open, setOpen] = useState(false)
    const authContext = useAuth()
    const [issue, setIssue] = useState('')
    const [description, setDescription] = useState('')
    const user = authContext?.user

    const issuesOfPassengers = [
        "Passenger no-show",
        "Late cancellation",
        "Cash not paid",
        "Misbehavior/Abuse",
        "Excessive delay",
        "Wrong location",
        "Other"
    ]

    const issuesOfDrivers = [
        "Ride not completed",
        "Driver misbehavior",
        "Overcharged fare",
        "Paid but still pending",
        "Request refund",
        "Other"
    ]

    const handleReportIssue = async () => {
        if (issue === '') {
            alert('Please select an issue')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes/report`, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    issueType: issue,
                    description: description,
                    reportAgainstId: transaction.driverId ? transaction.driverId : transaction.passengerId,
                    reportById: user?._id,
                    rideId: transaction.rideId,
                    from: transaction.driverId ? "passenger" : "driver",
                    against: transaction.driverId ? "driver" : "passenger",
                    file: "nothing"
                })
            })

            const data = await response.json()
            if (data.statusCode === 200) {
                alert(data.message)
                setOpen(false)
            } else {
                alert(data.message)
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className={`max-h-[90vh] overflow-y-auto ${toggleTheme ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'}`}>
                    <DialogHeader>
                        <DialogTitle>Report issue</DialogTitle>
                        <div className='font-medium flex flex-col gap-y-4 mt-4'>
                            <h1 className='text-sm'>Ride ID: #{transaction.rideId.slice(-5)}</h1>

                            <div className='flex flex-col gap-y-1'>
                                <label htmlFor="issue" className='text-sm '>Issue type</label>
                                <Select value={issue} onValueChange={setIssue}>
                                    <SelectTrigger className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'} w-full`}>
                                        <SelectValue placeholder="Select issue" />
                                    </SelectTrigger>
                                    <SelectContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020]'}`}>
                                        {transaction.driverId ? issuesOfDrivers.map((issue: string, index: number) => <SelectItem key={index} value={issue.split(' ').join('_').toLowerCase()} className={`${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#f0f0f0]'}`}>{issue}</SelectItem>) : issuesOfPassengers.map((issue: string, index: number) => <SelectItem key={index} value={issue.split(' ').join('_').toLowerCase()} className={`${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#f0f0f0]'}`}>{issue}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='mt-2 flex flex-col gap-y-1'>
                                <label htmlFor="issue" className='text-sm flex items-center gap-x-1'>Description <p className={`text-xs ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>(Optional)</p></label>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Describe the issue' className={`resize-none h-[15em] ${toggleTheme ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'}`} />
                            </div>

                        </div>
                    </DialogHeader>
                    <DialogFooter className='flex gap-x-2 mt-4'>
                        <Button variant='outline' className={`cursor-pointer ${toggleTheme ? 'hover:bg-[#353535] bg-[#202020] border-[#353535] text-[#fefefe] hover:text-[#fefefe]' : 'hover:bg-[#f0f0f0] border text-[#202020]'}`} onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className='bg-[#00563c] cursor-pointer hover:bg-[#00563c]/80' onClick={handleReportIssue}>Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            <DropdownMenu>
                <DropdownMenuTrigger className={`${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#d0d0d0]'} outline-none cursor-pointer p-1.5 rounded-full`}>
                    <EllipsisVertical size={18} color={toggleTheme ? '#fefefe' : '#202020'} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe] border-[#353535]' : 'bg-[#fefefe] text-[#202020] border'}`}>
                    {transaction.driverId && transaction.type === 'ride_payment' &&
                    <Link href={`/checkout?rideId=${transaction.rideId}&amount=${transaction.amount}&by=${user?._id}&to=${transaction.driverId}`}><DropdownMenuItem className='cursor-pointer'>
                        <button className='flex items-center gap-2'>
                            <CreditCard size={18} />
                            <p>Pay</p>
                        </button>
                        </DropdownMenuItem>
                    </Link>}
                    <DropdownMenuItem className='cursor-pointer' onClick={() => {
                        setOpen(true)
                        setIssue('')
                        setDescription('')
                    }}>
                        <button className='flex items-center gap-2'>
                            <AlertTriangle size={18} />
                            <p>Report issue</p>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export default Actions