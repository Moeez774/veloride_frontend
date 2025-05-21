import { toggleTheme } from './../app/page';
import { auth } from "@/firebase"
import socket from "@/utils/socket"
import { User } from "firebase/auth"
import { Dispatch, SetStateAction } from "react"
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

const google = new GoogleAuthProvider()
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// for saving user's data
export async function saveUserData(setLoader: Dispatch<SetStateAction<boolean>>, user: User, city: string, number: string, role: string | null, router: any, gender: string) {

    // calling server for saving user's data if not saved already
    let a = await fetch('http://localhost:4000/users/providers-sign-in', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ _id: auth.currentUser?.uid, fullname: user?.displayName, email: user?.email, pass: null, number: number, city: city, photo: user?.photoURL, role: role, isProvider: true, rating: 0, gender: gender })
    })

    let response = await a.json()
    if (response.statusCode === 200) {
        router.push('/validation')
    }
    else {
        alert(response.message)
        setLoader(false)
    }
}

// for generating random color for user's profile if they didn't signed in with providers
function generateHSLColor() {
    const hue = Math.floor(Math.random() * 361)
    const saturation = Math.floor(Math.random() * 41) + 60
    const lightness = Math.floor(Math.random() * 31) + 40

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// for sign up
export async function signUserUp(setLoader: Dispatch<SetStateAction<boolean>>, email: string, fullname: string, pass: string, number: string, city: string, role: string | null, router: any, gender: string) {

    //generating random color for profile backgorund
    const color = generateHSLColor()
    const userId = `${email}_${new Date().getTime()}`
    setLoader(true)
    try {
        let a = await fetch('http://localhost:4000/users/sign-up', {
            method: "POST", headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ _id: userId, fullname: fullname, email: email, pass: pass, number: number, city: city, remeber: false, photo: color, role: role, isProvider: false, rating: 0, gender: gender })
        })

        let response = await a.json()
        if (response.statusCode === 200) {
            router.push('/validation')
        }
        else {
            alert(response.message)
            setLoader(false)
        }

    } catch (err) {
        alert(err)
    }
}

// for sending messages
export async function sendMessage(chat_id: string, sender_id: string, receiver_id: string, message: string, senderPhoto: string, receiverPhoto: string, senderName: string, receiverName: string, isExist: boolean, setIsExist: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>) {

    const _id = `${chat_id}_${new Date().getTime()}`

    const data = {
        _id: _id, chat_id: chat_id, sender_id: sender_id, receiver_id: receiver_id, message: message, senderPhoto: senderPhoto, receiverPhoto: receiverPhoto, senderName: senderName, receiverName: receiverName, time: new Date().getTime(),
    }

    if (message != '') {
        socket.emit("newMessage", { data: data, chat_id: chat_id, message: message, time: new Date().getTime() })
        setMessage('')
    }

    let a = await fetch('http://localhost:4000/messages/send-message', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: _id, chat_id: chat_id, sender_id: sender_id, receiver_id: receiver_id, message: message, senderPhoto: senderPhoto, receiverPhoto: receiverPhoto, senderName: senderName, receiverName: receiverName, time: new Date().getTime(), isExist: isExist })
    })

    let response = await a.json()
    if (response.statusCode === 200) {
        if (!isExist) {
            socket.emit("add-contact", { receiver_id: receiver_id, chat_id: chat_id, sender_id: sender_id })
        }
        setIsExist(true)
    }
}

//handling signup steps
export async function handlingProceeding(setShowSteps: Dispatch<SetStateAction<boolean>>, toggleForm: boolean, signIn: () => Promise<void>, email: string, value: string, setStep: Dispatch<SetStateAction<number>>, delay: (number: number) => Promise<void>, setMessage: Dispatch<SetStateAction<string>>, setShowMessage: Dispatch<SetStateAction<boolean>>) {
    setShowSteps(true)
    if (!toggleForm) signIn()
    else if (email != '' && value != '') {
        setStep(prev => prev + 1)

        setTimeout(async () => {
            let a = await fetch('http://localhost:4000/users/user-existance', {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email })
            })

            let response = await a.json()
            if (response.statusCode === 200) {
                setStep(prev => prev + 1)
                setShowSteps(false)

                await delay(400)
                setStep(prev => prev + 1)
                await delay(50)
                setStep(prev => prev + 1)
            }
            else {
                setStep(0)
                setMessage(response.message)
                setShowMessage(true)
            }
        }, 800)
    }
    else {
        setShowMessage(true)
        setMessage("Please fill in all the requied fields.")
    }
}

export async function handleGoogleAuth(setLoader: Dispatch<SetStateAction<boolean>>, router: any, setStep: Dispatch<SetStateAction<number>>, delay: (number: number) => Promise<void>, setShowSteps: Dispatch<SetStateAction<boolean>>, saveUser: (setLoader: Dispatch<SetStateAction<boolean>>) => Promise<void>) {
    setLoader(true)
    try {

        await signInWithPopup(auth, google)

        // for chekcing whther user's data already availabale in database or not so we can ask for more info
        let a = await fetch(`http://localhost:4000/users/check-user?id=${auth.currentUser?.uid}`, {
            method: "GET"
        })

        let response = await a.json()

        if (response.user === null) {
            setStep(prev => prev + 1)
            await delay(1000)
            setStep(prev => prev + 1)
            setShowSteps(false)
            await delay(400)
            setStep(prev => prev + 1)
            await delay(50)
            setStep(prev => prev + 1)
        }
        else {
            await saveUser(setLoader)
            router.push('/validation')
        }

    } catch (err) {
        alert("Error signing in with Google." + err)
        setLoader(false)
    }
}

//for fetching eta of drivers
export async function fetchEta({ sources, targets, setAvgTime, setDriversTime, drivers }: { sources: any[], targets: any[], setAvgTime: Dispatch<SetStateAction<number>>, setDriversTime: Dispatch<SetStateAction<Record<string, string>>>, drivers: any[] }) {
    const body = {
        mode: 'drive',
        sources: sources,
        targets: targets
    }

    let a = await fetch(`https://api.geoapify.com/v1/routematrix?apiKey=7c961581499544e085f28a826bf9ebeb`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    let data = await a.json()
    const times = data.sources_to_targets.map((item: any) => item[0].time)
    const avgTime = Math.round(
        times.reduce((a: number, b: number) => a + b, 0) / times.length / 60
    )
    setAvgTime(avgTime)

    // for getting ETA of drivers separately
    times.forEach((t: any, i: any) => {
        const time = `${Math.round(t / 60)} min`

        setDriversTime((prev: Record<string, string>) => ({
            ...prev,
            [drivers[i].userId]: time
        }))
    })
}

export async function trackRideTime(ride: any, setTimeLeft: Dispatch<SetStateAction<{ hours: number, minutes: number, seconds: number, status: string }>>, isCancelled: boolean, setRide: Dispatch<SetStateAction<any>>) {
    const rideDate = new Date(ride.rideDetails.date);
    const [hours, minutes, period] = ride.rideDetails.time.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1);

    rideDate.setHours(
        period === 'PM' ? (parseInt(hours) === 12 ? 12 : parseInt(hours) + 12) :
            (parseInt(hours) === 12 ? 0 : parseInt(hours)),
        parseInt(minutes)
    );

    const now = new Date();
    const difference = rideDate.getTime() - now.getTime();

    if (difference <= 0) {
        if (!isCancelled) {
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0, status: 'started' });

            try {
                const response = await fetch('http://localhost:4000/rides/update-ride-status', {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rideId: ride._id, status: 'ready' })
                });

                const data = await response.json();
                if (data.statusCode === 200) {
                    setRide(data.data);
                    socket.emit('ride-updated', { ride: data.data, rideId: ride._id });
                }
            } catch (err) {
                console.error(err);
            }
        }
        return;
    }

    const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
    const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);

    if (!isCancelled) {
        setTimeLeft({ hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft, status: 'upcoming' });
    }
}

//for drawing routes
export async function drawRoute(from: any, to: any, map: any, toggleTheme: boolean | undefined) {
    const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    const data = await res.json();
    const route = data.routes[0].geometry;

    if (map.getSource("route")) {
        map.getSource("route").setData(route);
    } else {
        map.addSource("route", {
            type: "geojson",
            data: route,
        });

        map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round"
            },
            paint: {
                "line-color": toggleTheme ? "#f0f0f0" : "#202020",
                "line-width": 4
            }
        });
    }
};
