import { Eye, EyeOff } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface Details {
    pass: string,
    setPass: Dispatch<SetStateAction<string>>,
}

const Password: React.FC<Details> = ({ pass, setPass }) => {
    const [isFocused, setFocused] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const pathname = usePathname()

    return (
        <>
            <div className={`bg-[#fefefe] px-3 ${pathname==='/auth/sign-in'? 'w-[82vw] sm:w-96': 'w-[82vw] sm:w-96 lg:w-[22rem]'} border-[1.5px] ${isFocused ? 'border-[#202020]' : 'border-[#979797]'} rounded-lg border-solid shadow-md flex items-center`}>

                <input value={pass} onChange={(e) => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder='Password' className={`py-3 text-sm sm:text-base flex-1 pr-1 outline-none`} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />

                <Eye size={20} color={isFocused || pass.length>0? '#202020' : '#979797'} onClick={() => setShowPass(true)} className={`${!showPass ? 'block' : 'hidden'} cursor-pointer`} />

                <EyeOff size={20} color={isFocused || pass.length>0? '#202020' : '#979797'} onClick={() => setShowPass(false)} className={`${showPass? 'block' : 'hidden'} cursor-pointer`} />
            </div>
        </>
    )
}

export default Password
