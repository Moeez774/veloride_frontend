import { Camera } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Checkbox from './Checkbox'
import { usePathname } from 'next/navigation'
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

    const pathname = usePathname()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setUploading] = useState(false)

    return (

        <div className='text-[#202020] w-[80vw] sm:w-[30rem] lg:w-auto flex flex-col gap-6 inter'>

            <div className='flex flex-col sm:flex-row items-center gap-4'>
                {photo === "" && <div onClick={() => inputRef.current?.click()} className='h-32 cursor-pointer w-32 flex justify-center items-center bg-[#eaeaea] rounded-full shadow-md'>
                    <Camera size={30} color='#202020' />
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
                <label htmlFor="" className='inter font-medium text-[14px] flex items-end gap-1'>Special instruction <p className='text-[11px] inter text-[#202020]'>(Optional)</p></label>
                <textarea placeholder={pathname.startsWith('/find-ride') ? 'Prefer front seat, Traveling with a child etc.' : 'Any instruction about ride'} value={instruct} onChange={(e) => setInstruct(e.target.value)} rows={4} className={`py-3 bg-[#EAEAEA] placeholder:text-[#a4a4a4] text-sm flex-1 pr-2 pl-3 resize-none h-60 outline-none inter w-[80vw] sm:w-[30rem] lg:w-[22rem] rounded-md border-solid shadow-md`} />
            </div>

            <div className='flex flex-col gap-3'>

                <h1 className='text-[14px] font-medium inter'>Verify via</h1>

                <div className='flex items-center justify-between'>
                    <Checkbox text='Email' item={email} setter={setEmail} />
                    <Checkbox text='Phone number' item={number} setter={setNumber} />
                </div>

            </div>

        </div>

    )
}

export default Additional
