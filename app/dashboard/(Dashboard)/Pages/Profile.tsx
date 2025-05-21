'use client'
import React, { useState } from 'react'
import { Mail, Phone, Pencil } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Alert from '@/components/hooks/Alert'
interface ProfileProps {
    user: any,
    toggleTheme: boolean | undefined
}

const Profile = ({ user, toggleTheme }: ProfileProps) => {
    const [showAlert, setShowAlert] = useState(false)

    const deleteAccount = async() => {
        try {
            const response = await fetch(`http://localhost:4000/users/delete-account?id=${user._id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const data = await response.json()
            alert(data.message)
            window.location.href = '/hop-in'
        } catch(err) {
            alert(err)
        }
    }
    return (
        <div className={`${toggleTheme? 'text-[#fefefe] bg-[#0d0d0d]': 'text-[#202020] bg-[#fefefe]'} w-full h-full overflow-y-auto px-6 sm:px-10 pt-7 sm:pt-10 pb-6 rounded-3xl`} style={{ scrollbarWidth: 'thin' }}>

            <div className='flex flex-col w-full'>

                <div className='flex items-start justify-between gap-2'>
                    <div className='flex flex-col'>
                        <div className='w-fit flex items-center' style={{ userSelect: 'none' }}>
                            {/* if user hasn't any photo */}
                            {user.photo?.startsWith("hsl") && (
                                <div className={`rounded-full flex justify-center items-center text-white w-28 h-28`} style={{ background: user.photo }}>
                                    <h1 className='inter md:text-5xl'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                                </div>
                            )}

                            {/* user with profile */}
                            {!user.photo?.startsWith("hsl") && (
                                <div>
                                    <img className={`w-28 transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                                </div>
                            )}
                        </div>

                        <h1 className='text-2xl mt-6 font-medium'>{user?.fullname}</h1>

                        <div className={`flex mt-2 flex-col sm:flex-row sm:items-center text-[13px] gap-2.5 sm:gap-6 ${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'}`}>
                            <h1 className='flex items-center gap-1.5'><Mail size={14} /> {user?.email}</h1>
                            <h1 className='flex items-center gap-1.5'><Phone size={14} /> {user?.number}</h1>
                        </div>
                    </div>

                    {/* Edit button */}
                    <button className={`p-2.5 rounded-full cursor-pointer ${toggleTheme? 'bg-[#202020] hover:bg-[#202020cc]': 'bg-[#f0f0f0] hover:bg-[#f7f7f7]'}`}><Pencil size={20} color={toggleTheme? '#fefefe': '#202020'} /> </button>
                </div>

                <div className={`${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'} flex gap-[0.90rem] flex-col mt-6`}>
                    <h1 className={`${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'} text-[15px] font-medium flex gap-2.5 items-center`}>Car Details <Pencil className='cursor-pointer' size={13} color={toggleTheme? '#fefefe': '#202020'} /></h1>

                    <div className='grid grid-cols-2 gap-y-4 sm:gap-0 sm:flex sm:items-center'>
                        <h1 className={` text-[13px]`}>
                            Brand
                            <p className={`text-sm mt-2.5 ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'} font-medium`}>Toyota</p>
                        </h1>

                        <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]'}`}></div>

                        <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                            Model
                            <p className={`text-sm mt-2.5 font-medium ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'}`}>Corolla</p>
                        </h1>

                        <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]'}`}></div>

                        <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                            Color
                            <p className={`text-sm mt-2.5 font-medium ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'}`}>White</p>
                        </h1>

                        <div className={`ml-10 h-14 hidden sm:block w-[2px] ${toggleTheme? 'bg-[#202020]': 'bg-[#f0f0f0]'}`}></div>

                        <h1 className={`sm:ml-[0.90rem] text-[13px]`}>
                            Avg Available Seats
                            <p className={`text-sm mt-2.5 font-medium ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'}`}>2</p>
                        </h1>

                    </div>
                </div>

                <hr className={`mt-6 w-full ${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />

                <div className={`${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'} my-4 flex flex-col gap-2.5 sm:gap-0 sm:flex-row sm:items-center justify-between pr-2`}>
                    <h1 className='text-sm'>
                        Account Creation Date
                        <p className={`text-sm sm:text-[15px] mt-1 sm:mt-2 font-medium ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'}`}>March 03, 2025</p>
                    </h1>

                    <Alert item={showAlert} setter={setShowAlert} statements={['Are you sure you want to delete your account?', "This action can't be undone. You'll lose all data of your account and you have to make another account for accessing app again."]} func2={() => setShowAlert(false)} func1={deleteAccount} />
                    <button className='text-sm font-medium cursor-pointer text-[#fefefe] bg-red-500 px-3 py-2.5 h-fit rounded-md hover:bg-red-400 transition-all duration-200' onClick={() => setShowAlert(true)}>Delete Account</button>
                </div>

                <hr className={`w-full ${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />

                <div className={`${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'} my-4 flex gap-2.5 sm:gap-1 flex-col`}>
                    <h1 className='text-sm'>
                        Preferred Language
                    </h1>

                    <Select>
                        <SelectTrigger className={`${toggleTheme? 'text-[#fefefe] placeholder:text-[#fefefe]': 'text-[#202020] placeholder:text-[#fefefe]'} w-[200px] sm:w-[300px] lg:w-[400px] cursor-pointer ml-auto`}>
                            <SelectValue defaultValue='English' placeholder="English" />
                        </SelectTrigger>
                        <SelectContent className={`inter ${toggleTheme? 'bg-[#0d0d0d] text-[#fefefe]': 'bg-[#fefefe] text-[#202020]'}`}>
                            <SelectItem value="light">English</SelectItem>
                            <SelectItem value="dark">Urdu</SelectItem>
                            <SelectItem value="system">Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <hr className={`w-full ${toggleTheme? 'border-[#202020]': 'border-[#f0f0f0]'}`} />

                <div className={`my-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between sm:items-center ${toggleTheme? 'text-[#b1b1b1]': 'text-[#5b5b5b]'}`}>
                <h1 className='text-sm'>
                        Emergency Contact
                    </h1>

                    <h1 className={`text-[15px] font-medium underline ${toggleTheme? 'text-[#fefefe]': 'text-[#202020]'}`}>@veloride.support.com</h1>
                </div>

            </div>


        </div>
    )
}

export default Profile