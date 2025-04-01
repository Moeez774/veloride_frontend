import HopIn from '@/components/commonOnes/HopIn'
import CO2Emission from '@/components/CTA/CO2Emission'
import LiveTracker from '@/components/CTA/LiveTracker'
import React from 'react'

const page = async () => {
  return (
    <div className='flex flex-col gap-24'>

      <div>
        <HopIn />
      </div>

        <div>
          <LiveTracker />
        </div>
        
      <div>
        <CO2Emission />
      </div>

    </div>
  )
}

export default page

