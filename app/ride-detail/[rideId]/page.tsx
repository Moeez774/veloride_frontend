'use client'
import RideDetail from '@/app/ride-detail/(Ride_Details)/RideDetail'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

  const params = useParams()
  const searchParams = useSearchParams()
  const rideId = Array.isArray(params.rideId) ? params.rideId[0] || "" : params.rideId

  //getting specific ride's data
  const [ride, setRide] = useState<any>()
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!rideId) return

    const fetchRide = async () => {
      let a = await fetch(`http://localhost:4000/rides/fetchRide?rideId=${rideId}`, {
        method: "GET", headers: {
          "Content-Type": "application/json"
        },
      })

      let response = await a.json()
      if (response.statusCode === 200) {
        setRide(response.data)
        if (response.isCompleted === undefined) setIsCompleted(false)
        else setIsCompleted(true)
      }
    }

    fetchRide()

  }, [rideId])

  return (
    <div>
      {ride && <RideDetail setRide={setRide} setIsCompleted={setIsCompleted} isCompleted={isCompleted} queries={searchParams} ride={ride} params={params} />}
    </div>
  )
}

export default page
