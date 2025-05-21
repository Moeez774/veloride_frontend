import React from 'react'

interface InputProps {
  toggleTheme: boolean | undefined;
  value: string | number;
  setValue: (value: string | number) => void;
  placeholder?: string;
  label: string,
  required?: boolean
}

const InputField = ({ toggleTheme, value, setValue, placeholder, label, required }: InputProps) => {
    return (
        <div className='flex w-full flex-col gap-1.5'>
            <label className={`text-[13px] gap-0.5 flex ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>{label} <p className='text-red-600 text-xs' style={{ display: required ? 'none' : 'inline' }}>*</p></label>
            <input value={value} type='email' placeholder={placeholder? placeholder: ''} onChange={(e) => setValue(e.target.value)} className={`border outline-none w-full text-sm font-normal focus:ring-1 flex gap-3 items-center justify-center rounded-md p-2.5 ${toggleTheme ? 'text-[#fefefe] focus:ring-[#fefefe] border-[#202020]' : 'text-[#202020] focus:ring-[#202020]'}`} />
        </div>
    )
}

export default InputField