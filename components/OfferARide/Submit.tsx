import React, { Dispatch, SetStateAction } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import Preferences from '../FindARide/Preferences'
import Budget from './Budget'
import Additional from '../FindARide/Additional'
import RideDetails from './RideDetails'
import SuccessLoader from '../SuccessLoader'

interface Details {
    formData: any,
    currStep: number,
    setCurrStep: Dispatch<SetStateAction<number>>,
    setStep: Dispatch<SetStateAction<number>>,
    step: number,
    offer: () => Promise<void>,
    loader: boolean,
    setLoader: Dispatch<SetStateAction<boolean>>,
    message: string,
    setShowMessage: Dispatch<SetStateAction<boolean>>,
    showMessage: boolean,
    statusCode: number,
}

const Submit: React.FC<Details> = ({ formData, currStep, setCurrStep, setStep, step, offer, loader, setLoader, setShowMessage, message, showMessage, statusCode }) => {
    
    return (
        <>
        {/* // loader */}
        { loader && <SuccessLoader message={message} statusCode={statusCode} setLoader={setLoader} setShowMessage={setShowMessage} showMessage={showMessage} /> }

        <div className='w-full flex justify-center sm:px-10 items-center'>
            <ScrollArea  style={{ opacity: currStep===5? '1': '0', transform: currStep===5? 'scale(1)': 'scale(0.5)', transition: 'all 0.2s ease-in-out' }} className="h-[95vh] py-10 bg-[#fefefe] flex flex-col gap-6 w-[95vw] sm:w-full sm:max-w-xl lg:max-w-5xl rounded-md border p-4">

                <div className='top-0 z-[100] sticky bg-white py-4'>
                    <h1 className='text-3xl font-semibold text-[#202020] text-center mx-6 exo2'>Review & Offer</h1>
                </div>

                {/* // first two steps */}
                <div className='flex w-full gap-6 flex-col items-center lg:items-start lg:flex-row justify-around pt-8 pb-16'>
                    <div className='flex flex-col gap-3'>

                        <div>
                            <h1 className='exo2 font-semibold'>Ride Details</h1>
                        </div>
                        <RideDetails setDropLocation={formData.setDropLocation} setLocation={formData.setLocation} drop={formData.drop} setDrop={formData.setDrop} pickup={formData.pickup} setPickup={formData.setPickup} time={formData.time} setTime={formData.setTime} date={formData.date} setDate={formData.setDate} seats={formData.seats} setseats={formData.setseats} setVehicle={formData.setVehicle} vehicle={formData.vehicle} />
                    </div>

                    <div className='flex pt-8 lg:pt-0 flex-col gap-3'>
                        <div>
                            <h1 className='exo2 font-semibold'>Personal Preferences</h1>
                        </div>
                        <Preferences setGenderType={formData.setGenderType} setRide={formData.setRide} ride={formData.ride} gender={formData.gender} vehicle={formData.vehicle} setVehicle={formData.setVehicle} setGender={formData.setGender} male={formData.male} female={formData.female} showGender={formData.showGender} setLuggage={formData.setLuggage} luggage={formData.luggage} setShowGender={formData.setShowGender} needs={formData.needs} setNeeds={formData.setNeeds} petFriendly={formData.petFriendly} setPetFriendly={formData.setPetFriendly} setSmoking={formData.setSmoking} smoking={formData.smoking} />
                    </div>
                </div>


                {/* // other two steps */}
                <div className='flex w-full gap-6 flex-col items-center lg:items-start lg:flex-row justify-around pb-10'>
                    <div className='flex flex-col gap-5'>

                        <div>
                            <h1 className='exo2 font-semibold'>Budget & Frequency</h1>
                        </div>
                        <Budget budget={formData.budget} setBudget={formData.setBudget} recurring={formData.recurring} recurringVal={formData.recurringVal} setNegotiate={formData.setNegotiate} negotiate={formData.negotiate} setRecurring={formData.setRecurring} setRecurringVal={formData.setRecurringVal} />
                    </div>

                    <div className='flex pt-8 lg:pt-0 flex-col gap-5'>
                        <div>
                            <h1 className='exo2 font-semibold'>Additional Information</h1>
                        </div>
                        <Additional instruct={formData.instruct} setEmail={formData.setEmail} email={formData.email} number={formData.number} setNumber={formData.setNumber} setInstruct={formData.setInstruct} photo={formData.photo} setPhoto={formData.setPhoto} />
                    </div>
                </div>

                <div className={`mt-10 flex justify-between p-6 items-center`}>

                    <button className={`exo2 active:translate-y-0.5 active:duration-200 shadow-lg font-bold text-[#00b37e] rounded-xl bg-[#fefefe] hover:bg-[#f8f7f7] px-8 py-2.5 transition-all duration-300 cursor-pointer`} onClick={() => {
                        setStep(step - 1)
                        setCurrStep(currStep-1)
                    }} style={{ border: '2px solid #00b37e' }}>Back</button>

                    <button className={`exo2 active:translate-y-0.5 active:duration-200 text-[#fefefe] rounded-xl bg-[#00b37e] shadow-lg font-bold hover:bg-[#00b37dd3] px-8 py-2.5 transition-all duration-300 cursor-pointer`} onClick={async() => await offer()} >Offer</button>

                </div>

            </ScrollArea>
        </div>
        </>
    )
}

export default Submit
