'use client'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Mail, Phone, Pencil, Info, ArrowRight, Star } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Alert from '@/components/hooks/Alert'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { saveDetails } from '@/functions/function'
import Loader from '@/components/Loader'
import { useAuth } from '@/context/AuthProvider'
import EditProfile from './Profile_Components/EditProfile'
import { getContacts } from '@/context/ContactsProvider'

interface ProfileProps {
    user: any,
    toggleTheme: boolean | undefined
}

const Profile = ({ user, toggleTheme }: ProfileProps) => {
    const [showAlert, setShowAlert] = useState(false)
    const [editCarDetails, setEditCarDetails] = useState(false)
    const [brands, setBrands] = useState<any[]>([])
    const [searchBrands, setSearchBrands] = useState<any[]>([])
    const [models, setModels] = useState<any[]>([])
    const [selectedModel, setSelectedModel] = useState('')
    const [searchModels, setSearchModels] = useState<any[]>([])
    const [openModelDropdown, setOpenModelDropdown] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [openBrandDropdown, setOpenBrandDropdown] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const modelInputRef = useRef<HTMLInputElement>(null)
    const modelScrollAreaRef = useRef<HTMLDivElement>(null)
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSeats, setSelectedSeats] = useState('')
    const context = useAuth()
    const setUser = context?.setUser
    const contacts = getContacts()
    const setToggleTheme = contacts?.setToggleTheme

    //for loading
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (scrollAreaRef.current && !scrollAreaRef.current.contains(event.target as Node) && inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setOpenBrandDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelScrollAreaRef.current && !modelScrollAreaRef.current.contains(event.target as Node) && modelInputRef.current && !modelInputRef.current.contains(event.target as Node)) {
                setOpenModelDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/cars/brands`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await res.json()
                if (data.statusCode === 200) {
                    setBrands(data.brands)
                    setSearchBrands(data.brands)
                }
                else {
                    console.log(data.message)
                }
            } catch (err: any) {
                console.log(err.message)
            }
        }
        fetchBrands()
    }, [])

    useEffect(() => {
        if (selectedBrand.length > 0) {
            const filteredBrands = brands.filter((brand: any) => brand.toLowerCase().includes(selectedBrand.toLowerCase()))
            setSearchBrands(filteredBrands)
        }
        else {
            setSearchBrands(brands)
        }
    }, [selectedBrand])

    const deleteAccount = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/delete-account?id=${user._id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await response.json()
            alert(data.message)
            window.location.href = '/hop-in'
        } catch (err) {
            alert(err)
        }
    }

    const fetchModels = async (brand: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/cars/models?brand=${brand.toLowerCase()}`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await res.json()
            if (data.statusCode === 200) {
                setModels(data.models)
                setSearchModels(data.models)
            }
            else {
                console.log(data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (selectedModel.length > 0) {
            const filteredModels = models.filter((model: any) => model.title.toLowerCase().includes(selectedModel.toLowerCase()))
            setSearchModels(filteredModels)
        }
        else {
            setSearchModels(models)
        }
    }, [selectedModel])

    //Save Car Details
    const saveCarDetails = async () => {
        await saveDetails(selectedBrand, selectedModel, selectedColor, selectedSeats, user._id, setLoader, setShowMessage, setMessage, setStatusCode, setEditCarDetails, setUser)
    }

    const formatDate = (date?: Date): string => {
        if (!date || isNaN(date.getTime())) return "Invalid Date";

        const options = { day: '2-digit', month: 'long', year: 'numeric' } as const;
        return date.toLocaleDateString('en-GB', options);
    }


    return (
        <>

            {loader && <Loader message={message} showMessage={showMessage} setShowMessage={setShowMessage} setLoader={setLoader} statusCode={statusCode} />}

            <div className='w-full fixed px-10'>
                <Dialog open={editCarDetails} onOpenChange={() => {
                    setEditCarDetails(false)
                    setSelectedBrand('')
                    setSelectedModel('')
                    setSelectedColor('')
                    setSelectedSeats('')
                }}>
                    <DialogTrigger></DialogTrigger>
                    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} max-h-[80vh] overflow-y-auto border-none`}>
                        <DialogHeader>
                            <DialogTitle className='flex items-center gap-2'>Provide Car Details</DialogTitle>

                            <div className='flex relative flex-col w-full mt-6 gap-2'>
                                <label htmlFor="brand" className='text-sm font-medium flex items-center gap-2'>Brand</label>
                                <Input ref={inputRef} value={selectedBrand} placeholder='Search Brand' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onFocus={() => {
                                    setOpenBrandDropdown(true)
                                }} onChange={(e) => setSelectedBrand(e.target.value)} />

                                <div className='relative w-full'>
                                    <div className={`${openBrandDropdown ? 'scale-100 z-10 opacity-[1]' : 'scale-95 -z-[100] opacity-0'} transition-all duration-200 w-full absolute left-0`}>
                                        <ScrollArea ref={scrollAreaRef} className={`w-full p-1 rounded-md mt-1 ${toggleTheme ? 'border-[#353535] bg-[#202020]' : 'bg-[#fefefe]'} border flex flex-col h-[200px]`}>

                                            {searchBrands.length === 0 && (
                                                <div className='flex items-center mt-10 justify-center h-full'>
                                                    <h1 className='text-sm text-center'>No Brands found</h1>
                                                </div>
                                            )}

                                            {searchBrands.map((item: any, index: number) => (
                                                <button disabled={!openBrandDropdown} key={index} className={`flex ${openBrandDropdown ? 'cursor-pointer' : 'cursor-default'} items-center justify-between ${toggleTheme ? 'hover:bg-[#353535] text-[#fefefe]' : 'hover:bg-[#f0f0f0] text-[#202020]'} w-full p-2 rounded-md text-start text-sm`} onClick={() => {
                                                    setSelectedBrand(item)
                                                    setOpenBrandDropdown(false)
                                                    fetchModels(item)
                                                }}>{item} <ArrowRight size={14} /></button>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                </div>

                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="model" className='text-sm font-medium flex items-center gap-2'>Model</label>
                                <Input ref={modelInputRef} value={selectedModel} placeholder='Search Model' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onFocus={() => {
                                    setOpenModelDropdown(true)
                                }} onChange={(e) => setSelectedModel(e.target.value)} />

                                <div className='relative w-full'>
                                    <div className={`${openModelDropdown ? 'scale-100 z-10 opacity-[1]' : 'scale-95 -z-[100] opacity-0'} transition-all duration-200 w-full absolute left-0`}>
                                        <ScrollArea ref={modelScrollAreaRef} className={`w-full p-1 rounded-md mt-1 ${toggleTheme ? 'border-[#353535] bg-[#202020]' : 'bg-[#fefefe]'} border flex flex-col h-[200px]`}>

                                            {searchModels.length === 0 && (
                                                <div className='flex items-center mt-10 justify-center h-full'>
                                                    <h1 className='text-sm text-center'>No Models found</h1>
                                                </div>
                                            )}

                                            {searchModels.length > 0 && searchModels.map((item: any, index: number) => (
                                                <button disabled={!openModelDropdown} key={index} className={`flex ${openModelDropdown ? 'cursor-pointer' : 'cursor-default'} items-center justify-between ${toggleTheme ? 'hover:bg-[#353535] text-[#fefefe]' : 'hover:bg-[#f0f0f0] text-[#202020]'} w-full p-2 rounded-md text-start text-sm`} onClick={() => {
                                                    setSelectedModel(item.title.charAt(0).toUpperCase() + item.title.slice(1))
                                                    setOpenModelDropdown(false)
                                                }}>{item.title.charAt(0).toUpperCase() + item.title.slice(1)} <ArrowRight size={14} /></button>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="color" className='text-sm mb-1.5 font-medium flex items-center gap-2'>Color</label>
                                    <Input value={selectedColor} placeholder='Enter Color of your vehicle' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onChange={(e) => setSelectedColor(e.target.value)} />
                                </div>

                                <div className='mt-3'>
                                    <label htmlFor="color" className='text-sm mb-1.5 font-medium flex items-center gap-2'>Avg Available Seats</label>
                                    <Input value={selectedSeats} placeholder='Enter Avg Available Seats' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onChange={(e) => setSelectedSeats(e.target.value)} />
                                </div>
                            </div>
                        </DialogHeader>
                        <DialogFooter className='mt-6'>
                            <Button onClick={() => setEditCarDetails(false)} className={`${toggleTheme ? 'border-[#353535] text-[#fefefe] hover:bg-[#353535]' : 'hover:bg-[#f0f0f0] text-[#202020]'} border transition-all duration-200 cursor-pointer bg-transparent`}>Cancel</Button>
                            <Button disabled={loader} className='bg-[#00563c] hover:bg-[#00563ccc] cursor-pointer' onClick={saveCarDetails}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={`${toggleTheme ? 'text-[#fefefe] bg-[#0d0d0d]' : 'text-[#202020] bg-[#fefefe]'} w-full h-full overflow-y-auto px-6 sm:px-10 pt-7 sm:pt-10 pb-6 rounded-3xl`} style={{ scrollbarWidth: 'thin' }}>

                <div className='flex flex-col w-full'>

                    <div className='flex items-start justify-between gap-2'>
                        <div className='flex flex-col'>
                            <div className='w-fit flex items-center' style={{ userSelect: 'none' }}>
                                {/* if user hasn't any photo */}
                                {user.photo?.startsWith("hsl") && (
                                    <div className={`rounded-full flex justify-center items-center text-white w-28 h-28`} style={{ background: user.photo }}>
                                        <h1 className='inter text-5xl'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                                    </div>
                                )}

                                {/* user with profile */}
                                {!user.photo?.startsWith("hsl") && (
                                    <div>
                                        <img className={`w-28 transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                                    </div>
                                )}
                            </div>

                            <div className='flex items-center gap-2 mt-6'>
                                <h1 className='text-2xl font-medium'>{user?.fullname}</h1>
                                <h1 className='text-sm flex items-center gap-1'>(<Star className='w-4 h-4' color='yellow' fill='yellow' /> {user?.rating.toFixed(1)} )</h1>
                            </div>

                            <div className={`flex mt-3 flex-col sm:flex-row sm:items-center text-[13px] gap-2.5 sm:gap-6 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                                <h1 className='flex items-center gap-1.5'><Mail size={14} /> {user?.email}</h1>
                                <h1 className='flex items-center gap-1.5'><Phone size={14} /> {user?.number}</h1>
                            </div>
                        </div>

                        {/* Edit button */}
                        <EditProfile setUser={setUser} toggleTheme={toggleTheme} user={user} />

                    </div>

                    <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} flex gap-[0.90rem] flex-col mt-6`}>
                        <h1 className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} text-[15px] font-medium flex gap-2.5 items-center`}>Car Details <Pencil onClick={() => {
                            setEditCarDetails(true)
                            setSelectedBrand(user.car_details?.brand || '')
                            setSelectedModel(user.car_details?.model || '')
                            setSelectedColor(user.car_details?.color || '')
                            setSelectedSeats(user.car_details?.avg_available_seats || '')
                            inputRef.current?.blur()
                            setOpenBrandDropdown(false)
                        }} className='cursor-pointer' size={13} color={toggleTheme ? '#fefefe' : '#202020'} /></h1>

                        <div className='grid grid-cols-2 gap-y-4 sm:gap-0 sm:flex sm:items-center'>
                            <h1 className={` text-[13px]`}>
                                Brand
                                <p className={`text-sm mt-2.5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} font-medium`}>{user.car_details?.brand || 'Not Set'}</p>
                            </h1>

                            <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}></div>

                            <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                                Model
                                <p className={`text-sm mt-2.5 font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{user.car_details?.model || 'Not Set'}</p>
                            </h1>

                            <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}></div>

                            <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                                Color
                                <p className={`text-sm mt-2.5 font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{user.car_details?.color || 'Not Set'}</p>
                            </h1>

                            <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme ? 'bg-[#202020]' : 'bg-[#f0f0f0]'}`}></div>

                            <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                                Avg Available Seats
                                <p className={`text-sm mt-2.5 font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{user.car_details?.avg_available_seats || 'Not Set'}</p>
                            </h1>

                        </div>
                    </div>

                    <hr className={`mt-6 w-full ${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'}`} />

                    <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} my-4 flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:items-center justify-between pr-2`}>
                        <h1 className='text-sm'>
                            Account Creation Date
                            <p className={`text-sm sm:text-[15px] mt-1 sm:mt-2 font-medium ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{formatDate(new Date(user?.createdAt))}</p>
                        </h1>

                        <Alert item={showAlert} setter={setShowAlert} statements={['Are you sure you want to delete your account?', "This action can't be undone. You'll lose all data of your account and you have to make another account for accessing app again."]} func2={() => setShowAlert(false)} func1={deleteAccount} />
                        <button className='text-sm font-medium cursor-pointer text-[#fefefe] bg-red-500 px-3 py-2.5 h-fit rounded-md hover:bg-red-400 transition-all duration-200' onClick={() => setShowAlert(true)}>Delete Account</button>
                    </div>

                    <hr className={`w-full ${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'}`} />

                    <div className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} my-4 flex gap-2.5 sm:gap-1 flex-col`}>
                        <h1 className='text-sm'>
                            Select Theme
                        </h1>

                        <Select value={toggleTheme ? 'dark' : 'light'} onValueChange={(value) => setToggleTheme && setToggleTheme(value === 'dark')}>
                            <SelectTrigger className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535] placeholder:text-[#fefefe]' : 'text-[#202020] placeholder:text-[#fefefe]'} w-[200px] sm:w-[300px] lg:w-[400px] cursor-pointer ml-auto`}>
                                <SelectValue defaultValue='light' placeholder="Light" />
                            </SelectTrigger>
                            <SelectContent className={`inter border ${toggleTheme ? 'bg-[#202020] border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'}`}>
                                <SelectItem value="light" className={`${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#f0f0f0]'} cursor-pointer`}>Light</SelectItem>
                                <SelectItem value="dark" className={`${toggleTheme ? 'hover:bg-[#353535]' : 'hover:bg-[#f0f0f0]'} cursor-pointer`}>Dark</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <hr className={`w-full ${toggleTheme ? 'border-[#202020]' : 'border-[#f0f0f0]'}`} />

                    <div className={`my-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                        <h1 className='text-sm'>
                            Emergency Contact
                        </h1>

                        <h1 className={`text-[15px] font-medium underline ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>@veloride.support.com</h1>
                    </div>

                </div>


            </div>
        </>
    )
}

export default Profile