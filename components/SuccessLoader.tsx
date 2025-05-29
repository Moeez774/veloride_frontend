import { AlertCircle, Sparkles, X } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { getContacts } from '@/context/ContactsProvider'
interface Details {
    message: string,
    showMessage: boolean,
    setShowMessage: Dispatch<SetStateAction<boolean>>,
    setLoader: Dispatch<SetStateAction<boolean>>,
    statusCode: number
}

const SuccessLoader: React.FC<Details> = ({ message, setLoader, showMessage, setShowMessage, statusCode }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    return (
        <div className='fixed left-0 flex justify-center items-center top-0 z-[500] bg-[#0000001e] w-screen h-screen'>
            {message === '' && <div className="loader"></div>}
            <Dialog open={showMessage} onOpenChange={() => {
                setShowMessage(false)
                setTimeout(() => setLoader(false), 200)
            }}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className={`inter !z-999 ${toggleTheme ? 'text-[#fefefe] border bg-[#202020] border-[#353535]' : 'text-[#202020] border bg-[#fefefe]'}`}>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>Congratulations! <Sparkles size={20} color={toggleTheme ? '#fefefe' : '#202020'} /></DialogTitle>
                        <DialogDescription className={`${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>
                            {message}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default SuccessLoader
