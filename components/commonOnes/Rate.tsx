'use client'

import { Star } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Textarea } from '../ui/textarea'

const Rate = ({ toggleTheme, rating, setRating, comment, setComment }: { toggleTheme: boolean | undefined, rating: number, setRating: Dispatch<SetStateAction<number>>, comment: string, setComment: Dispatch<SetStateAction<string>> }) => {
    const [hovered, setHovered] = useState(0)
    return (
        <div className='mt-2 flex flex-col'>

            <p className={`w-full ${toggleTheme ? 'text-[#b1b1b1]' : 'text-[#5b5b5b]'} mt-1 text-[13px]`}>Your feedback is valuable in helping us improve our service. Please take a moment to rate your driver.</p>

            <div className='mt-6 w-full'>

                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = hovered >= star || (!hovered && rating >= star)
                        return (
                            <Star
                                key={star}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => setRating(star)}
                                className={`w-6 h-6 cursor-pointer transition-colors ${toggleTheme ? 'text-[#fefefe]' : 'text-[#202020]'}`}
                                fill={isFilled ? '#00563c' : 'none'}
                            />
                        )
                    })}
                </div>

                <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Write a review' className={`w-full mt-4 resize-none border h-[10em] ${toggleTheme ? 'border-[#353535]' : ''}`} />
            </div>

        </div>
    )
}

export default Rate