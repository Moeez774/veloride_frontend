import { CheckIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'

interface Details {
    isAgree: boolean,
    setAgree: Dispatch<SetStateAction<boolean>>,
    tellMore: boolean,
    setTellMore: Dispatch<SetStateAction<boolean>>,
    number: string,
    setNumber: Dispatch<SetStateAction<string>>,
    city: string,
    setCity: Dispatch<SetStateAction<string>>,
    loader: boolean,
    setLoader: Dispatch<SetStateAction<boolean>>,
    saveUser: () => Promise<void>
}

const MoreInfo: React.FC<Details> = ({ tellMore, setTellMore, isAgree, setAgree, number, setNumber, city, setCity, saveUser }) => {
    
    return (
        <div className='fixed h-screen w-full flex justify-center items-center top-0 left-0' style={{ transition: 'all 0.2s ease-in-out', opacity: tellMore ? '1' : '0', transform: tellMore ? 'scale(1)' : 'scale(0.8)', zIndex: tellMore ? '50' : '-50' }}>

            <div className='w-11/12 max-w-3xl px-8 h-10/12 bg-white flex gap-4 flex-col justify-center items-center relative rounded-2xl shadow-2xl'>

                <div className='mb-4 flex-col gap-2 flex text-center'>
                    <h1 className='exo2 text-2xl sm:text-3xl font-semibold'>Complete your profile</h1>
                    <h1 className='inter text-xs sm:text-sm'> Enter your city and contact number to find the best carpool matches!</h1>
                </div>

                <div className='flex flex-col items-center gap-2'>
                    <div>
                        <input type="text" placeholder='Phone number' value={number} onChange={(e) => setNumber(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md  text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <input type="text" placeholder='City or Location' value={city} onChange={(e) => setCity(e.target.value)} className={`py-3 bg-[#fefefe] border-[1.5px] focus:border-[#202020] border-[#979797] rounded-lg border-solid shadow-md text-sm sm:text-base pl-3 w-[82vw] sm:w-96 lg:w-[22rem] pr-1 outline-none`} />
                    </div>
                </div>

                {/* //agree to policies */}
                <div className='flex justify-start items-center w-[82vw] sm:w-96 lg:w-[22rem] gap-1.5'>
                    <div className='w-[23px] h-[23px] flex items-center cursor-pointer justify-center rounded-full shadow-md' onClick={() => setAgree(!isAgree)} style={{ border: '1.5px solid #979797' }}>
                        <CheckIcon className={`${isAgree ? 'block' : 'hidden'}`} size={13} color='#202020' />
                    </div>
                    <div>
                        <h1 className='text-xs flex items-center gap-1'>I agree to <p className='underline'>Terms</p> and <p className='underline'>Privacy Policy</p> </h1>
                    </div>
                </div>

                <div className='mt-4'>
                    <button className='exo2 shadow-md font-bold w-[82vw] sm:w-96 lg:w-[22rem] bg-[#00b37e] hover:bg-[#00b37ddc] active:bg-[#00b377] transition-all duration-200 rounded-lg cursor-pointer py-3 text-[#fefefe]' onClick={async () => {
                        await saveUser()
                    }}>Confirm</button>
                </div>

            </div>

        </div>
    )
}

export default MoreInfo
