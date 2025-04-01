'use client'
import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Delete, Image, Plus } from 'lucide-react'

interface Details {
    image: string,
    setImage: Dispatch<SetStateAction<string>>
}

const UploadImg: React.FC<Details> = ({ image, setImage }) => {

    const [isUploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isHovered, setHovered] = useState(false)

    return (
        <>
            {image !== '' && (
                <div className='w-full my-8 flex justify-center relative'>
                    <div className='flex justify-center'>
                        <div className='w-full flex p-0 justify-end absolute'>
                            <div className='bg-[#4D4C4C] active:bg-[#3f3f3f] active:scale-95 transition-all duration-200 hover:bg-[#5a5959] p-1.5 md:p-2 cursor-pointer rounded-full text-[#dbdbdb]' onClick={() => setImage('')} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                                <Delete size={17} color='white' />
                            </div>
                            <div className='text-[#ffffff] w-32 justify-center items-center rounded-lg mt-12 py-3 px-0 bg-[#252525] z-20 absolute' style={{ border: '1px solid #f6e7d8', display: isHovered ? 'flex' : 'none' }}>
                                <h1 className='font-normal tracking-[0.5px] text-center text-xs texts'>Remove Image</h1>
                            </div>
                        </div>
                        <img className='w-full md:w-11/12 lg:w-10/12 rounded-lg' src={image} alt="Uploaded" />
                    </div>
                </div>
            )}

            {image === '' && (
                <div>
                    <div className='fixed opacity-0 left-0 top-0 w-0 -z-10'>
                        <input ref={inputRef} onChange={async (e) => {
                            const file = e.target.files?.[0] as File;
                            if (!file) return;
                            
                            setUploading(true);
                            
                            const data = new FormData();
                            data.append('file', file);

                            try {
                                const uploadImg = await fetch('/api/files/upload', {
                                    method: "POST",
                                    body: data
                                });

                                const response = await uploadImg.json();
                                if (response.imageUrl) {
                                    setImage(response.imageUrl);
                                } else {
                                    console.error("Upload failed", response);
                                }
                            } catch (error) {
                                console.error("Error uploading image", error);
                            }
                            
                            setUploading(false);
                        }} type="file" />
                    </div>

                    <div>
                        <button onClick={() => inputRef.current?.click()} className='headings active:bg-[#3f3f3f] active:scale-95 transition-all duration-200 hover:bg-[#5a5959] text-xs flex bg-[#4D4C4C] gap-1 py-3 px-4 items-center text-[#dbdbdb]' style={{ borderRadius: '50px' }} disabled={isUploading}>
                            {isUploading ? 'Uploading...' : 'Image'} <Image style={{ display: isUploading ? 'none' : 'block' }} color='#F6E7D8' size={17} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default UploadImg;
