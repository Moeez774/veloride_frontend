import { Camera, Pencil } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import countries from '@/public/data/countries.json'
import { Button } from '@/components/ui/button'
import Loader from '@/components/Loader'

const EditProfile = ({ toggleTheme, user, setUser }: { toggleTheme: boolean | undefined, user: any, setUser: Dispatch<SetStateAction<any>> | undefined }) => {
    const [editProfile, setEditProfile] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [image, setImage] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [country, setCountry] = useState<string>(countries[0].phone)

    //states for loading
    const [loader, setLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [statusCode, setStatusCode] = useState(0)

    useEffect(() => {
        if (!user) return
        setName(user.fullname)
        setNumber(user.number.slice(3))
    }, [user])

    const updateProfile = async () => {
        setLoader(true)
        setMessage('')
        setShowMessage(false)
        setStatusCode(0)

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/profile-update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullname: name,
                    number: country + number,
                    photo: image ? image : user?.photo,
                    userId: user?._id
                })
            })

            const data = await res.json()

            setMessage(data.message)
            setShowMessage(true)
            setStatusCode(data.statusCode)

            if(data.statusCode === 200) {
                setEditProfile(false)
                setUser &&
                setUser((prev: any) => ({
                    ...prev,
                    fullname: name,
                    number: country + number,
                    photo: image || user.photo,
                }))
            }
        } catch (err: any) {
            setMessage(err.message || 'Something went wrong')
            setShowMessage(true)
            setStatusCode(err.statusCode)
        }

    }

    return (
        <>

            {loader && <Loader message={message} showMessage={showMessage} setShowMessage={setShowMessage} setLoader={setLoader} statusCode={statusCode} />}

            <div>
                <Dialog open={editProfile} onOpenChange={setEditProfile}>
                    <DialogTrigger onClick={() => setEditProfile(true)} className={`p-2.5 rounded-full cursor-pointer ${toggleTheme ? 'bg-[#202020] hover:bg-[#202020cc]' : 'bg-[#f0f0f0] hover:bg-[#f7f7f7]'}`}><Pencil size={20} color={toggleTheme ? '#fefefe' : '#202020'} /></DialogTrigger>
                    <DialogContent className={`${toggleTheme ? 'bg-[#202020] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020]'} border-none`}>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>

                            <div className='mt-6 flex flex-col items-center'>
                                <div className='relative w-fit flex items-center' style={{ userSelect: 'none' }}>
                                    {/* Profile image display */}
                                    {image ? (
                                        <div>
                                            <img className={`w-20 transition-all duration-200 rounded-full`} src={image} alt="" />
                                        </div>
                                    ) : user.photo?.startsWith("hsl") ? (
                                        <div className={`rounded-full flex justify-center items-center text-white w-20 h-20`} style={{ background: user.photo }}>
                                            <h1 className='inter text-3xl'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                                        </div>
                                    ) : (
                                        <div>
                                            <img className={`w-20 transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                                        </div>
                                    )}

                                    {/* Camera overlay */}
                                    <div
                                        onClick={() => inputRef.current?.click()}
                                        onMouseEnter={() => setIsHover(true)}
                                        onMouseLeave={() => setIsHover(false)}
                                        className='absolute w-20 h-20 bg-transparent transition-all duration-200 hover:bg-[#00000079] flex items-center justify-center cursor-pointer rounded-full'
                                    >
                                        <Camera className={`${isHover ? 'opacity-100' : 'opacity-0'} transition-all duration-200`} size={25} color={'#fefefe'} />
                                    </div>

                                    {/* Hidden file input - always available */}
                                    <div className='fixed opacity-0 left-0 top-0 w-0 -z-10'>
                                        <input
                                            ref={inputRef}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0] as File;
                                                if (!file) return;

                                                setUploading(true)

                                                const data = new FormData();
                                                data.append('file', file);

                                                try {
                                                    const uploadImg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
                                                        method: "POST",
                                                        body: data
                                                    })

                                                    const response = await uploadImg.json();
                                                    if (response.url) {
                                                        setImage(response.url);
                                                    } else {
                                                        console.error("Upload failed", response);
                                                    }
                                                } catch (error) {
                                                    console.error("Error uploading image", error);
                                                }

                                                setUploading(false);
                                            }}
                                            type="file"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <h1 className='text-sm mt-4'>Change Profile Photo</h1>
                            </div>

                            <div className='mt-3'>
                                <label htmlFor="name" className='text-sm mb-1.5 font-medium flex items-center gap-2'>Name</label>
                                <Input value={name} placeholder='Enter Name' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className='mt-3'>
                                <label htmlFor="number" className='text-sm mb-1.5 font-medium flex items-center gap-2'>Phone Number</label>

                                <div className='flex items-center gap-2'>
                                    <Select value={country} onValueChange={setCountry}>
                                        <SelectTrigger className={`w-[150px] border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'}`}>
                                            <SelectValue placeholder="Theme" />
                                        </SelectTrigger>
                                        <SelectContent className={`${toggleTheme ? 'bg-[#202020] border border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] border text-[#202020]'} max-h-[300px] overflow-y-auto`}>
                                            {countries.map((country, index) => (
                                                <SelectItem key={index} className={`flex items-center gap-1 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`} value={country.phone}>
                                                    <img className='w-5' src={country.flag} alt="" />
                                                    {country.phone}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input maxLength={10} value={number} placeholder='Enter Phone Number' className={`border ${toggleTheme ? 'text-[#fefefe] border-[#353535]' : 'text-[#202020]'} w-full`} onChange={(e) => setNumber(e.target.value)} />
                                </div>
                            </div>
                        </DialogHeader>
                        <DialogFooter className='mt-6'>
                            <Button onClick={() => setEditProfile(false)} className={`${toggleTheme ? 'border-[#353535] text-[#fefefe] hover:bg-[#353535]' : 'hover:bg-[#f0f0f0] text-[#202020]'} border transition-all duration-200 cursor-pointer bg-transparent`}>Cancel</Button>
                            <Button disabled={loader} className='bg-[#00563c] hover:bg-[#00563ccc] cursor-pointer' onClick={updateProfile}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default EditProfile