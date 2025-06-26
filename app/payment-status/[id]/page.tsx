'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { FaceSmileIcon } from '@heroicons/react/16/solid';
import { FaceIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { Frown, PartyPopper } from 'lucide-react';

const steps = [
    { label: 'Checkout done' },
    { label: 'Received' },
    { label: 'Processed' },
];

const Confetti = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
                <span
                    key={i}
                    className="confetti"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 1.5}s`,
                        background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                    }}
                />
            ))}
            <style jsx>{`
                .confetti {
                    position: absolute;
                    top: -20px;
                    width: 8px;
                    height: 16px;
                    border-radius: 2px;
                    opacity: 0.8;
                    animation: confetti-fall 1.8s cubic-bezier(0.6,0.2,0.4,1) forwards;
                }
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                    80% { opacity: 1; }
                    100% { transform: translateY(90vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const Page = () => {
    const context = useAuth()
    const user = context?.user
    const [barFill, setBarFill] = useState(0);
    const searchParams = useSearchParams()
    const params = useParams()
    const id = params.id
    const [allParams, setAllParams] = useState({
        userId: '',
        receiverId: '',
        type: ''
    })
    const order_id = searchParams.get("order_id")
    const tracker = searchParams.get("tracker")
    const [status, setStatus] = useState('')

    useEffect(() => {
        if (!id) return

        if (Array.isArray(id)) {
            const splits = id[0].split("-")
            setAllParams({
                userId: splits[0],
                receiverId: splits[1],
                type: splits[2]
            })
        }
        else {
            const splits = id.split("-")
            setAllParams({
                userId: splits[0],
                receiverId: splits[1],
                type: splits[2]
            })
        }
    }, [id])

    useEffect(() => {
        if (!tracker || !id || !allParams.type || !allParams.receiverId) return

        const checkPayment = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallets/check-payment?userId=${allParams.userId}&tracker=${tracker}&receiverId=${allParams.receiverId}&type=${allParams.type}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = response.data

                if (data.statusCode != 200) {
                    alert(data.message)
                    return
                }

                if (!data.data) {
                    alert("Payment Not Submitted Successfully.")
                    return
                }

                setStatus(data.data.status)
            } catch (err: any) {
                alert(err.data.message)
            }
        }

        checkPayment()
    }, [tracker, id, allParams.receiverId, allParams.type])

    useEffect(() => {
        setTimeout(() => setBarFill(100), 200);
    }, []);

    const checkActive = (idx: number) => barFill >= (idx === 0 ? 0 : idx === 1 ? 50 : 100);

    return (
        <div className="min-h-screen left-0 top-0 w-full bg-[#18432e] flex items-center justify-center overflow-x-hidden">
            <Confetti />
            <div className="relative bg-white md:rounded-2xl shadow-2xl w-full max-w-4xl min-h-screen md:min-h-[500px] flex flex-col px-0 md:px-0 animate-fade-in overflow-hidden" style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.13)' }}>
                {/* Logo */}
                <div className="absolute top-6 left-6 z-10 animate-fade-in delay-100">
                    <Image
                        src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        priority
                    />
                </div>
                {/* Notification Bar */}
                <div className="flex justify-center mt-16 md:mt-8 z-10 animate-fade-in delay-200">
                    <div className="flex items-center bg-white border border-[#00563c] rounded-full px-6 py-2 shadow-sm gap-2 w-fit animate-fade-in">
                        <span className="text-[#00563c] font-medium flex items-center gap-2 text-base">{status === 'PAID' ? <PartyPopper size={25} color='#00563c' /> : <Frown size={25} color='#00563c' />} {status === 'PAID' ? `Congratulations! ${user?.fullname?.split(" ")[0]}` : `Oops!`}</span>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-8 md:px-16 pb-14 md:py-0 md:mt-0 z-10">
                    <div className="flex-1 flex flex-col items-start justify-center max-w-lg">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#202020] animate-slide-up flex flex-col gap-2">  {status === 'PAID' ? 'Payment successful' : 'Oops! Something went wrong.'}</h1>
                        <p className="text-[#5b5b5b] mb-6 text-[13px] md:text-sm animate-fade-in delay-100">{status === 'PAID' ? "Your payment has been successfully processed. Thank you for trusting Veloride! 🙌 You’ll receive a confirmation shortly." : "Your payment couldn’t be processed. Please try again or use a different method."}</p>
                        <div className="w-full max-w-md mb-8 relative">
                            <div className="relative h-12 flex items-center">
                                {/* Bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-4 bg-[#00563c] rounded-full shadow-bar transition-all duration-1000"
                                        style={{ width: `${barFill}%` }}
                                    ></div>
                                </div>
                                {/* Circles with checks */}
                                {[0, 1, 2].map((idx) => (
                                    <div
                                        key={idx}
                                        className={`absolute z-10 flex items-center justify-center transition-all duration-700 ${idx === 0 ? 'left-0' : idx === 1 ? 'left-1/2 -translate-x-1/2' : 'right-0'} top-1/2 -translate-y-1/2`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-lg font-bold shadow-md transition-all duration-700 ${checkActive(idx) ? 'bg-[#00563c] border-[#00563c] text-white scale-110' : 'bg-white border-gray-300 text-gray-400 scale-100'}`}
                                            style={{ boxShadow: checkActive(idx) ? '0 0 0 4px #e6f4ee' : undefined }}
                                        >
                                            <span className={`transition-all duration-500 ${checkActive(idx) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>✓</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs md:text-sm text-[#5b5b5b] w-full">
                                {steps.map((step, idx) => (
                                    <span key={idx} className="flex-1 text-center font-medium" style={{ minWidth: 80 }}>{step.label}</span>
                                ))}
                            </div>
                        </div>
                        {/* Buttons */}
                        <div className="flex gap-4 mt-2">
                            <Link href='/'><button className="border border-[#00563c] text-[#00563c] px-6 py-2 rounded-lg cursor-pointer font-semibold hover:bg-[#e6f4ee] transition-all duration-200 animate-fade-in delay-300">Back to Homepage</button></Link>
                        </div>
                    </div>
                    {/* Right: Illustration */}
                    <div className="flex-1 flex justify-center items-center mt-10 md:mt-0 animate-fade-in delay-150">
                        <Image
                            src="/Images/Fast car-rafiki.svg"
                            alt="Success Illustration"
                            width={320}
                            height={320}
                            className="w-[320px] h-auto"
                            priority
                        />
                    </div>
                </div>
                <style jsx>{`
                    .animate-fade-in {
                        animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both;
                    }
                    .animate-slide-up {
                        animation: slideUp 0.7s cubic-bezier(.4,0,.2,1) both;
                    }
                    .animate-bar-fill {
                        animation: barFill 1.2s cubic-bezier(.4,0,.2,1) both;
                    }
                    .shadow-bar {
                        box-shadow: 0 2px 12px 0 #00563c22;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: none; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: none; }
                    }
                    @keyframes barFill {
                        from { width: 0; }
                        to { width: 100%; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Page;