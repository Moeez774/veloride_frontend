import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tag } from "lucide-react";

const ToolTip = () => {
    const [showToolTip, setShowToolTip] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(timeoutId); // Clear the previous timeout if scrolling continues

            // Reset isScrolling state after scrolling stops
            timeoutId = setTimeout(() => setIsScrolling(false), 300);
        };

        window.addEventListener("scroll", handleScroll);

            intervalId = setInterval(() => {
                if (!isScrolling) { // Show tooltip only if not scrolling
                    setShowToolTip(true);

                    const hideTimeout = setTimeout(() => {
                        setShowToolTip(false);
                    }, 2000);

                    return () => clearTimeout(hideTimeout);
                }
            }, 3000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isScrolling]);

    return (
        <>
        <TooltipProvider>
            <Tooltip open={showToolTip} onOpenChange={() => setShowToolTip(false)}>
                <TooltipTrigger>
                    <Tag size={27} style={{ animation: 'bellRing 0.9s ease-in-out infinite' }} color='#00b37e' className='cheapIcon' fill='#00b37e' />
                </TooltipTrigger>
                <TooltipContent>
                    <p className='inter'>Best Deal</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        </>
    )
};

export default ToolTip;
