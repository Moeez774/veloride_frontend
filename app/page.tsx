'use client'
import NearRides from "@/app/(HomePage)/NearRides"
import RideConnect from "@/components/hooks/RideConnect"
import { toggleTheme } from "./(HomePage)/MainMap"
export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-12 md:gap-10">
        <div className='inter pt-32 max-w-6xl px-5 lg:px-10 xl:px-0 w-full mx-auto'>

          <div className='w-full flex flex-col gap-10 relative'>
            <div className='font-medium w-full items-center gap-10 flex flex-col-reverse lg:flex-row md:justify-between md:gap-4'>
              <div className='relative flex w-full lg:w-auto px-3 sm:px-0 md:px-4 lg:px-0 flex-col gap-1'>
                <div className={`border px-2.5 py-1 w-fit ${toggleTheme() ? 'border-[#048C64]' : 'border-[#00563c]'} bg-transparent rounded-full`}>
                  <h1 className={`ease-out transition-all duration-800 text-xs font-semibold ${toggleTheme() ? 'text-[#048C64]' : 'text-[#00563c]'}`}>Trust Builder</h1>
                </div>
                <h1 className={`ease-out transition-all duration-1000 delay-300 text-[35px] sm:text-[40px] leading-[45px] lg:w-96 ${toggleTheme() ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Revolutionizing the Way You Share Rides</h1>
                <h1 className={`ease-out transition-all duration-800 delay-700 mt-2 max-w-md md:max-w-sm w-full lg:w-80 ${toggleTheme() ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Join a smarter, cleaner, and more connected way to commute.</h1>
              </div>

              <div className='relative'>
                <div className='w-14 hidden md:block md:-translate-x-36 md:translate-y-10 mx-auto h-14 rounded-full bg-[#02835D] top-0 absolute'></div>
                <img className='w-[500px] lg:w-[450px]' src='/Images/Carpool-cuate.svg' />
              </div>
            </div>
          </div>

        </div>

        <RideConnect />
        <NearRides />
      </div>
    </>
  )
}
