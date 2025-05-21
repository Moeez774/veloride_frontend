'use cleint'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, Dot, HelpCircle } from 'lucide-react'
import '@/app/(HomePage)/Main.css'
import Loader from '@/components/Loader'
import { getContacts } from '@/context/ContactsProvider'

interface Details {
  price: number,
  setPrice: Dispatch<SetStateAction<number>>,
  rating: string,
  setRating: Dispatch<SetStateAction<string>>,
  currStep: number,
  location: { long: number, lat: number },
  dropLocation: { long: number, lat: number },
  vehicle: string,
  seats: boolean[] | undefined,
  setSeats: Dispatch<SetStateAction<boolean[] | undefined>>
}

const Budget: React.FC<Details> = ({ seats, setSeats, price, setPrice, currStep, location, dropLocation, vehicle }) => {
  const context = getContacts()
  const toggleTheme = context?.toggleTheme
  const [avgPrice, setAvgPrice] = useState(0)
  const [showToolTip, setShowToolTip] = useState(false)
  const [showToolTip2, setShowToolTip2] = useState(false)
  const [loader, setLoader] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')

  // for selecting fare according to seats
  const [avgFare, setAvgFare] = useState<any[]>([])

  const fetchPrice = async () => {
    let a = await fetch('http://localhost:4000/rides/fetchPrice', {
      method: "POST", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pickupLocation: location, dropOffLocation: dropLocation, vehicle: vehicle })
    })
    const response = await a.json()
    if (response.statusCode === 200) {
      setLoader(false)
      setAvgPrice(response.price)
      setAvgFare(response.allFares)
      const initialSeats = Array(response.allFares.length).fill(false)
      initialSeats[0] = true
      setSeats(initialSeats)
      setPrice(response.allFares[0].fare)
    }
    else {
      setPrice(0)
      setLoader(true)
      setMessage(response.message)
      setShowMessage(true)
    }
  }

  //sending request to server for fetching ride price whenever user goes to 3rd step
  useEffect(() => {
    if (currStep === 3) fetchPrice()
  }, [vehicle, currStep])

  //will only fetchPrices when location or vehicel get change in last step
  useEffect(() => {
    if (currStep === 5) fetchPrice()
  }, [location, dropLocation, vehicle])

  return (
    <>
      {loader && <Loader setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} />}
      <div className={`inter w-[85vw] sm:w-[30rem] lg:w-[22rem] flex flex-col gap-8 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>

        {/* //showing prices */}
        <div className='flex flex-col gap-3'>

          <div className='flex justify-between items-center'>
            <h1 className='text-base font-medium'>Estimated Fare & Adjustments</h1>
            <TooltipProvider>
              <Tooltip open={showToolTip} onOpenChange={() => setShowToolTip(false)}>
                <TooltipTrigger onMouseLeave={() => setShowToolTip(false)} onMouseEnter={() => setShowToolTip(true)} onClick={() => setShowToolTip(true)} onBlur={() => setShowToolTip(false)}>
                  <HelpCircle size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                </TooltipTrigger>
                <TooltipContent className={`inter relative z-[100] w-48 text-center ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] text-[#fefefe]' : 'bg-white text-[#202020]'}`}>
                  <p>Adjust your fare as needed. The final split may vary based on passenger count.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='flex justify-between mt-4 items-center gap-2'>
            <h1 className='text-sm flex items-center'>
              <div className={`w-1 mr-2 h-1 rounded-full ${toggleTheme ? 'bg-[#fefefe]' : 'bg-[#202020]'}`}></div> Average price of this ride
            </h1>
            <div className={`bg-transparent border-2 ${toggleTheme ? 'border-[#048C64] text-[#fefefe]' : 'border-[#00b37e] text-[#202020]'} rounded-md px-2.5 py-1.5 text-[14px] font-medium shadow-md flex items-center gap-1`}>
              PKR {avgPrice}
            </div>
          </div>

          <div className='flex flex-col mt-4 items-center gap-5'>

            <div className='flex justify-between w-full items-center'>
              <h1 className='text-sm font-medium'>Choose your fare based on booked seats</h1>
              <TooltipProvider>
                <Tooltip open={showToolTip2} onOpenChange={() => setShowToolTip2(false)}>
                  <TooltipTrigger onMouseLeave={() => setShowToolTip2(false)} onMouseEnter={() => setShowToolTip2(true)} onClick={() => setShowToolTip2(true)} onBlur={() => setShowToolTip2(false)}>
                    <HelpCircle size={20} color={toggleTheme ? '#fefefe' : '#202020'} />
                  </TooltipTrigger>
                  <TooltipContent className={`inter relative z-[100] w-48 text-center ${toggleTheme ? 'bg-[#0d0d0d] border border-[#202020] text-[#fefefe]' : 'bg-white text-[#202020]'}`}>
                    <p>Fare is based on booked seats. Selecting 0 or 1 booked seat gives you a higher chance of faster ride matching.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {avgFare.length === 0 && <div className='w-full flex justify-center'>
              <div className={`${toggleTheme ? 'darkLoader' : 'searchLoader'}`}></div>
            </div>}

            {avgFare && seats && <div className='grid items-center grid-cols-2 sm:grid-cols-3 gap-2 w-full'>
              {avgFare.map((e, index) => {
                return (
                  <div key={index} className='flex flex-col gap-1'>
                    <h1 className={`text-sm font-semibold transition-all duration-200 ${seats[index]
                      ? toggleTheme ? 'text-[#048C64]' : 'text-[#00b37e]'
                      : toggleTheme ? 'text-[#b1b1b1]' : 'text-[gray]'}`}>
                      {e.bookedSeats}
                    </h1>
                    <div
                      className={`bg-transparent cursor-pointer transition-all duration-200 border-2 flex items-center gap-1 ${seats[index]
                        ? toggleTheme ? 'border-[#048C64]' : 'border-[#00b37e]'
                        : toggleTheme ? 'border-[#2d2d2d]' : 'border-[#e0e0e0]'
                        } rounded-sm px-2.5 py-2.5 text-[15px] font-medium`}
                      onClick={() => {
                        setPrice(e.fare)
                        setSeats(prevSeats =>
                          prevSeats?.map((_, i) => i === index ? true : false)
                        )
                      }}>
                      <div className={`h-4 w-4 transition-all duration-200 rounded-full ${seats[index]
                        ? toggleTheme ? 'bg-[#048C64]' : 'bg-[#00be7e]'
                        : toggleTheme ? 'bg-[#2d2d2d]' : 'bg-[#e0e0e0]'
                        }`}></div>
                      <h1>Rs.{e.fare}</h1>
                    </div>
                  </div>
                )
              })}
            </div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Budget
