'use client'
import { Accessibility, Car, ChevronDownIcon, Dot, Sliders, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const Overview = ({ ride, isBest }) => {

    const data = [
        {
            head: <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Car size={22} color='#202020' />Ride type</h1>,
            detail: <h1 className='flex items-center my-1 text-xs'><Dot size={25} color='#202020' />{ride.preferences.rideType===""? 'Normal ride': ride.preferences.rideType}</h1>,
        },
        {
            head: <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Sliders size={17} color='#202020' />Ride preferences</h1>,
            detail: <div className='flex flex-col sm:flex-row'>
                <div className='flex items-center'>
                    <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.luggageAllowed ? 'Luggage allowed' : 'Luggage not allowed'}</h1>
                    <h1 className='flex items-center ml-2 text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.petAllowed ? 'Pet allowed' : 'Pet not allowed'}</h1>
                </div>
                <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{ride.preferences.ridePreferences.smokingAllowed ? 'Smoking allowed' : 'Smoking not allowed'}</h1>
            </div>
        },
        {
            head: <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'><Sparkles size={20} color='#202020' />Specialty</h1>,
            detail: <h1 className='flex items-center text-xs'><Dot size={25} color='#202020' />{isBest ? 'Best and cheapest ride near you.' : 'No specialty'}</h1>
        },
        {
            head: <h1 className='exo2 font-semibold flex items-center gap-1 text-lg'>Other</h1>,
            detail: <div className='flex flex-col gap-2'>
                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Total distance: <p className='font-medium'>{Math.round(ride.rideDetails.distance)} kilometers</p></h1>
                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Estimated time: <p className='font-medium'>{Math.round(ride.rideDetails.duration)} minutes</p></h1>
                <h1 className='flex items-center font-semibold text-[13px] gap-1'>Negotiating: <p className='font-medium'>{ride.budget.negotiate ? 'Yes' : 'No'}</p></h1>
            </div>
        }
    ]

    const [state, setState] = useState(data.map(() => false))

    return (
        <div className='px-2 sm:px-6 flex flex-col gap-2'>
            {data.map((e, index) => {
                return (
                    <div key={index} className={`bg-[#f0f0f0] cursor-pointer transition-all duration-200 overflow-hidden ${state[index] && (index != data.length - 1 && index != 1) ? 'h-[6.1rem]' : state[index] && index === 1 ? 'h-[7.4rem] sm:h-[6.1rem]' : state[index] && index === data.length - 1 ? 'h-[9rem]' : 'h-[3.7rem]'} flex flex-col gap-3 p-4`} onClick={() => setState(prevState => prevState.map((item, i) => (i === index ? !item : false)))}>
                        <div className='flex justify-between items-center'>
                            {e.head}
                            <ChevronDownIcon style={{ transform: state[index] ? 'rotateX(180deg)' : 'rotateX(0deg)', transition: 'all 0.2s ease-in-out' }} color='#202020' className='w-6 h-6' />
                        </div>
                        <div>{e.detail}</div>
                    </div>
                )
            })}

        </div>
    )
}

export default Overview