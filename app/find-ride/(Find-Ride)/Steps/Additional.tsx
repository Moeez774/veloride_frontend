'use client'
import { Camera } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Checkbox from '@/components/hooks/Checkbox'
import { usePathname } from 'next/navigation'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
    photo: string,
    setPhoto: Dispatch<SetStateAction<string>>,
    email: boolean,
    setEmail: Dispatch<SetStateAction<boolean>>,
    number: boolean,
    setNumber: Dispatch<SetStateAction<boolean>>,
    instruct: string,
    setInstruct: Dispatch<SetStateAction<string>>
}

const Additional: React.FC<Details> = ({ photo, email, setEmail, number, setNumber, setPhoto, instruct, setInstruct }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const pathname = usePathname()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setUploading] = useState(false)

    return (
        <div className={`${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} w-[80vw] sm:w-[20rem] lg:w-auto flex flex-col gap-6 inter`}>

            <div className='flex flex-col sm:flex-row items-center gap-4'>
                {photo === "" && <div onClick={() => inputRef.current?.click()} className={`h-32 cursor-pointer w-32 flex justify-center items-center ${toggleTheme ? 'bg-[#2d2d2d]' : 'bg-[#eaeaea]'} rounded-full shadow-md`}>
                    <Camera size={30} color={toggleTheme ? '#fefefe' : '#202020'} />
                </div>}

                {photo === '' && <div className='fixed opacity-0 left-0 top-0 w-0 -z-10'>
                    <input ref={inputRef} onChange={async (e) => {
                        const file = e.target.files?.[0] as File;
                        if (!file) return;

                        setUploading(true);

                        const data = new FormData();
                        data.append('file', file);

                        try {
                            const uploadImg = await fetch('http://localhost:4000/files/upload', {
                                method: "POST",
                                body: data
                            })

                            const response = await uploadImg.json();
                            if (response.url) {
                                setPhoto(response.url);
                            } else {
                                console.error("Upload failed", response);
                            }
                        } catch (error) {
                            console.error("Error uploading image", error);
                        }

                        setUploading(false);
                    }} type="file" />
                </div>}

                {photo != "" && <div>
                    <img className="w-32 rounded-full" src={photo} alt="" />
                </div>}

                <h1 className='flex items-end gap-1'>Profile picture <p className='text-[11px]'>(Optional)</p></h1>
            </div>

            {/* input about special instruction */}
            <div className='flex flex-col gap-1.5'>
                <label htmlFor="" className={`inter font-medium text-[14px] flex items-end gap-1`}>Special instruction <p className={`text-[11px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#202020]'}`}>(Optional)</p></label>
                <textarea
                    placeholder={pathname.startsWith('/find-ride') ? 'Prefer front seat, Traveling with a child etc.' : 'Any instruction about ride'}
                    value={instruct}
                    onChange={(e) => setInstruct(e.target.value)}
                    rows={4}
                    className={`py-3 ${toggleTheme ? 'bg-[#2d2d2d] text-[#fefefe] placeholder:text-[#b1b1b1]' : 'bg-[#EAEAEA] placeholder:text-[#a4a4a4] text-[#202020]'} text-sm flex-1 pr-2 pl-3 resize-none h-60 outline-none inter w-[80vw] sm:w-[30rem] lg:w-[22rem] rounded-md border-solid shadow-md`}
                />
            </div>

            <div className='flex flex-col gap-1 w-[80vw] sm:w-[30rem] lg:w-[22rem]'>
                <h1 className={`text-[14px] font-medium inter ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Important!</h1>

               { pathname.startsWith("/find-ride") && <p className={`text-[12px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>You’ll get a secure OTP after booking. Show it to the driver before entering.
                    Only step in once your driver confirms it. Do not share this code with anyone else.</p> }

                {pathname.startsWith('/offer-ride') && <p className={`text-[12px] inter ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Before starting the ride, ask the rider to show their Ride OTP.
                Only start the trip if the code matches exactly. Do not allow anyone to enter the vehicle if the OTP is incorrect or missing.
                This step helps prevent fraud and keeps everyone safe.</p>}
            </div>
        </div>
    )
}

export default Additional
