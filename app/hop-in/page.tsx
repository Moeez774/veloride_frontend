'use client'
import LiveTracker from '@/app/hop-in/(Hop-In)/LiveTracker'
import React from 'react'
import { Bot, Mic, Bus, Leaf, ChevronRight, ArrowUp, Trophy } from 'lucide-react'
import { Component } from '@/app/hop-in/(Hop-In)/Chart'
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { getContacts } from '@/context/ContactsProvider'

const page = () => {
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [ref4, inView4] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref5, inView5] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref6, inView6] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [ref7, inView7] = useInView({ triggerOnce: true, threshold: 0.5 });

  const context = getContacts()
  const toggleTheme = context?.toggleTheme

  return (
    <div className='inter flex font-medium flex-col'>

      <div className={`${toggleTheme ? 'bg-[#0D0D0D]' : 'bg-[#E5EAE8]'} transition-all duration-200 pb-36`}>
        <LiveTracker />
      </div>

      <div className='flex flex-col items-center w-full gap-12'>
        <div className='flex flex-col items-center w-full gap-12 px-4 sm:px-8 md:px-4 lg:px-12'>
          <div ref={ref2} className={`inter font-medium max-w-6xl mb-20 transition-all duration-200 px-7 sm:px-10 py-10 md:py-12 lg:py-16 lg:px-16 xl:px-20 relative -mt-36 w-full shadow-xl ${toggleTheme ? 'bg-[#202020]' : 'bg-[#fefefe]'} rounded-2xl`}>

            <div className='w-full flex flex-col gap-8 md:gap-12'>
              <div className='flex justify-between'>
                <div className='flex flex-col gap-1'>
                  <h1 className={`text-sm font-semibold ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'} ease-out transition-all duration-1000 ${inView2 ? 'translate-x-0 opacity-[1]' : '-translate-x-2 opacity-0'}`}>Ride With Ease</h1>
                  <h1 className={`text-[28px] sm:text-[30px] lg:text-[35px] leading-[42px] sm:leading-[45px] sm:w-96 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} ${inView2 ? 'translate-x-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-1000 delay-200`}>Experience the Future of Ride Sharing</h1>
                </div>

                <h1 className={`text-[13px] hidden md:block w-80 lg:w-96 ${inView2 ? 'translate-x-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-1000 delay-500 pt-6 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>Explore smarter travel options with features like AI-driven ride suggestions, saved routes, and voice search for a seamless journey.</h1>
              </div>

              {/* //for showing on mobile */}
              <div className='w-full md:hidden'>
                <div className={`relative w-full text-xs font-medium`}>

                  {/* // slides */}

                  <div className='flex justify-center relative items-center w-full'>

                    <Swiper
                      modules={[Autoplay, Pagination, Navigation]}
                      autoplay={{ delay: 7000, disableOnInteraction: false }}
                      spaceBetween={10}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      speed={500}
                    >
                      <SwiperSlide>
                        <div className='w-fit flex flex-col gap-3 h-fit'>
                          <Bot size={40} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-900`} color={toggleTheme ? '#048C64' : '#00563c'} />

                          <div className='flex flex-col gap-1.5'>
                            <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1100 font-semibold text-lg ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Smart Suggestions</h1>
                            <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1300 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>AI recommends the best rides for you based on your preferences, past searches, and travel behavior.</h1>
                          </div>
                        </div>
                      </SwiperSlide>

                      <SwiperSlide>
                        <div className='w-fit translate-y-[5px] flex flex-col gap-3 h-fit'>
                          <Mic size={35} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1500`} color={toggleTheme ? '#048C64' : '#00563c'} />

                          <div className='flex flex-col gap-1.5'>
                            <h1 className={`font-semibold text-lg ${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1700 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'} `}>Speak to Find</h1>
                            <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1900 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Easily find your ride with simple voice commands for a hands-free, efficient experience.</h1>
                          </div>
                        </div>
                      </SwiperSlide>

                      <SwiperSlide>
                        <div className='w-fit flex flex-col gap-3 h-fit'>
                          <Bus size={40} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2100`} color={toggleTheme ? '#048C64' : '#00563c'} />

                          <div className='flex flex-col gap-1.5'>
                            <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2300 font-semibold text-lg ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Hybrid Routing</h1>
                            <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2500 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Combine public transport options with carpooling to find the most efficient and eco-friendly route.</h1>
                          </div>
                        </div>
                      </SwiperSlide>
                    </Swiper>

                  </div>
                </div>
              </div>

              {/* //for showing above 768px screen */}
              <div className='w-full hidden md:grid items-start gap-10 lg:gap-16 grid-cols-3'>

                {/* //AI feature */}
                <div className='w-fit flex flex-col gap-3 h-fit'>
                  <Bot size={40} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-900`} color={toggleTheme ? '#048C64' : '#00563c'} />

                  <div className='flex flex-col gap-1.5'>
                    <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1100 font-semibold text-lg ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Smart Suggestions</h1>
                    <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1300 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>AI recommends the best rides for you based on your preferences, past searches, and travel behavior.</h1>
                  </div>
                </div>

                {/* //Voice feature */}
                <div className='w-fit translate-y-[5px] flex flex-col gap-3 h-fit'>
                  <Mic size={35} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1500`} color={toggleTheme ? '#048C64' : '#00563c'} />

                  <div className='flex flex-col gap-1.5'>
                    <h1 className={`font-semibold text-lg ${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1700 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Speak to Find</h1>
                    <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-1900 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Easily find your ride with simple voice commands for a hands-free, efficient experience.</h1>
                  </div>
                </div>

                {/* // Transportation */}
                <div className='w-fit flex flex-col gap-3 h-fit'>
                  <Bus size={40} className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2100`} color={toggleTheme ? '#048C64' : '#00563c'} />

                  <div className='flex flex-col gap-1.5'>
                    <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2300 font-semibold text-lg ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Hybrid Routing</h1>
                    <h1 className={`${inView2 ? 'translate-y-0 opacity-[1]' : 'translate-y-3 opacity-0'} ease-out transition-all duration-800 delay-2500 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Combine public transport options with carpooling to find the most efficient and eco-friendly route.</h1>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* //Live routing */}
          <div ref={ref3} className='max-w-6xl font-medium w-full items-center gap-10 mx-auto flex flex-col md:flex-row md:justify-between md:gap-4'>
            <div className='flex w-full lg:w-auto px-3 sm:px-0 md:px-4 lg:px-0 flex-col gap-1'>
              <h1 className={`${inView3 ? 'translate-x-0 opacity-[1]' : '-translate-x-2 opacity-0'} ease-out transition-all duration-800 text-sm font-semibold ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'}`}>Live routing</h1>
              <h1 className={`${inView3 ? 'translate-x-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-1000 delay-300 text-[35px] leading-[45px] w-72 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Smart Routes,
                Less Wait</h1>
              <h1 className={`${inView3 ? 'translate-x-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-800 delay-700 mt-2 max-w-md md:max-w-sm w-full lg:w-80 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-xs`}>Our system uses live traffic data and intelligent algorithms to match carpools and suggest the fastest, most efficient routes in real time.</h1>
            </div>

            {!toggleTheme && <img className={`${inView3 ? 'translate-y-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-800 delay-1100 w-[300px] sm:w-[350px] lg:w-[400px]`} src='/Images/Navigation-amico.svg' />}

            {toggleTheme && <img className={`${inView3 ? 'translate-y-0 opacity-[1]' : '-translate-x-6 opacity-0'} ease-out transition-all duration-800 delay-1100 w-[300px] sm:w-[350px] lg:w-[400px]`} src='/Images/Untitled(1).svg' />}
          </div>

          {/* //Why us */}
          <div ref={ref4} className='max-w-4xl flex flex-col mx-auto my-20 w-full'>
            <h1 className={`${inView4 ? 'translate-y-0 opacity-[1]' : 'translate-y-6 opacity-0'} ease-out transition-all duration-800 text-sm font-semibold text-center ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'}`}>Why us</h1>
            <h1 className={`${inView4 ? 'translate-y-0 opacity-[1]' : 'translate-y-8 opacity-0'} ease-out transition-all duration-700 delay-300 text-3xl leading-[45px] text-center px-4 mt-1.5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Why they prefer Veloride</h1>

            {/* //Cards and stats */}
            <div className='w-full flex flex-col gap-3 sm:px-6 md:px-0 lg:gap-6 mt-8'>
              <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6'>
                <div className={`rounded-2xl flex flex-col gap-10 py-8 px-6 sm:p-10 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#e5eae8]'} ${inView4 ? 'translate-x-0 opacity-[1]' : '-translate-x-5 opacity-0'} ease-out transition-all duration-1000 delay-800`}>
                  <h1 className={`${inView4 ? 'translate-x-0 opacity-[1]' : '-translate-x-4 opacity-0'} ease-out transition-all duration-1500 delay-900 font-semibold text-6xl ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'}`}>10k+</h1>
                  <h1 className={`${inView4 ? 'translate-x-0 opacity-[1]' : '-translate-x-4 opacity-0'} ease-out transition-all duration-1500 delay-1100 text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Connected users on Veloride across all Pakistan.</h1>
                </div>

                <div className={`${inView4 ? 'translate-y-0 opacity-[1]' : '-translate-y-6 opacity-0'} ease-out transition-all duration-1000 delay-1300 rounded-2xl flex flex-col gap-10 py-8 px-6 sm:p-10 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#e5eae8]'}`}>
                  <h1 className={`${inView4 ? 'translate-y-0 opacity-[1]' : '-translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-1500 text-lg font-semibold ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>EcoStats tracks your carbon savings and eco-rewards.</h1>

                  <div className={`lg:mx-8 flex items-center gap-2 ${inView4 ? 'translate-y-0 opacity-[1]' : '-translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-1700`}>
                    <div className='w-14 h-14 bg-[#00563c] rounded-full flex items-center justify-center'><Leaf size={25} color='#fefefe' /></div>
                    <div className='flex ml-2 items-center'>
                      <div className='w-32 bg-[#5b5b5b] h-[2px]' ></div>
                      <ChevronRight size={15} className='-translate-x-1.5 -translate-y-[0.5px]' style={{ strokeWidth: '3' }} color='#5b5b5b' />
                    </div>
                    <div className={`w-14 h-14 ${toggleTheme ? 'bg-[#0d0d0d]' : 'bg-[#202020]'} rounded-full flex items-center justify-center`}><Trophy size={25} color='#fefefe' /> </div>
                  </div>
                </div>
              </div>

              {/* //Chart */}
              <div className={`${inView4 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-1000 delay-1900 ${toggleTheme ? 'bg-[#202020]' : 'bg-[#e5eae8]'} flex md:items-center gap-14 md:gap-0 flex-col md:flex-row md:justify-between w-full pt-12 md:pt-8 px-3 sm:px-8 lg:px-10 rounded-2xl`}>
                <div className={`${inView4 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-2100 px-3 sm:px-0 flex flex-col gap-3`}>
                  <h1 className={`font-semibold text-3xl ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Journey So Far</h1>
                  <h1 className={`text-xs sm:w-96 md:w-70 ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'}`}>See how thousands have already trusted us, A growing platform built for smarter, greener travel.</h1>
                </div>

                <div className={`w-full md:w-[30em] ${inView4 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-2300`}>
                  <Component />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* //3 ways of earning */}
        <div ref={ref5} className='bg-[#002D20] px-7 sm:px-12 flex w-full flex-col justify-center py-16 sm:py-20 md:py-24'>
          <div className='max-w-5xl w-full flex flex-col gap-16 mx-auto'>
            <div className='flex flex-col gap-1'>
              <h1 className={`${inView5 ? 'opacity-[1]' : 'opacity-0'} ease-out transition-all duration-500 text-sm font-semibold text-[#048C64]`}>Drive & Thrive</h1>
              <h1 className={`${inView5 ? 'translate-y-0 opacity-[1]' : 'translate-y-6 opacity-0'} ease-out transition-all duration-800 delay-200 text-[30px] sm:text-[35px] leading-[42px] sm:leading-[45px] sm:w-[29rem] text-[#fefefe]`}>3 Powerful Ways to Earn on Veloride as a Driver</h1>
            </div>

            <div className='w-full grid items-start gap-6 grid-cols-1 lg:grid-cols-3'>

              {/* //AI feature */}
              <div className={`lg:w-fit flex sm:items-center lg:items-start lg:flex-col gap-6 lg:gap-3 bg-[#006043] px-8 py-5 rounded-xl h-full ease-out transition-all duration-600 delay-600`} style={{ transform: inView5 ? 'scale(1)' : 'scale(0.1)', opacity: inView5 ? '1' : '0' }}>
                <h1 className='text-6xl exo2 font-medium text-[#048C64]'>1</h1>

                <div className='flex flex-col gap-1.5'>
                  <h1 className='font-semibold text-lg text-[#fefefe]'>By Sharing Rides</h1>
                  <h1 className='text-[#bebebe] font-medium text-xs'>Offer your empty car seats and earn from fellow riders sharing your route.</h1>
                </div>
              </div>

              {/* //Voice feature */}
              <div className='lg:w-fit flex sm:items-center ease-out transition-all duration-600 delay-900 lg:items-start bg-[#006043] px-8 py-5 rounded-xl lg:flex-col gap-4 lg:gap-3 h-full' style={{ transform: inView5 ? 'scale(1)' : 'scale(0.1)', opacity: inView5 ? '1' : '0' }}>
                <h1 className='text-6xl exo2 font-medium text-[#048C64]'>2</h1>

                <div className='flex flex-col gap-1.5'>
                  <h1 className='font-semibold text-lg text-[#fefefe]'>With Eco Rewards</h1>
                  <h1 className='text-[#bebebe] font-medium text-xs'>Get green badges, exclusive perks, and discounts by maintaining an eco-friendly record.</h1>
                </div>
              </div>

              {/* // Transportation */}
              <div className='lg:w-fit flex sm:items-center lg:items-start lg:flex-col ease-out transition-all duration-600 delay-1100 gap-4 lg:gap-3 bg-[#006043] px-8 py-5 rounded-xl h-full' style={{ transform: inView5 ? 'scale(1)' : 'scale(0.1)', opacity: inView5 ? '1' : '0' }}>
                <h1 className='text-6xl exo2 font-medium text-[#048C64]'>3</h1>

                <div className='flex flex-col gap-1.5'>
                  <h1 className='font-semibold text-lg text-[#fefefe]'>With Dynamic Pricing</h1>
                  <h1 className='text-[#bebebe] font-medium text-xs'>Increase earnings during high-demand times using our smart pricing system.</h1>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Our aim */}
        <div ref={ref6} className='max-w-7xl w-full flex flex-col sm:flex-row gap-8 md:gap-4 justify-between mx-auto my-10 px-6'>
          <div>
            <img style={{ filter: 'blur(1px)' }} className={`${inView6 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-800 rotate-30 w-12`} src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
          </div>

          <div className='max-w-3xl w-full'>
            <h1 className={`text-sm font-semibold text-center ${toggleTheme ? 'text-[#048C64]' : 'text-[#00563c]'} ${inView6 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800`}>Our aim</h1>
            <h1 className={`${inView6 ? 'translate-y-0 opacity-[1]' : 'translate-y-8 opacity-0'} ease-out transition-all duration-800 delay-200 text-3xl leading-[45px] text-center mt-1.5 ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}>Smart Rides for All</h1>
            <h1 className={`${inView6 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-500 font-medium ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} text-center text-[13px] md:text-sm mt-4`}>To build an AI-powered carpooling platform that’s truly affordable, incredibly smooth, and accessible for everyone no matter who they are or where they go.</h1>
          </div>

          <div className='flex justify-end sm:items-end'>
            <img style={{ filter: 'blur(1px)' }} className={`${inView6 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-1100 -rotate-30 w-12`} src="/Images/Leonardo_Phoenix_10_A_sleek_modern_and_minimalistic_logo_desig_3-removebg-preview__1_-removebg-preview.png" alt="" />
          </div>
        </div>

        {/* //CTA */}
        <div ref={ref7} className='px-3 sm:px-6 lg:px-10 w-full pb-10'>
          <div className='max-w-6xl flex md:flex-row flex-col gap-10 lg:items-center md:gap-2 justify-between mx-auto px-8 py-10 sm:p-12 lg:p-16 rounded-2xl w-full bg-[#002D20]'>
            <div className='flex gap-8 flex-col'>
              <div className='flex flex-col gap-1'>
                <h1 className={`${inView7 ? 'opacity-[1]' : 'opacity-0'} ease-out transition-all duration-500 text-sm font-semibold text-[#048C64]`}>Hop In Now</h1>
                <h1 className={`${inView7 ? 'translate-y-0 opacity-[1]' : 'translate-y-8 opacity-0'} ease-out transition-all duration-800 delay-200 text-[32px] lg:text-[35px] leading-[45px] lg:w-[29rem] text-[#fefefe]`}>Ready to Ride Smarter?</h1>
                <h1 className={`${inView7 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-500 text-[#bebebe] font-medium text-[13px] max-w-sm w-full mt-2`}>Join the next-generation carpooling experience powered by AI, designed for everyone.</h1>
              </div>

              <div className={`${inView7 ? 'translate-y-0 opacity-[1]' : 'translate-y-4 opacity-0'} ease-out transition-all duration-800 delay-800 inter flex flex-col sm:flex-row sm:items-center gap-3`}>
                <button className='py-[0.90rem] font-normal hover:bg-[#00563ccc] transition-all duration-200 rounded-xl cursor-pointer text-[#fefefe] px-5 lg:px-6 text-[13px] lg:text-[14px] bg-[#00563c]'>Get Started Now</button>
                <button className='py-[0.90rem] font-medium rounded-xl cursor-pointer hover:bg-[#f0f0f0] hover:text-[#00563c] transition-all flex items-center gap-1 justify-center duration-200 text-[#fefefe] px-5 lg:px-6 text-[13px] lg:text-[14px] bg-transparent border border-[#b1b1b1]'>Learn More <ArrowUp className='rotate-45' size={20} /></button>
              </div>
            </div>

            <img className={`w-[300px] sm:w-[350px] md:w-[300px] mx-auto lg:w-[350px] ${inView7 ? 'translate-x-0 opacity-[1]' : '-translate-x-4 opacity-0'} ease-out transition-all duration-800 delay-1200`} src='/Images/By-my-car-cuate.svg' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page

