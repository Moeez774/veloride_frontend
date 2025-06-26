'use client'
import React, { useState, useEffect } from 'react'
import paymentMethods from './PaymentMethods.json'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Dot } from 'lucide-react'
import InputField from '../hooks/InputField'
import { url } from '../hooks/useHooks/useWallet'
import { WalletData } from '@/app/dashboard/(Dashboard)/Pages/Wallet'
interface AddPaymentMethodsProps {
    toggleTheme: boolean | undefined,
    walletData: WalletData,
    setWalletData: (walletData: WalletData) => void
}

const AddPaymentMethods = ({ toggleTheme, walletData, setWalletData }: AddPaymentMethodsProps) => {
    const [heading, setHeading] = useState('Add a new Payout Method')
    const [isChoosed, setChoosed] = useState(false)
    const [fields, setFields] = useState<any>({})
    const [allMethods, setAllMethods] = useState<any>([])
    const [isOpened, setOpened] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<any>(null)

    //for adding new payment method
    const addPaymentMethod = async () => {

        if ((fields[selectedMethod.requirements[0].label].value === "" || fields[selectedMethod.requirements[1].label].value === "") || (!fields["For Payments"]?.value && !fields["For Payouts"]?.value && !fields["Use for both"]?.value)) {
            alert("Please fill all required * fields and select usage of method")
            return
        }

        const data = {
            _id: selectedMethod.name,
            type: selectedMethod.type,
            holderName: fields[selectedMethod.requirements[0].label].value,
            name: selectedMethod.name,
            accountNumber: fields[selectedMethod.requirements[1].label].value,
            branchCode: fields[selectedMethod.requirements[2].label].value,
            cnic: fields[selectedMethod.requirements[3].label].value,
            logoUrl: selectedMethod.logo,
            addedAt: new Date(Date.now()),
            status: "Pending",
            useForPayments: fields["For Payments"]?.value ? fields["For Payments"]?.value : false,
            useForPayouts: fields["For Payouts"]?.value ? fields["For Payouts"]?.value : false,
            useForBoth: fields["Use for both"]?.value ? fields["Use for both"]?.value : false
        }

        const response = await fetch(`${url}/wallets/add-payment-method`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newMethod: data,
                _id: walletData._id
            })
        })

        const res = await response.json()
        alert(res.message)
        if (res.statusCode === 200) {
            const currentMethods = walletData.linkedMethods
            currentMethods.push(data)
            setWalletData({ ...walletData, linkedMethods: currentMethods })
        }
        setOpened(false)
    }

    useEffect(() => {
        if (!walletData) return

        const setPaymentMethods = () => {
            const updatedMethods = paymentMethods.filter((method: any) => {
                return !walletData.linkedMethods.some((linked: any) => linked.name === method.name)
            })

            setAllMethods(updatedMethods)
        }
        setPaymentMethods()
    }, [walletData])

    return (
        <div>
            <Dialog open={isOpened} onOpenChange={() => {
                setChoosed(false)
                setOpened(!isOpened)
                setHeading('Add a new payment method')
            }}>
                <DialogTrigger onClick={() => setOpened(true)}>
                    <div className={`flex-none cursor-pointer p-[0.93rem] rounded-full ${toggleTheme ? 'bg-[#202020] hover:bg-[#202020cc]' : 'bg-[#f0f0f0] hover:bg-[#f0f0f0cc]'}`}>
                        <Plus size={22} color={toggleTheme ? '#b1b1b1' : '#5b5b5b'} />
                    </div>
                </DialogTrigger>
                <DialogContent className={`w-full inter h-[33em] overflow-x-hidden border-none ${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'}`}>
                    <DialogHeader>
                        <DialogTitle>{heading}</DialogTitle>
                        <div className={`flex h-full mt-3 ${isChoosed ? '-translate-x-[110%]' : 'translate-x-[0%]'} transition-all duration-300 flex-col`}>
                            {allMethods.length > 0 ? allMethods.map((method: any, i: number) => {
                                return (
                                    <button onClick={() => {
                                        setChoosed(true)
                                        setSelectedMethod(method)
                                        setHeading(`Add ${method.name.split(" ")[0]} payment method.`)

                                        //setting fields and making states based on steps on specific method linking
                                        method.requirements.forEach((requirement: any) => {
                                            setFields((prev: Record<string, { value: string | number, type: string, optional: boolean }>) => {
                                                return {
                                                    ...prev,
                                                    [requirement.label]: {
                                                        value: requirement.type === 'string' ? '' : 0,
                                                        type: requirement.type,
                                                        optional: requirement.optional
                                                    }
                                                }
                                            })
                                        })

                                        // setting radio buttons for selecting usage of method
                                        method.usage.forEach((usage: any) => {
                                            setFields((prev: Record<string, { value: string | number, type: string, optional: boolean }>) => {
                                                return {
                                                    ...prev,
                                                    [usage.label]: {
                                                        value: usage.value,
                                                    }
                                                }
                                            })
                                        })
                                    }} key={i} className={`bg-transparent py-4 px-3 flex items-center justify-between rounded-md transition-all cursor-pointer duration-200 ${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#f0f0f0]'}`}>

                                        <div className='flex items-center gap-2'>
                                            <Dot size={20} />
                                            <img src={method.logo} alt={method.name} className='w-7 h-7' />
                                            <h1 className='text-sm font-medium'>{method.name}</h1>
                                        </div>

                                        <h1 className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Type: {method.type}</h1>
                                    </button>
                                )
                            }) : <div className='flex items-center justify-center h-full'>
                                <h1 className='text-sm font-medium'>You have linked all payment methods.</h1>
                            </div>}

                            <div className={`absolute flex flex-col justify-between h-full translate-x-[110%] transition-all duration-300 w-full`}>
                                <div className='flex flex-col gap-4 mt-2'>
                                    {selectedMethod && (
                                        <div className='flex flex-col gap-1.5'>
                                            {selectedMethod.requirements.map((requirement: any, i: number) => {
                                                return (
                                                    <div key={i}>
                                                        <InputField key={i} toggleTheme={toggleTheme} value={fields[requirement.label].value} setValue={(v) => setFields((prev: Record<string, { value: string | number, type: string, optional: boolean }>) => {
                                                            const updated = { ...prev }
                                                            updated[requirement.label] = {
                                                                value: v,
                                                                type: requirement.type,
                                                                optional: requirement.optional
                                                            }
                                                            return updated
                                                        })} placeholder={requirement.label} required={requirement.optional} label={requirement.label} />
                                                    </div>
                                                )
                                            })}

                                        </div>
                                    )}

                                    {/* Radio buttons for usage */}
                                    {selectedMethod && <div className='flex justify-between items-center gap-2'>
                                        {selectedMethod.usage.map((usage: any, i: number) => {
                                            return (
                                                <div key={i} className='flex items-center gap-2'>
                                                    <div className={`w-6 h-6 ${toggleTheme ? 'bg-[#2d2d2d]' : 'bg-[#a8a8a8]'} rounded-full cursor-pointer shadow-md`} onClick={() => {
                                                        if (selectedMethod.usage.length != 1) {
                                                            setFields((prev: Record<string, { value: boolean }>) => {
                                                                const updated = { ...prev }
                                                                updated[usage.label] = {
                                                                    value: !fields[usage.label].value,
                                                                }
                                                                selectedMethod.usage.forEach((method: any) => {
                                                                    if (method.label != usage.label) {
                                                                        updated[method.label] = {
                                                                            value: false,
                                                                        }
                                                                    }
                                                                })
                                                                return updated
                                                            })
                                                        }
                                                    }}><div className={`w-6 h-6 bg-[#00563c] rounded-full transition-all duration-200`} style={{ transform: fields[usage.label].value ? 'scale(1)' : 'scale(0)' }}></div></div>

                                                    <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} inter text-[13px] font-normal`}>{usage.label}</h1>
                                                </div>
                                            )
                                        })}
                                    </div>}
                                </div>

                                <div className='flex items-center justify-between'>
                                    <button className={`text-sm border font-medium py-2 cursor-pointer px-4 rounded-md transition-all duration-200 ${toggleTheme ? 'text-[#fefefe] border-[#353535] hover:bg-[#353535]' : 'text-[#202020] hover:bg-[#f0f0f0]'}`} onClick={() => {
                                        setChoosed(false)
                                        setHeading('Add a new payment method')
                                    }}>Back</button>
                                    <button className='text-sm font-medium py-2 cursor-pointer px-4 rounded-md bg-[#00563c] text-[#fefefe] hover:bg-[#004530] transition-all duration-200' onClick={() => {
                                        addPaymentMethod()
                                    }}>Add</button>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddPaymentMethods