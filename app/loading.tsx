import React from 'react'

const loading = () => {
  return (
    <div className='fixed left-0 top-0 flex justify-center items-center z-50 bg-transparent w-screen h-screen'>
      <div className="loader"></div>
    </div>
  )
}

export default loading
