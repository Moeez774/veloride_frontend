import { Mail, Phone, Search, User2Icon } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Support = () => {
    return (
        <div className='inter flex flex-col md:flex-row gap-10 md:gap-2 px-2 mt-4 md:px-1.5 pt-1.5 pb-4 md:justify-between'>
            <div className='flex w-full flex-col gap-4'>
                <h1 className='text-2xl font-semibold'>Report a problem</h1>

                <div className='w-full flex flex-col gap-5'>

                    <div className='flex flex-col gap-1.5 w-full'>
                        <label htmlFor="" className='text-[13px]'>Your name</label>

                        <input type="text" className='bg-[#eaeaea] text-[15px] focus:outline focus:outline-[#d0d0d0] w-full sm:w-[25em] shadow-md rounded-lg px-3 py-[0.85rem]' placeholder='Jhon Doe' />
                    </div>

                    <div className='flex items-center gap-2'>

                        <Dialog>
                            <DialogTrigger>
                                <div className='p-3 w-fit hover:bg-[#eeeeee] transition-all duration-200 cursor-pointer rounded-full bg-[#eaeaea] shadow-md'>
                                    <User2Icon size={20} color='#202020' />
                                </div>
                            </DialogTrigger>
                            <DialogContent className='h-[20em]'>
                                <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                    <div className='inter py-4'>
                                        <div className='flex items-center bg-transparent gap-2'>
                                            <input type="text" placeholder='Mention passenger here' className='bg-transparent border text-[15px] outline-none focus:border-[#202020] border-[#d0d0d0] p-2.5 w-full rounded-lg' />

                                            <div className='p-2.5 cursor-pointer hover:bg-[#eeeeee] transition-all duration-200 bg-[#eaeaea] rounded-full shadow-md'>
                                            <Search color='#202020' size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <h1 className='text-[13px] flex items-end gap-1'>Mention any problematic passenger <p className='text-[11px]'>(Optional)</p></h1>
                    </div>

                    {/* //about issue */}
                    <div className='flex flex-col gap-1.5 w-full'>
                        <label htmlFor="" className='text-[13px]'>About the issue</label>
                        <textarea className='bg-[#eaeaea] focus:outline text-[15px] focus:outline-[#d0d0d0] resize-none w-full shadow-md rounded-lg p-3' style={{ scrollbarWidth: 'thin' }} rows={7} placeholder="I'm going through issue related to payement."></textarea>
                    </div>

                    {/* //submit button */}
                    <div className='mt-2'>
                        <button className='bg-[#00b37e] transition-all duration-200 active:bg-[#00b35f] px-8 py-3 exo2 font-semibold text-[16px] shadow-md rounded-lg text-[#fefefe] cursor-pointer hover:bg-[#00b37dda]'>Submit</button>
                    </div>

                </div>
            </div>

            <div className='py-4 md:p-4 flex flex-col gap-4'>
                <h1 className='font-medium'>Emergancy help</h1>

                <div className='flex justify-between md:justify-start md:flex-col text-sm gap-2.5'>
                    <h1 className='flex items-center gap-1 underline'><Mail size={17} color='#202020' /> veloride@support.com</h1>
                    <h1 className='flex items-center gap-1'><Phone size={17} color='#202020' /> +923148701650</h1>
                </div>
            </div>
        </div>
    )
}

export default Support
