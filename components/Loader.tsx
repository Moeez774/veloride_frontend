import { AlertCircle, Sparkles, X } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
    message: string,
    showMessage: boolean,
    setShowMessage: Dispatch<SetStateAction<boolean>>,
    setLoader: Dispatch<SetStateAction<boolean>>,
    statusCode?: number
}

const Loader: React.FC<Details> = ({ message, setLoader, showMessage, setShowMessage, statusCode }) => {
    const context = getContacts()
    const toggleTheme = context?.toggleTheme
    const isSuccess = statusCode === 200

    return (
        <div className='fixed left-0 flex justify-center items-center top-0 !z-[999999] bg-[#0000001e] w-screen h-screen'>
            {message === '' && <div className="loader !z-[999999]"></div>}
            <Dialog open={showMessage} onOpenChange={() => {
                setShowMessage(false)
                setTimeout(() => setLoader(false), 200)
            }}>
                <DialogTrigger></DialogTrigger>
                <DialogContent className={`inter w-[400px] !z-[999999] ${isSuccess
                    ? toggleTheme
                        ? 'text-[#fefefe] border bg-[#202020] border-[#353535]'
                        : 'text-[#202020] border bg-[#fefefe]'
                    : 'text-[#fefefe] border-none bg-red-500'}`}>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            {isSuccess ? (
                                <>
                                    Congratulations! <Sparkles size={16} color={toggleTheme ? '#fefefe' : '#202020'} />
                                </>
                            ) : (
                                <>
                                    Error <AlertCircle size={16} color='#fefefe' />
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className={`text-start ${isSuccess
                            ? toggleTheme
                                ? 'text-[#b1b1b1]'
                                : 'text-[#5b5b5b]'
                            : 'text-[#fefefe]'}`}>
                            {message}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Loader
