'use cleint'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Checkbox from './Checkbox'

interface Details {
  price: string,
  setPrice: Dispatch<SetStateAction<string>>,
  rating: string,
  setRating: Dispatch<SetStateAction<string>>,
  negotiate: boolean,
  setNegotiate: Dispatch<SetStateAction<boolean>>
  daily: boolean,
  setDaily: Dispatch<SetStateAction<boolean>>,
  oneTime: boolean,
  setOneTime: Dispatch<SetStateAction<boolean>>,
  weekly: boolean,
  setWeekly: Dispatch<SetStateAction<boolean>>
}


const Budget: React.FC<Details> = ({ price, negotiate, setNegotiate, setPrice, rating, setRating, weekly, setDaily, setWeekly, setOneTime, oneTime, daily }) => {

  const boxes = ['Up to $10', '$10 - $20', '$20 - $50', 'Above $50']
  const ratings = ['3 Stars', '4 Stars', '5 Stars']

  return (
    <div className='inter w-[80vw] sm:w-[30rem] lg:w-[22rem] flex flex-col gap-5 text-[#202020]'>

      {/* // for selecting budget range */}
      <div className='flex mb-9 flex-col gap-8'>
        <label htmlFor="" className='inter font-medium text-[14px]'>Fare range</label>

        <div className='w-full h-1 bg-[#b7b7b7]/70 -translate-y-1'>

          <div className='absolute w-full flex items-center justify-around -translate-y-[0.54rem]'>

            {boxes.map((e, index) => {
              return (
                <div key={index} className='flex gap-2 flex-col items-center justify-center'>
                  <div onClick={() => setPrice(e)} key={index} className={`w-[1.3rem] cursor-pointer transition-all duration-100 delay-100 flex justify-center items-center ${boxes.indexOf(price) >= index ? 'bg-[#00b37e]' : 'bg-[#b7b7b7]'} h-[1.3rem] rounded-full`}>
                  </div>

                  <h1 className='text-xs font-normal'>{e}</h1>
                </div>
              )
            })}

          </div>

          {/* // progress indicator */}
          <div className={`h-1 ${price === boxes[0] ? 'w-[8vw] sm:w-[3rem]' : price === boxes[1] ? 'w-[28vw] sm:w-[11rem] lg:w-[8rem]' : price === boxes[2] ? 'w-[49vw] sm:w-[18rem] lg:w-[13rem]' : price === boxes[3] ? 'w-[69vw] sm:w-[26rem] lg:w-[19rem]' : 'w-0'}  transition-all duration-300 bg-[#00b37e]`}></div>

        </div>
      </div>

      {/* // for selecting rating of driver */}
      <div className='flex flex-col mb-9 gap-8'>
        <label htmlFor="" className='inter font-medium text-[14px] flex items-center gap-1'>Minimum driver rating <p className='text-[11px] inter text-[#202020]'>(Optional)</p></label>

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

      {/* for negotiating */}
      <div className='flex items-center gap-1'>
        <Checkbox item={negotiate} setter={setNegotiate} text='Willing to negotiate' />
        <p className='text-[11px] inter text-[#202020]'>(Optional)</p>
      </div>

      <div className='flex flex-col gap-3'>

                <h1 className='text-[14px] font-medium inter flex items-end gap-1'>Recurring ride <p className='text-[11px] inter text-[#202020]'>(Optional)</p></h1>

                <div className='flex flex-col gap-2'>

                    <div className='flex items-center justify-between'>

                        <Checkbox text='Daily' item={daily} setter={setDaily} />

                        <Checkbox text='Weekly' item={weekly} setter={setWeekly} />

                    </div>

                    <div>
                        <Checkbox item={oneTime} setter={setOneTime} text='One Time' />
                    </div>

                </div>

            </div>

    </div>
  )
}

export default Budget
