import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ToolTip = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    return (
        <div>
            <Tooltip>
                <TooltipTrigger>
                    {icon}
                </TooltipTrigger>
                <TooltipContent className='bg-[#00563c] text-center text-[#fefefe] w-40 inter'>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export default ToolTip