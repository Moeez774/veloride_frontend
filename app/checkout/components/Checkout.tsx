'use client'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Car, ChevronLeft, Dot, Minus, Plus, Router, Star } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import { useRide } from '@/context/states'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Loader from '@/components/Loader'
import { useRouter } from 'next/navigation'
import socket from '@/utils/socket'
import axios from 'axios'
import { useAuth } from '@/context/AuthProvider'

interface CheckoutProps {
    rideId: string | null
    amount: string
    by: string | null
    to: string | null
    toggleTheme: boolean | undefined
}

const TipInput = ({ value, onChange, placeholder, toggleTheme }: { value: number, onChange: (value: number) => void, placeholder: string, toggleTheme: boolean | undefined }) => {

    return (
        <div className='py-4 bg-transparent outline-none text-lg flex justify-between items-center w-full'>
            <div onClick={() => {
                const val = Number(value) + 1
                onChange(val)
            }} className={`${toggleTheme ? 'bg-[#202020] text-white' : 'bg-[#f0f0f0] text-black'} cursor-pointer rounded-full p-1`}>
                <Plus size={14} />
            </div>

            <h1 className='text-lg font-medium' style={{ userSelect: 'none' }}>{value}</h1>

            <button onClick={() => {
                if (Number(value) === 0) return
                const val = Number(value) - 1
                onChange(val)
            }} className={`${toggleTheme ? 'bg-[#202020] hover:bg-[#353535] text-white' : 'bg-[#f0f0f0] hover:bg-[#f7f7f7] text-black'} cursor-pointer rounded-full p-1`}>
                <Minus size={14} />
            </button>
        </div>
    )
}

const Summary = ({ toggleTheme, amount, tip, setTip, payableAmount, availableMethods, paymentMethod, setPaymentMethod, hovered, setHovered, rating, setRating, comment, setComment }: { toggleTheme: boolean | undefined, amount: string, tip: number, setTip: (value: number) => void, payableAmount: number, availableMethods: any, paymentMethod: string, setPaymentMethod: (value: string) => void, hovered: number, setHovered: (value: number) => void, rating: number, setRating: (value: number) => void, comment: string, setComment: (value: string) => void }) => {


    return (
        <div className='lg:max-w-lg xl:max-w-xl w-full'>
            <Link href="/dashboard?page=wallet">
                <button className='text-[#00563c] cursor-pointer hover:text-[#00563ccc] transition-all duration-200 flex items-center gap-2 text-sm font-semibold'><ChevronLeft size={14} /> Back to wallet</button>
            </Link>

            <h1 className='text-4xl font-medium mt-6 lg:ml-4'>Pay for your ride</h1>

            <p className={`lg:ml-4 max-w-lg w-full ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} font-medium text-sm mt-4`}>Your payment goes directly to the driver, with Veloride ensuring fairness and safety for both sides.</p>

            <div className='flex mt-6 flex-col gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                <h1 className='flex items-center text-base font-semibold'><Dot size={28} /> Total amount to pay</h1>

                <h1 className='text-3xl font-bold ml-7 sm:ml-0 text-[#00563c]'>PKR{amount}</h1>
            </div>

            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} max-w-3xl lg:max-w-md mx-auto w-full mt-5`} />

            <div className='mt-6 flex flex-col gap-3'>
                <h1 className='flex items-center text-sm font-semibold'><Dot size={24} /> Tip for driver <p className={`text-xs font-medium ml-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>(Optional)</p> </h1>

                <div className={`px-2.5 lg:ml-5 lg:max-w-[33rem] mx-auto flex items-center justify-between rounded-md bg-transparent border w-full ${toggleTheme ? 'border-[#202020]' : ''}`}>

                    <h1 className='text-sm font-medium'>PKR</h1>

                    <div className={`h-6 w-[2px] mx-3 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}></div>

                    <TipInput toggleTheme={toggleTheme} value={tip} onChange={setTip} placeholder="0" />

                    <div className={`h-6 w-[2px] mx-4 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}></div>

                    <div className='flex flex-col gap-1 w-48 sm:w-36'>
                        <h1 className='text-xs font-medium'>Total after tip</h1>

                        <h1 className='text-sm sm:text-[15px] font-semibold'>PKR {payableAmount}</h1>
                    </div>

                </div>

            </div>

            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} max-w-3xl lg:max-w-md mx-auto w-full mt-8`} />

            <div className='mt-6 flex flex-col'>
                <h1 className='flex items-center text-sm font-semibold'><Dot size={24} /> Rate driver <p className={`text-xs font-medium ml-1 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>(Optional)</p> </h1>

                <p className={`lg:ml-6 max-w-lg w-full ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} mt-1 text-[13px]`}>Your feedback is valuable in helping us improve our service. Please take a moment to rate your driver.</p>

                <div className='mt-6 lg:ml-6 lg:max-w-[33rem] mx-auto w-full'>

                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = hovered >= star || (!hovered && rating >= star)
                            return (
                                <Star
                                    key={star}
                                    onMouseEnter={() => setHovered(star)}
                                    onMouseLeave={() => setHovered(0)}
                                    onClick={() => setRating(star)}
                                    className={`w-6 h-6 cursor-pointer transition-colors ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}
                                    fill={isFilled ? '#00563c' : 'none'}
                                />
                            )
                        })}
                    </div>

                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Write a review' className={`w-full mt-4 resize-none border h-[10em] ${toggleTheme ? 'border-[#202020]' : ''}`} />
                </div>

            </div>

            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} max-w-3xl lg:max-w-md mx-auto w-full mt-8`} />

            <div className='mt-6 flex flex-col'>
                <h1 className='flex items-center text-sm font-semibold'><Dot size={24} /> Select a payment method</h1>

                {availableMethods.length === 0 && <div className='mt-6 lg:ml-6 flex items-baseline justify-between gap-2 lg:max-w-[33rem] mx-auto w-full'>
                    <h1 className='text-sm text-center font-medium'>No payment methods added</h1>
                </div>}

                {availableMethods.length > 0 && <div className='mt-6 lg:ml-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 gap-2 lg:max-w-[33rem] mx-auto w-full'>

                    {availableMethods.map((method: any, i: number) => (
                        <button key={i} onClick={() => setPaymentMethod(method.name)} className={`w-full hover:bg-[#00563c] hover:text-white hover:border-[#00563c] cursor-pointer transition-all duration-200 justify-center p-[0.90rem] border rounded-lg flex items-center gap-2 ${paymentMethod === method.name ? 'bg-[#00563c] text-white border-[#00563c]' : ''} ${toggleTheme ? 'border-[#202020]' : ''}`}>
                            <img className='w-7' src={method.logoUrl} alt="" />
                            {method.name}
                        </button>
                    ))}
                </div>}

            </div>

        </div>
    )
}

const PaymentMethod = ({ paymentMethod, src }: { paymentMethod: string, src: string }) => {
    return (
        <div className='flex items-center gap-1'>
            <img className='w-4' src={src} alt="" />
            <h1 className='text-sm font-semibold'>{paymentMethod}</h1>
        </div>
    )
}

const Checkout = ({ rideId, amount, by, to, toggleTheme }: CheckoutProps) => {
    const [tip, setTip] = useState(0)
    const [payableAmount, setPayableAmount] = useState<number>(0)
    const [rating, setRating] = useState(0)
    const [senderWallet, setSenderWallet] = useState<any>(null)
    const router = useRouter()
    const authContext = useAuth()
    const user = authContext?.user || null
    const [availableMethods, setAvailableMethods] = useState<any>(null)
    const [receiverInfo, setReceiverInfo] = useState<any>(null)
    const [hovered, setHovered] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [loading, setLoading] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [statusCode, setStatusCode] = useState(0)
    const [comment, setComment] = useState('')
    const setNotifications = useRide().setNotifications
    const notifications = useRide().notifications

    useEffect(() => {
        setPayableAmount(Number(amount) + (tip === 0 ? 0 : Number(tip)))
    }, [tip, amount])

    //fetching receiver info
    useEffect(() => {
        if (!rideId || !by) return

        const fetchReceiverInfo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/fetchRide?rideId=${rideId}&by=${by}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch ride info')
                }

                const data = await response.json()
                setReceiverInfo(data.data)
                setSenderWallet(data.wallet)
                setAvailableMethods(data.wallet.linkedMethods)
            } catch (error) {
                alert(error)
            }
        }

        fetchReceiverInfo()
    }, [rideId, by])

    const rateDriver = async (driverId: string) => {
        try {

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/completed/rider/rate/driver`, {
                driverId: driverId,
                userId: user?._id,
                rating: rating,
                review: comment
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (res.data.statusCode === 200) {
                setRating(0)
                setComment('')
            }
        } catch (err: any) {
            console.log(err)
        }
    }

    const payAmount = async () => {
        setLoading(true)
        setMessage('')
        setShowMessage(false)
        if (paymentMethod === '') {
            setMessage('Please select a payment method')
            setStatusCode(400)
            setShowMessage(true)
            return
        }

        if (to && rating > 0) {
            await rateDriver(to)
            setRating(0)
            setComment('')
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallets/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    notificationId: rideId + amount.toString() + by + to,
                    amount: payableAmount,
                    initialAmount: Number(amount),
                    currency: 'PKR',
                    method: paymentMethod,
                    senderId: by,
                    receiverId: to,
                    id: rideId,
                    type: 'Send',
                    spendingCategory: 'rides'
                })
            })

            const data = await response.json()
            setMessage(data.message)
            setStatusCode(data.statusCode)
            setShowMessage(true)
            if (data.statusCode === 200) {
                setNotifications(notifications.filter((notification: any) => notification._id !== rideId + amount.toString() + by + to))
                router.push('/dashboard?page=wallet')
            }
        } catch (err) {
            setMessage(err as string)
            setStatusCode(500)
            setShowMessage(true)
        }
    }

    if (!receiverInfo || !senderWallet) return null

    return (
        <>

            {loading && <Loader message={message} showMessage={showMessage} setShowMessage={setShowMessage} setLoader={setLoading} statusCode={statusCode} />}

            <div className='max-w-7xl pb-10 relative lg:p-8 mx-auto w-full'>

                <img className='absolute right-6 w-40' src="/Images/wallet.png" alt="" />

                <div className='flex lg:flex-row w-full flex-col h-full gap-14 lg:gap-20 items-start'>

                    <div className='w-full backdrop-blur-sm'>
                        <div className='lg:hidden w-full'>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className={`text-sm font-medium rounded-none px-6 md:px-8 cursor-pointer border-t flex items-center gap-2 ${toggleTheme ? 'border-[#202020]' : ''}`}>
                                        <h1 className='flex cursor-pointer items-center gap-2'>
                                            <Car size={20} color='#00563c' /> Edit checkout details
                                        </h1>
                                    </AccordionTrigger>
                                    <AccordionContent className='w-full p-6 md:p-8'>
                                        <Summary toggleTheme={toggleTheme} amount={amount} tip={tip} setTip={setTip} payableAmount={payableAmount} availableMethods={availableMethods} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} hovered={hovered} setHovered={setHovered} rating={rating} setRating={setRating} comment={comment} setComment={setComment} />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr className={`${toggleTheme ? 'border-[#202020]' : ''}`} />
                        </div>

                        <div className='hidden lg:block'>
                            <Summary toggleTheme={toggleTheme} amount={amount} tip={tip} setTip={setTip} payableAmount={payableAmount} availableMethods={availableMethods} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} hovered={hovered} setHovered={setHovered} rating={rating} setRating={setRating} comment={comment} setComment={setComment} />
                        </div>
                    </div>


                    {/* //make it sticky */}
                    <div className='px-4 sm:px-6 xl:px-10 lg:max-w-xl w-full gap-20 items-start'>
                        <div className={`w-full backdrop-blur-sm border rounded-md shadow-2xl shadow-[#00563c]/30 p-4 sm:p-6 ${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'}`}>

                            <h1 className='text-xl font-semibold'>Confirm payment</h1>

                            <div className='mt-4 flex flex-col gap-4'>
                                <h1 className='flex items-center text-sm gap-2 font-medium'><p className={`w-1 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-black'}`}></p> Receiver info</h1>

                                <div className='flex justify-between mx-2.5'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-10 h-10 flex items-center justify-center rounded-full bg-[#00563c] text-white'>M</div>
                                        <div className='flex flex-col gap-0.5'>
                                            <h1 className='text-sm font-medium'>{receiverInfo.driverName}</h1>
                                            <h1 className='flex items-center gap-1 text-xs font-medium'><Car size={14} /> {receiverInfo.rideDetails.vehicle}</h1>
                                        </div>
                                    </div>

                                    <h1 className='flex items-center gap-1 text-xs font-medium'><Star size={14} /> {receiverInfo.driver_rating}</h1>
                                </div>
                            </div>

                            <div className='mt-6 flex items-center justify-between gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <h1 className='flex items-center text-sm gap-2 font-medium'><p className={`w-1 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-black'}`}></p>From</h1>
                                    <h1 className='text-sm mx-2.5 font-semibold'>
                                        {receiverInfo.rideDetails.pickupLocation.pickupName.split(',').slice(0, 2).join(', ')}
                                    </h1>
                                </div>

                                <div className='flex flex-col gap-1'>
                                    <h1 className='flex items-center text-sm gap-2 font-medium'><p className={`w-1 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-black'}`}></p>To</h1>
                                    <h1 className='text-sm mx-2.5 font-semibold'>{receiverInfo.rideDetails.dropoffLocation.dropoffName.split(',').slice(0, 2).join(', ')}</h1>
                                </div>
                            </div>

                            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} lg:max-w-md max-w-3xl mx-auto w-full mt-6`} />

                            <div className='mx-2 mt-6 flex flex-col gap-3'>
                                <div className='flex items-center justify-between'>
                                    <h1 className={`text-sm font-medium ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Amount before tip</h1>
                                    <h1 className={`text-base font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>PKR {amount}</h1>
                                </div>

                                <div className='flex items-center justify-between'>
                                    <h1 className={`text-sm font-medium ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Amount after tip</h1>
                                    <h1 className={`text-base font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>PKR {payableAmount}</h1>
                                </div>
                            </div>

                            <hr className={`${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'} lg:max-w-md max-w-3xl mx-auto w-full mt-6`} />

                            <div className='mt-6 flex flex-col gap-8'>

                                <div className='flex items-start justify-between'>
                                    <h1 className='flex items-center text-sm gap-2 font-medium'><p className={`w-1 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-black'}`}></p>Total  payable amount</h1>

                                    <div className='flex flex-col gap-1.5'>
                                        <h1 className='text-xs font-medium'>Method</h1>
                                        {paymentMethod === '' && <h1 className='text-sm font-semibold'>Not selected</h1>}

                                        {paymentMethod === 'EasyPaisa' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/idPncNv7mC_1746162971646.png" />}

                                        {paymentMethod === 'Payooner' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/idRRAw_KPy_logos.png" />}

                                        {paymentMethod === 'JazzCash' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/idvp4xtAGa_logos.png" />}

                                        {paymentMethod === 'HBL (Habib Bank Limited)' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/idUO-qYYT-_1746163116223.svg" />}

                                        {paymentMethod === 'Mastercard' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/Symbol.svg" />}

                                        {paymentMethod === 'Visa' && <PaymentMethod paymentMethod={paymentMethod} src="/Images/idDUM8TcN7_1746163043859.svg" />}
                                    </div>
                                </div>

                                <h1 className='text-4xl font-medium text-center'>PKR {payableAmount}</h1>

                                <button onClick={() => payAmount()} className='py-5 cursor-pointer hover:bg-[#00563ccc] hover:text-white transition-all duration-200 w-full bg-[#00563c] text-white flex items-center justify-center gap-2'>Pay <ArrowRight size={14} /></button>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Checkout