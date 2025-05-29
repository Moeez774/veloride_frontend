'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Calendar, ChevronDown, ArrowUp, Copy, Plus, CheckCircle, Clock, EllipsisVertical, ArrowDown } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/components/hooks/useHooks/useFetch'
import { fetchWalletDetails } from '@/components/hooks/useHooks/useWallet'
import { Component } from '@/components/ui/IncomeChart'
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import AddPaymentMethods from '@/components/items/AddPaymentMethods'
import PieChart from '@/components/ui/PieChart'
import Actions from './Wallet_Components/Actions'
interface WalletProps {
    toggleTheme: boolean | undefined,
    user: any,
    formattedDate: string
}

const Filter = ({ text, textSize, toggleTheme }: { text: string, textSize: string, toggleTheme?: boolean | undefined }) => {
    return (
        <div className={`flex items-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} justify-between`}>
            <h1 className={`${textSize} font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{text}</h1>
            <button className={`rounded-full flex items-center gap-1 ${toggleTheme ? 'border border-[#202020]' : 'border'} px-2.5 py-2`}>This Month <ChevronDown className='ml-0.5 mt-1' size={14} /></button>
        </div>
    )
}

const DateFilter = ({ text, toggleTheme, formattedDate }: { text: string, toggleTheme: boolean | undefined, formattedDate?: string | undefined }) => {
    return (
        <div className={`flex items-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} justify-between`}>
            <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{text}</h1>
            <button className={`rounded-full text-xs xl:text-sm flex items-center ${toggleTheme ? 'border border-[#202020]' : 'border'} gap-1 px-2.5 py-1`}>{text === 'My Balance' ? <Calendar size={15} /> : ""} {text === "My Balance" ? formattedDate?.split(",")[0] : `This Month`} {text != "My Balance" ? <ChevronDown className='xl:ml-0.5 mt-1' size={14} /> : ""}</button>
        </div>
    )
}

const RecentlyActivities = ({ toggleTheme, data }: { toggleTheme?: boolean | undefined, data: any[] }) => {
    return (
        <div className='mt-5'>

            <div className={`grid grid-cols-3 text-[15px] ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-medium gap-x-4`}>
                <h1>Ride ID</h1>
                <h1>Date</h1>
                <h1>Amount</h1>
            </div>

            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} mt-3`} />

            {data.length === 0 && <div>
                <h1 className={`${toggleTheme ? 'text-[#b1b1b1b]' : 'text-[#5b5b5b]'} text-sm text-center font-medium mt-10`}>You haven't done any transactions recently.</h1>
            </div>}

            {data.length != 0 && data.map((transaction, index) => (
                <React.Fragment key={index}>
                    <div className={`grid grid-cols-3 mt-3 text-[15px] ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium gap-x-4`}>
                        <h1>#{transaction.rideId.slice(-5)}</h1>
                        <h1>
                            {`${new Date(transaction.date).getDate()}/${new Date(transaction.date).getMonth() + 1}/${new Date(transaction.date).getFullYear()}`}
                        </h1>

                        <h1 className={transaction.type === "Send" ? 'text-[#FF8080]' : 'text-[#048c64]'}>
                            {transaction.type === "Send" ? '-' + transaction.amount : '+' + transaction.amount}
                        </h1>
                    </div>
                    {index !== data.length - 1 && <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} mt-3`} />}
                </React.Fragment>
            ))}


        </div>
    )
}

const PaymentCard = ({ image, text, status, toggleTheme }: { image: string, text: string, status: string, toggleTheme?: boolean | undefined }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className={`p-2 rounded-full ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'} border-2 border-transparent hover:border-[#00563c]`}>
                        <img src={image} alt={text} className='w-8 h-8' />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="rounded-full bg-[#00563c]">
                    <p className="inter font-medium text-white flex items-center gap-0.5">{status === "Pending" ? "Pending" : "Verified"} {status === "Pending" ? <Clock size={14} /> : <CheckCircle size={14} />}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>


    )
}

const PendingTransactions = ({ header, data, toggleTheme }: { header: string, data: any[], toggleTheme: boolean | undefined }) => {
    if (!data) return null

    return (
        <div className={`w-full mx-auto h-[30em] ${toggleTheme ? 'bg-[#0d0d0d] text-[#fefefe] border border-[#202020]' : 'bg-[#fefefe] border text-[#202020]'} rounded-xl pb-[0.90rem] pt-6 px-6`} style={{ scrollbarWidth: 'thin' }}>
            <label className='text-lg md:text-xl inter font-medium'>{header}</label>

            <Table className='mt-3 h-full'>
                {data.length === 0 && <TableCaption className={`text-sm mt-6 inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} mb-auto`}>No pending transactions.</TableCaption>}
                <TableHeader>
                    <TableRow className={`${toggleTheme ? 'text-[#b1b1b1] hover:bg-[#202020]' : 'text-[#5b5b5b] hover:bg-[#f0f0f0]'} text-sm inter`}>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px]`}>Ride ID</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>Type</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>{header === "Pending Transactions - Owned Rides" ? "Passenger Name" : "Driver Name"}</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>From</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>Status</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>Amount</TableHead>
                        <TableHead className={`px-8 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} w-[150px] sm:w-auto`}>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                {data.map((transaction, index) => {
                    return (
                        <TableBody key={index} className='h-full'>
                            <TableRow key={index} className={`${toggleTheme ? 'text-[#fefefe] hover:bg-[#202020]' : 'text-[#202020] hover:bg-[#f0f0f0]'} text-sm inter `}>
                                <TableCell className="font-medium px-8">#{transaction.rideId.slice(-5)}</TableCell>
                                <TableCell className="px-8">{transaction.type.split("_").join(" ").charAt(0).toUpperCase() + transaction.type.split("_").join(" ").slice(1)}</TableCell>
                                <TableCell className="px-8">{transaction.passengerName ?? transaction.driverName}</TableCell>
                                <TableCell className="px-8">{transaction.createdAt.split("T")[0]}</TableCell>
                                <TableCell className={`px-8 ${transaction.status === "pending" ? "text-[#FF8080]" : "text-[#048c64]"}`}>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</TableCell>
                                <TableCell className="px-8">PKR {transaction.amount}</TableCell>
                                <TableCell className="px-8">
                                    <Actions transaction={transaction} toggleTheme={toggleTheme} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    )
                })}
            </Table>

        </div>
    )
}

//interface of wallet data
export interface WalletData {
    _id: string,
    balance: {
        intialBalance: number,
        currentBalance: number,
        percentageChange: number
    },
    pendingTransactions: any[],
    totalSpent: number,
    totalEarned: number,
    monthlySpent: any[],
    pending_owned_rides_transactions: any[],
    monthlyEarnings: any[],
    transactions: any[],
    linkedMethods: any[],
    refundTracker: {
        totalRequested: number,
        processed: number,
        pending: number
    },
    spendings: any,
    monthlyStats: any[],
    createdAt: Date,
    updatedAt: Date
}

const Wallet = ({ toggleTheme, user, formattedDate }: WalletProps) => {
    const { data, loading, error } = useFetch(() => fetchWalletDetails({ id: user?._id }))
    const [walletData, setWalletData] = useState<WalletData | null>(null)
    const hasFetched = useRef(false)

    useEffect(() => {
        if (!data || hasFetched.current) return
        setWalletData(data)
        hasFetched.current = true
    }, [data])

    if (loading || !walletData) return <h1>Loading...</h1>

    return (
        <div className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} flex flex-col gap-y-4 max-w-7xl mx-auto w-full xl:pr-4 h-full overflow-y-auto pb-3`} style={{ scrollbarWidth: 'thin' }}>

            <div className='font-medium gap-x-6 flex flex-col lg:flex-row'>

                {/* left side */}
                <div className='flex flex-col lg:w-3/4 xl:w-1/2 gap-y-5'>
                    <div className={`w-full p-5 ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl  h-auto`}>

                        <DateFilter toggleTheme={toggleTheme} formattedDate={formattedDate} text='My Balance' />

                        <h1 className='text-4xl mt-4 flex items-center gap-4'>PKR {walletData.balance.currentBalance}

                            {walletData.balance.percentageChange >= 0 && <span className={`${toggleTheme ? 'text-[#d2f5d9] bg-[#01b580]' : 'text-[#01b580] bg-[#D2F5D9]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowUp size={14} /> {Math.abs(Math.round(walletData.balance.percentageChange))}%</span>}

                            {walletData.balance.percentageChange < 0 && <span className={`${toggleTheme ? 'text-[#ffdede] bg-[#ff8080]' : 'text-[#FF8080] bg-[#FFDEDE]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowDown size={14} /> {Math.abs(Math.round(walletData.balance.percentageChange))}%</span>}

                        </h1>

                        <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} flex items-center gap-3 text-sm mt-4`}>7272 4444 5454 6363
                            <span className={`flex items-center rounded-sm ${toggleTheme ? 'border border-[#202020]' : 'border'} text-xs gap-1 p-1`}><Copy size={14} /> Copy</span>
                        </h1>

                        <div className='w-full flex items-center gap-x-2 mt-5'>
                            <button className={`w-full py-3 text-[#fefefe] text-[15px] flex items-center gap-1 justify-center rounded-lg bg-[#00563c]`}><ArrowUp size={20} className='rotate-45' />Transfer</button>
                            <button className={`w-full py-3 text-[15px] flex items-center gap-1 justify-center rounded-lg ${toggleTheme ? 'bg-[#202020] text-[#b1b1b1]' : 'bg-[#f0f0f0] text-[#5b5b5b]'}`}><ArrowUp size={20} className='-rotate-135' />Receive</button>
                            <button className={`${toggleTheme ? 'bg-[#202020] text-[#b1b1b1]' : 'bg-[#f0f0f0] text-[#5b5b5b]'} py-[0.90rem] rounded-lg w-fit px-4`}><Plus size={20} /> </button>
                        </div>

                    </div>

                    <div className={`w-full mb-4 lg:mb-0 overflow-y-auto h-[28.5em] ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl p-5`} style={{ scrollbarWidth: 'thin' }}>
                        <Filter toggleTheme={toggleTheme} textSize='text-base' text='Recently Activity' />

                        <RecentlyActivities data={walletData.transactions} toggleTheme={toggleTheme} />
                    </div>
                </div>

                {/* right side */}
                <div className='flex flex-col gap-y-4 w-full'>

                    <div className={`w-full h-auto ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl pt-5 pb-[0.90rem] px-5`}>

                        <div className={`flex items-center text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} justify-between`}>
                            <h1 className={`text-base font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Payment Actions</h1>
                            <button className={`rounded-full flex items-center gap-1 ${toggleTheme ? 'border border-[#202020]' : 'border'} px-2.5 py-1`}>{walletData.linkedMethods.length} Added</button>
                        </div>

                        <div className='flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide items-start mt-8 gap-2' style={{ WebkitOverflowScrolling: 'touch' }}>

                            <AddPaymentMethods setWalletData={setWalletData} walletData={walletData} toggleTheme={toggleTheme} />

                            {walletData.linkedMethods.length != 0 && walletData.linkedMethods.map((method: any, i: number) => (
                                <div key={i} className='flex-none'>
                                    <PaymentCard toggleTheme={toggleTheme} status={method.status} image={method.logoUrl} text={method.name} />
                                </div>
                            ))}

                            {[...Array(5 - walletData.linkedMethods.length)].map((_, index) => (
                                <React.Fragment key={index}>
                                    <div className={`flex-none p-[0.90rem] rounded-full ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}>
                                        <QuestionMarkCircledIcon className='w-[23px] h-[23px]' color={toggleTheme ? '#b1b1b1' : '#5b5b5b'} />
                                    </div>
                                </React.Fragment>
                            ))}

                        </div>

                    </div>

                    <div className={`w-full h-auto ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl px-5 pt-5 pb-8`}>
                        <Filter toggleTheme={toggleTheme} textSize='text-base' text='Refund Tracker' />

                        <h1 className={`mt-2.5 text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Total Requested Refund
                            <p className={`text-2xl mt-2 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium`}>PKR {walletData.refundTracker.totalRequested}</p>
                        </h1>

                        <div className='flex mt-6 w-full items-start flex-col sm:flex-row sm:items-center gap-4 sm:gap-8'>

                            <div className='flex items-center gap-2'>
                                <CheckCircle size={25} color={toggleTheme ? '#048c64' : '#00563c'} />
                                <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium`}>Processed</h1>
                                <p className={`text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>PKR {walletData.refundTracker.processed}</p>
                                <span className={`${toggleTheme ? 'text-[#d2f5d9] bg-[#01b580]' : 'text-[#01B580] bg-[#D2F5D9]'} ml-2 flex items-center py-1 px-1.5 rounded-full text-xs`}>
                                    {walletData.refundTracker.totalRequested > 0
                                        ? ((walletData.refundTracker.processed / walletData.refundTracker.totalRequested) * 100).toFixed(2)
                                        : '0'}%
                                </span>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Clock size={25} className='text-yellow-500' />
                                <h1 className={`text-sm ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium`}>Pending</h1>
                                <p className={`text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>PKR {walletData.refundTracker.pending}</p>
                                <span className='text-yellow-600 ml-2 flex items-center py-1 px-1.5 rounded-full bg-yellow-200 text-xs'>
                                    {walletData.refundTracker.totalRequested > 0
                                        ? ((walletData.refundTracker.pending / walletData.refundTracker.totalRequested) * 100).toFixed(2)
                                        : '0'}%
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* //Pie Chart */}
                    <div className={`w-full sm:h-[19.4em] ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl p-5`}>

                        <div className='flex flex-col sm:flex-row justify-between'>

                            <div className='px-2'>
                                <h1 className={`text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Spending Breakdown by Category</h1>

                                <h1 className={`text-xs font-normal mt-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Visual breakdown of where your money went this month across all wallet activities.</h1>

                                <div className='flex flex-col gap-y-2 font-medium text-sm mt-4'>
                                    <div className='flex items-center gap-x-2'><div className='bg-[#4F46E5] w-5 h-5 rounded-sm'></div> Rides</div>
                                    <div className='flex items-center gap-x-2'><div className='bg-[#10B981] w-5 h-5 rounded-sm'></div> Tips</div>
                                    <div className='flex items-center gap-x-2'><div className='bg-[#F59E0B] w-5 h-5 rounded-sm'></div> Refunds</div>
                                    <div className='flex items-center gap-x-2'><div className='bg-[#EF4444] w-5 h-5 rounded-sm'></div> Withdrawls</div>
                                    <div className='flex items-center gap-x-2'><div className='bg-[#6B7280] w-5 h-5 rounded-sm'></div> Others</div>
                                </div>
                            </div>

                            <div className='h-full'>
                                <PieChart spendings={walletData.spendings} toggleTheme={toggleTheme} />
                            </div>
                        </div>


                    </div>

                </div>

            </div>

            <div className='flex flex-col w-full lg:flex-row items-center gap-4'>
                <div className={`w-full h-auto ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl p-5`}>

                    <DateFilter toggleTheme={toggleTheme} text='Monthly Spent' />


                    <h1 className={`text-2xl mt-4 flex items-center gap-4 ${toggleTheme ? 'text-[#fefefe]' : ''}`}>PKR {walletData.monthlySpent[walletData.monthlySpent.length - 1].spent}
                    </h1>

                    <h1 className={`text-[13px] ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#9F9F9F]'} mt-5 flex items-center gap-[0.90rem]`}>

                        {walletData.monthlySpent[walletData.monthlySpent.length - 1].percentageChange >= 0 && <span className={`${toggleTheme ? 'text-[#d2f5d9] bg-[#01b580]' : 'text-[#01b580] bg-[#D2F5D9]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowUp size={14} /> {Math.abs(Math.round(walletData.monthlySpent[walletData.monthlySpent.length - 1].percentageChange))}%</span>}

                        {walletData.monthlySpent[walletData.monthlySpent.length - 1].percentageChange < 0 && <span className={`${toggleTheme ? 'text-[#ffdede] bg-[#ff8080]' : 'text-[#FF8080] bg-[#FFDEDE]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowDown size={14} /> {Math.abs(Math.round(walletData.monthlySpent[walletData.monthlySpent.length - 1].percentageChange))}%</span>} Compared to last month
                    </h1>

                </div>

                <div className={`${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl p-5 w-full`}>

                    <DateFilter toggleTheme={toggleTheme} text='Monthly Income' />


                    <h1 className={`text-2xl mt-4 flex items-center gap-4 ${toggleTheme ? 'text-[#fefefe]' : ''}`}>PKR {walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].earned}
                    </h1>

                    <h1 className={`text-[13px] ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#9F9F9F]'} mt-5 flex items-center gap-[0.90rem]`}>
                        {walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].percentageChange >= 0 && <span className={`${toggleTheme ? 'text-[#d2f5d9] bg-[#01b580]' : 'text-[#01b580] bg-[#D2F5D9]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowUp size={14} /> {Math.abs(Math.round(walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].percentageChange))}%</span>}

                        {walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].percentageChange < 0 && <span className={`${toggleTheme ? 'text-[#ffdede] bg-[#ff8080]' : 'text-[#FF8080] bg-[#FFDEDE]'} flex items-center py-1 px-1.5 rounded-full text-xs`}><ArrowDown size={14} /> {Math.abs(Math.round(walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].percentageChange))}%</span>} Compared to last month
                    </h1>

                </div>
            </div>

            {/* Cashflow graph */}
            <div className={`w-full h-auto ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020]' : 'bg-[#fefefe] border'} rounded-xl pt-5 px-5`}>

                <Filter toggleTheme={toggleTheme} textSize='text-xl' text='Cashflow' />

                <div className='flex items-center justify-between'>
                    <h1 className={`mt-3 text-sm ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Total Balance
                        <p className={`text-2xl mt-2 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium`}>PKR {walletData.monthlyEarnings[walletData.monthlyEarnings.length - 1].earned}</p>
                    </h1>

                    <div className={`flex ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} items-center gap-6`}>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#00563c]"></div>
                            <span className="font-medium">Spend</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="font-medium">Earned</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className='mt-5 w-full h-[20em]'>
                    <Component walletData={walletData} />
                </div>


            </div>

            <div className='flex flex-col w-full gap-4'>
                <PendingTransactions data={walletData.pendingTransactions} toggleTheme={toggleTheme} header='Pending Transactions - Taken Rides' />
                <PendingTransactions data={walletData.pending_owned_rides_transactions} toggleTheme={toggleTheme} header='Pending Transactions - Owned Rides' />
            </div>
        </div>
    )
}

export default Wallet