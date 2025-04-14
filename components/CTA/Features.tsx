'use client'
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import { Bot, Mic, Bus } from 'lucide-react'
import "swiper/css/autoplay";
import { usePathname } from 'next/navigation';

const Features = ({ inView2 }: { inView2: boolean }) => {

    const pathname = usePathname()
    return (
        <div className={`relative w-full text-xs font-medium`}>

            {/* // slides */}

            <div className='flex justify-center relative items-center w-full'>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    speed={500}
                >
                    <SwiperSlide>
                        <div className='w-fit flex flex-col gap-3 h-fit'>
                            <Bot size={40} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-900`} color='#00563c' />

                            <div className='flex flex-col gap-1.5'>
                                <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1100 font-semibold text-lg text-[#202020]`}>Smart Suggestions</h1>
                                <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1300 text-[#5b5b5b] text-xs`}>AI recommends the best rides for you based on your preferences, past searches, and travel behavior.</h1>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                    <div className='w-fit translate-y-[5px] flex flex-col gap-3 h-fit'>
                  <Mic size={35} className={`${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1500`} color='#00563c' />

                  <div className='flex flex-col gap-1.5'>
                    <h1 className={`font-semibold text-lg ${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1700 text-[#202020] `}>Speak to Book</h1>
                    <h1 className={`${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1900 text-[#5b5b5b] text-xs`}>Easily book your ride with simple voice commands for a hands-free, efficient experience.</h1>
                  </div>
                </div>
                    </SwiperSlide>

                    <SwiperSlide>
                    <div className='w-fit flex flex-col gap-3 h-fit'>
                  <Bus size={40} className={`${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2100`} color='#00563c' />

                  <div className='flex flex-col gap-1.5'>
                    <h1 className={`${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2300 font-semibold text-lg text-[#202020]`}>Hybrid Routing</h1>
                    <h1 className={`${inView2? 'translate-y-0 opacity-[1]': 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2500 text-[#5b5b5b] text-xs`}>Combine public transport options with carpooling to find the most efficient and eco-friendly route.</h1>
                  </div>
                </div>
                    </SwiperSlide>
                </Swiper>

            </div>
        </div>
    )
}

export default Features