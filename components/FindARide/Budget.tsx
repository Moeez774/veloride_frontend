'use cleint'
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronUp, Dot, HelpCircle } from 'lucide-react'
import Loader from '../Loader'
interface Details {
  price: number,
  setPrice: Dispatch<SetStateAction<number>>,
  rating: string,
  setRating: Dispatch<SetStateAction<string>>,
  currStep: number,
  location: { long: number, lat: number },
  dropLocation: { long: number, lat: number },
  vehicle: string
}


const Budget: React.FC<Details> = ({ price, setPrice, rating, setRating, currStep, location, dropLocation, vehicle }) => {

  const ratings = ['3 Stars', '4 Stars', '5 Stars']
  const [avgPrice, setAvgPrice] = useState(0)
  const [avgFare, setAvgFare] = useState(0)
  const [percentOff, setPercentOff] = useState(0)
  const [showToolTip, setShowToolTip] = useState(false)

  const [loader, setLoader] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')

  //sending request to server for fetching ride price whenever user goes to 3rd step
  useEffect(() => {
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
        setAvgFare(response.avgFare)
        setPrice(response.avgFare)
        setPercentOff(response.avgFare / 10)
      }
      else {
        setLoader(true)
        setMessage(response.message)
        setShowMessage(true)
      }
    }

    fetchPrice()
  }, [vehicle, currStep])

  return (

    <>
      {loader && <Loader setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} />}
      <div className={`inter ${currStep === 5 ? 'w-[85vw]' : 'w-[90vw]'} sm:w-[30rem] lg:w-[22rem] flex flex-col gap-8 text-[#202020]`}>

        {/* //showing prices */}
        <div className='flex flex-col gap-3'>

          <div className='flex justify-between items-center'>
            <h1 className='text-base font-medium'>Estimated Fare & Adjustments</h1>
            <TooltipProvider>
              <Tooltip open={showToolTip} onOpenChange={() => setShowToolTip(false)}>
                <TooltipTrigger onMouseLeave={() => setShowToolTip(false)} onMouseEnter={() => setShowToolTip(true)} onClick={() => setShowToolTip(true)} onBlur={() => setShowToolTip(false)}><HelpCircle size={20} color='#202020' /></TooltipTrigger>
                <TooltipContent className='inter w-48 text-center'>
                  <p>Adjust your fare as needed. The final split may vary based on passenger count.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className='flex justify-between mt-4 items-center gap-2'>
            <h1 className='text-sm flex items-center'><div className='w-1 mr-2 h-1 rounded-full bg-[#202020]'></div> Average price of this ride</h1>
            <div className='bg-transparent border-2 border-[#00b37e] rounded-md px-2.5 py-1.5 text-[14px] font-medium shadow-md flex items-center gap-1'>PKR {avgPrice}</div>
          </div>

          <div className='flex justify-between items-center gap-2'>
            <h1 className='text-sm flex items-center'><div className='w-1 mr-2 h-1 rounded-full bg-[#202020]'></div>Average fare of this ride</h1>
            <div className='bg-transparent border-2 border-[#00b37e] rounded-md px-2.5 py-1.5 text-[14px] font-medium shadow-md flex items-center gap-1'>PKR {avgFare}</div>
          </div>

          <div className='flex justify-between items-center gap-2'>
            <h1 className='text-sm flex items-center'><div className='w-1 mr-2 h-1 rounded-full bg-[#202020]'></div>Adjust your fare <p className='text-xs ml-0.5'>(up to 10%)</p></h1>
            <div className='bg-transparent w-[7rem] border-2 border-[#00b37e] rounded-md px-2 py-1.5 text-[14px] font-medium shadow-md flex items-center gap-1'>
              <h1 className='flex-1 w-full'>PKR {price}</h1>
              <div onClick={() => {
                if (percentOff > 0) {
                  setPrice(prev => prev - 1)
                  setPercentOff(prev => prev - 1)
                }
              }} className='p-0.5 bg-[#f0f0f0] cursor-pointer hover:bg-[#f7f3f3] transition-all duration-200 rounded-lg'>
                <ChevronDown size={15} style={{ strokeWidth: '3' }} color='#202020' />
              </div>
            </div>
          </div>

        </div>

        {/* // for selecting rating of driver */}
        <div className='flex flex-col mb-9 gap-8'>
          <label htmlFor="" className='inter font-medium text-[14px] flex items-end gap-1'>Minimum driver rating <p className='text-[11px] inter text-[#202020]'>(Optional)</p></label>

          <div className='w-[18rem] h-1 bg-[#b7b7b7]/70 -translate-y-1'>

            <div className='absolute w-full flex items-center justify-around -translate-y-[0.54rem]'>

              {ratings.map((e, index) => {
                return (
                  <div key={index} className='flex gap-2 flex-col items-center justify-center'>
                    <div onClick={() => setRating(e)} key={index} className={`w-[1.3rem] cursor-pointer transition-all duration-100 delay-100 flex justify-center items-center ${ratings.indexOf(rating) >= index ? 'bg-[#00b37e]' : 'bg-[#b7b7b7]'} h-[1.3rem] rounded-full`}>
                    </div>

                    <h1 className='text-xs font-normal'>{e}</h1>
                  </div>
                )
              })}

            </div>

            {/* // progress indicator */}
            <div className={`h-1 ${rating === ratings[0] ? 'w-[3rem]' : rating === ratings[1] ? 'w-[9rem]' : rating === ratings[2] ? 'w-[15rem]' : 'w-0'}  transition-all duration-300 bg-[#00b37e]`}></div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Budget
