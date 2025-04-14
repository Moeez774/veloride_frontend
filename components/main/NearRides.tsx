'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAuth } from '@/context/AuthProvider';
import NearRide from './NearRide';
// Shoes component receiving props
const NearRides = () => {

    const [slideNo, setSlideNo] = useState(1)
    const [nearRides, setNearRides] = useState<any[]>([])

    //getting user's location
    const authContext = useAuth()
    const user = authContext?.user || null

    //fetching rides near user
    useEffect(() => {
        if (!user) return
        const long = localStorage.getItem("long")
        const lat = localStorage.getItem("lat")

        const currLocation = [long ? parseFloat(long) : 0, lat ? parseFloat(lat) : 0]
        const fetchRides = async () => {
            let a = await fetch('http://localhost:4000/rides/fetchRides', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userLocation: currLocation, userId: user._id })
            })

            let response = await a.json()
            if (response.statusCode === 200) setNearRides(response.data)
            else alert(response.message)
        }

        fetchRides()
    }, [user])

    const increaseSlides = () => {
        if (slideNo === nearRides.length - 1) return
        else {
            const no = slideNo + 1
            setSlideNo(no)
        }
    }

    const decreaseSlide = () => {
        if (slideNo === 1) return
        else {
            const no = slideNo - 1
            setSlideNo(no)
        }
    }


    return (
        <div className='flex flex-col my-10 gap-6 px-6 max-w-8xl w-full mx-auto'>
            <div>
                <h1 className='text-3xl sm:text-4xl exo2' style={{ fontWeight: '900' }}>Rides Near You</h1>
            </div>

            {nearRides.length === 0 && <div>
                <h1 className='inter text-center text-[#202020]'>No rides found near you.</h1>
            </div>}
            {nearRides.length != 0 && <div className='relative z-10'>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        nextEl: ".swiper-button-next-shoes",
                        prevEl: ".swiper-button-prev-shoes",
                    }}
                    freeMode={true}
                    breakpoints={{
                        300: { slidesPerView: 1.05, spaceBetween: 8 },
                        480: { slidesPerView: 1.2, spaceBetween: 10 },
                        640: { slidesPerView: 1.4, spaceBetween: 10 },
                        768: { slidesPerView: 1.8, spaceBetween: 10 },
                        1024: { slidesPerView: 2.5, spaceBetween: 20 },
                    }}
                >
                    {nearRides.map((e, index) => {
                        return (
                            <div key={index}>
                                <SwiperSlide className='relative overflow-auto z-10' key={index} >

                                    <NearRide nearRides={nearRides} ride={e} />
                                </SwiperSlide>
                            </div>
                        )
                    })}

                </Swiper>
                <div className='w-full hidden sm:flex justify-end px-0 items-center my-3 lg:my-5'>
                    <button className={`swiper-button-prev-shoes ${slideNo === 1 ? 'bg-gray-100 hover:bg-gray-100' : 'bg-gray-200 hover:bg-gray-300'} cursor-pointer p-2.5 mr-[3.8rem] rounded-full absolute top-0 transform -translate-y-[4rem] z-10`} onClick={decreaseSlide} style={{ transition: 'all 0.3s ease-in-out' }}>
                        <ChevronLeft color={slideNo === 1 ? 'gray' : 'black'} style={{ strokeWidth: 1 }} size={28} />
                    </button>
                    <button className={`swiper-button-next-shoes ${slideNo === nearRides.length - 1 ? 'bg-gray-100 hover:bg-gray-100' : 'bg-gray-200 hover:bg-gray-300'} transition-all cursor-pointer duration-300 p-2.5 rounded-full absolute top-0 transform -translate-y-[4rem] z-10`} onClick={increaseSlides}>
                        <ChevronRight color={slideNo === nearRides.length - 1 ? 'gray' : 'black'} style={{ strokeWidth: 1 }} size={28} />
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default NearRides
