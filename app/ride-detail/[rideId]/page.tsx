'use client'
import RideDetail from '@/components/ridesData/RideDetail'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

  const params = useParams()
  const searchParams = useSearchParams()
  const rideId = Array.isArray(params.rideId)? params.rideId[0] || "" : params.rideId

  //getting specific ride's data
  const [ride, setRide] = useState<any>()

  useEffect(() => {
    if(!rideId) return

    const fetchRide = async() => {
      let a = await fetch('http://localhost:4000/rides/fetchRide', {
        method: "POST", headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ rideId: rideId })
      })
      
      let response = await a.json()
      if(response.statusCode===200) setRide(response.data)
    }

    fetchRide()

  }, [rideId])
  return (
    <div>
    { ride && <RideDetail queries={searchParams} ride={ride} params={params} /> }
    </div>
  )
}

export default page
