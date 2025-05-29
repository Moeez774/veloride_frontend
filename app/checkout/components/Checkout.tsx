import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Car, ChevronLeft, Dot, Star } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRide } from '@/context/states'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from 'sonner'

interface CheckoutProps {
    rideId: string | null
    amount: string
    by: string | null
    to: string | null
    toggleTheme: boolean | undefined
}

const Checkout = ({ rideId, amount, by, to, toggleTheme }: CheckoutProps) => {
    const [tip, setTip] = useState(0)
    const [payableAmount, setPayableAmount] = useState<number>(0)
    const [rating, setRating] = useState(0)
    const [senderWallet, setSenderWallet] = useState<any>(null)
    const [availableMethods, setAvailableMethods] = useState<any>(null)
    const [receiverInfo, setReceiverInfo] = useState<any>(null)
    const [hovered, setHovered] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('')
    const [comment, setComment] = useState('')
    const setNotifications = useRide().setNotifications
    const notifications = useRide().notifications

    useEffect(() => {
        setPayableAmount(Number(amount) + tip)
    }, [tip])

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

    const PaymentMethod = ({ paymentMethod, src }: { paymentMethod: string, src: string }) => {
        return (
            <div className='flex items-center gap-1'>
                <img className='w-4' src={src} alt="" />
                <h1 className='text-sm font-semibold'>{paymentMethod}</h1>
            </div>
        )
    }

    const Summary = () => {
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

                        <input
                            type="number"
                            value={tip}
                            onChange={(e) => setTip(Number(e.target.value))}
                            placeholder="0"
                            className="outline-none py-4 text-lg w-full bg-transparent font-medium hide-number-arrows"
                            onKeyDown={(e) => {
                                const allowedKeys = [
                                    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"
                                ];
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !allowedKeys.includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />

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

    const payAmount = async () => {

        toast.loading('Processing payment...', { id: 'payment', style: { backgroundColor: toggleTheme ? '#202020' : '#fefefe', color: toggleTheme ? '#fefefe' : '#202020' } })

        if (paymentMethod === '') {
            toast.error('Please select a payment method', { id: 'payment', style: { backgroundColor: '#ff0000', color: '#fefefe' } })
            return
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
                    initialAmount: amount,
                    currency: 'PKR',
                    method: paymentMethod,
                    senderId: by,
                    receiverId: to,
                    id: rideId,
                    type: 'Send',
                    spendingCategory: 'rides'
                })
            })

            if (!response.ok) {
                throw new Error('Failed to pay')
            }
            const data = await response.json()
            if (data.statusCode === 200) {
                setNotifications(notifications.filter((notification: any) => notification._id !== rideId + amount.toString() + by + to))
            }
            alert(data.message)

        } catch (err) {
            toast.error(err as string, { id: 'payment', style: { backgroundColor: '#ff0000', color: '#fefefe' } })
        }
    }

    if (!receiverInfo || !senderWallet) return null

    return (
        <>
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
                                        <Summary />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <hr className={`${toggleTheme ? 'border-[#202020]' : ''}`} />
                        </div>

                        <div className='hidden lg:block'>
                            <Summary />
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