'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import MatchedRides from '@/components/FindARide/MatchedRides'

const page = () => {

    const queries = useSearchParams()

    const pickupLocation = queries.get("pickupLocation")
    const dropoffLocation = queries.get("dropoffLocation")
    const pickupCoordinates = {
        long: queries.get("pickupLongs") ? parseFloat(queries.get("pickupLongs")!) : 0,
        lat: queries.get("pickupLats") ? parseFloat(queries.get("pickupLats")!) : 0
    }
    const dropoffCoordinates = {
        long: queries.get("dropoffLongs") ? parseFloat(queries.get("dropoffLongs")!) : 0,
        lat: queries.get("dropoffLats") ? parseFloat(queries.get("dropoffLats")!) : 0
    }
    const isFound = queries.get("isFound")

    return (
        <div>
            <MatchedRides pickup={pickupLocation} drop={dropoffLocation} isFound={isFound} location={pickupCoordinates} dropLocation={dropoffCoordinates} />
        </div>
    )
}

export default page