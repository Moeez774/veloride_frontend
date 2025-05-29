import React, { Dispatch, SetStateAction } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toggleTheme } from '@/app/(HomePage)/MainMap'
interface Details {
    item: boolean,
    setter: Dispatch<SetStateAction<boolean>>,
    statements: string[],
    func1: () => void,
    func2: () => void,
}

const Alert: React.FC<Details> = ({ item, setter, statements, func1, func2 }) => {
    return (
        <div className='inter'>
            <AlertDialog open={item} onOpenChange={() => setter(false)}>
                <AlertDialogContent className={`${toggleTheme() ? 'bg-[#202020] border border-[#353535] text-[#fefefe]' : 'bg-[#fefefe] text-[#202020] border'} inter`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle >{statements[0]}</AlertDialogTitle>
                        <AlertDialogDescription className={`${toggleTheme() ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} inter`}>
                            {statements[1]}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='mt-3'>
                        <AlertDialogCancel className={`font-semibold bg-transparent border cursor-pointer ${toggleTheme() ? 'hover:text-[#fefefe] hover:bg-[#353535] border-[#353535] border' : 'text-[#202020] hover:bg-[#f7f7f7] border'}`} onClick={() => {
                            document.body.style.overflowY = 'auto'
                            func2()
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className={`${toggleTheme() ? 'bg-[#00563c] hover:bg-[#00563ccc] active:bg-[#00563c]' : 'bg-[#00563c] hover:bg-[#00563ccc] active:bg-[#00563c]'} inter  cursor-pointer font-semibold`} onClick={() => func1()}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Alert
