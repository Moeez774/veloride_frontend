import React, { useEffect, useState } from 'react'
import MoreInfo from './MoreInfo'
import Loader from '../Loader'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { saveUsersData } from '@/functions/function'

const google = new GoogleAuthProvider()

interface Details {
    btText: string,
    func: () => void
}

const Buttons: React.FC<Details> = ({ btText, func }) => {

    const [loader, setLoader] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')

    //rotuer for redirecting user
    const router = useRouter()

    // asking for more information if user sign in with providers
    const [tellMore, setTellMore] = useState(false)
    const [city, setCity] = useState('')
    const [number, setNumber] = useState('')
    const [isAgree, setAgree] = useState(false)

    // for getting user's info
    const [user, setUser] = useState<any>()

    // getting user's info if user sign in with providers
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async(user) => {
            if (user) {
                await user.reload()
                setUser(user)
            }
            else {
                setUser(null)
            }
        })

        return () => unSubscribe()
    }, [])

    // for saving user's data
    const saveUser = async () => await saveUsersData(setLoader, user, city, number, isAgree, setShowMessage, setMessage, router)

    // sign in woth google
    const googleSignIn = async () => {
        setLoader(true)
        setMessage('')
        try {

            await signInWithPopup(auth, google)

            // for chekcing whther user's data already availabale in database or not so we can ask for more info
            let a = await fetch('http://localhost:4000/users/check-user', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ _id: auth.currentUser?.uid })
            })

            let response = await a.json()

            if (response.user === null) {
                setLoader(false)
                setTellMore(true)
            }
            else {
                await saveUser()
                router.push('/authorization')
            }

        } catch (err) {
            alert("Error signing in with Google." + err)
            setLoader(false)
        }
    }

    return (
        <>

            {loader && <Loader setLoader={setLoader} message={message} setShowMessage={setShowMessage} showMessage={showMessage} />}

            <MoreInfo saveUser={saveUser} tellMore={tellMore} loader={loader} setLoader={setLoader} setTellMore={setTellMore} isAgree={isAgree} setAgree={setAgree} number={number} setNumber={setNumber} city={city} setCity={setCity} />

            <div>
                <button onClick={() => func()} className='exo2 shadow-md font-bold w-[82vw] sm:w-96 bg-[#00B37E] hover:bg-[#00b37dde] active:bg-[#00b368de] transition-all duration-200 rounded-lg cursor-pointer py-3 text-[#fefefe]'>{btText}</button>
            </div>

            <div className='flex w-[82vw] sm:w-96 items-center gap-2'>

                {/* sign in with google */}
                <button onClick={() => googleSignIn()} className='cursor-pointer w-full hover:bg-[#202020] text-[#202020] transition-all duration-200 active:bg-[#161616] hover:text-[#fefefe] py-3 bg-[#fefefe] active:text-white justify-center rounded-lg flex items-center gap-2 shadow-md' style={{ border: '1.5px solid #979797' }}>
                    <img className='w-6' src="/Images/google-icon.svg" alt="" />
                    <h1 className='font-semibold text-xs sm:text-sm' >Continue with Google</h1>
                </button>

            </div>
        </>
    )
}

export default Buttons
