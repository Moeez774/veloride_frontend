import { AlertCircle, X } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'

interface Details {
    message: string,
    showMessage: boolean,
    setShowMessage: Dispatch<SetStateAction<boolean>>,
    setLoader: Dispatch<SetStateAction<boolean>>,
}

const Loader: React.FC<Details> = ({ message, setLoader, showMessage, setShowMessage }) => {
    return (
        <div className='fixed left-0 flex justify-center items-center top-0 z-[100] bg-[#0000001e] w-screen h-screen'>
            {message === '' && <div className="loader"></div>}
            <div className="flex flex-col gap-2 w-80 sm:w-96 relative text-[10px] sm:text-xs z-[100]">
                <div style={{ zIndex: showMessage ? '50' : '-50', transition: 'all 0.2s ease-in-out', transform: showMessage ? 'scale(1)' : 'scale(0.9)', opacity: showMessage ? '1' : '0' }}
                    className="succsess-alert inter cursor-default flex items-center justify-between w-full py-3 rounded-lg bg-red-500 px-[10px]"
                >
                    <div className="flex gap-2 items-center">
                        <div className="text-[#2b9875] h-0 flex items-center bg-white/5 backdrop-blur-xl p-1 rounded-lg">
                            <AlertCircle size={25} color='#fefefe' />
                        </div>
                        <div>
                            <p className="text-white text-base">Error</p>
                            <p className="text-white text-xs">{message}</p>
                        </div>
                    </div>
                    <button onClick={() => {
                        setShowMessage(false)
                        setTimeout(() => setLoader(false), 200)
                    }}
                        className="text-gray-600 cursor-pointer text-gray-600 hover:bg-white/5 p-1 rounded-md transition-colors ease-linear"
                    >
                        <X size={20} color='#fefefe' />
                    </button>
                </div>
            </div>

        </div>
  )
}

export default Loader
