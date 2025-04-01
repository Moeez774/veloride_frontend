import React, { Dispatch, SetStateAction } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='exo2'>{statements[0]}</AlertDialogTitle>
                        <AlertDialogDescription className='inter'>
                        {statements[1]}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='exo2 font-semibold cursor-pointer' onClick={() => {
                            func2()
                            document.body.style.overflowY = 'auto'
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction className='bg-[#00b37e] hover:bg-[#00b37dc7] active:bg-[#00b36e] exo2 cursor-pointer font-semibold' onClick={() => func1()}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default Alert
