import { auth } from "@/firebase"
import socket from "@/utils/socket"
import { User } from "firebase/auth"
import { Dispatch, SetStateAction } from "react"


// for saving user's data
export async function saveUsersData(setLoader: Dispatch<SetStateAction<boolean>>, user: User, city: string, number: string, isAgree: boolean, setShowMessage: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>, router: any) {

    setLoader(true)
    setMessage('')
    // calling server for saving user's data if not saved already
    let a = await fetch('http://localhost:4000/users/providers-sign-in', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ _id: auth.currentUser?.uid, fullname: user?.displayName, email: user?.email, pass: null, number: number, city: city, remember: false, photo: user?.photoURL, isAgree: isAgree, isProvider: true })
    })

    let response = await a.json()
    if (response.statusCode === 200) {
        router.push('/authorization')
    }
    else {
        setShowMessage(true)
        setMessage(response.message)
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
export async function signUserUp(setLoader: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>, email: string, fullname: string, pass: string, confirmPass: string, number: string, city: string, agree: boolean, setShowMessage: Dispatch<SetStateAction<boolean>>, router: any) {

    //generating random color for profile backgorund
    const color = generateHSLColor()
    setLoader(true)
    setMessage('')
    const userId = `${email}_${new Date().getTime()}`

    try {
        let a = await fetch('http://localhost:4000/users/sign-up', {
            method: "POST", headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ _id: userId, fullname: fullname, email: email, pass: pass, confirmPass: confirmPass, number: number, city: city, remeber: false, photo: color, isAgree: agree, isProvider: false })
        })

        let response = await a.json()
        if (response.statusCode === 200) {
            router.push('/authorization')
        }
        else {
            setShowMessage(true)
            setMessage(response.message)
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
    
    if(message!='') {
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
        if(!isExist) {
            socket.emit("add-contact", { receiver_id: receiver_id, chat_id: chat_id, sender_id: sender_id })
        }
        setIsExist(true)
    }
}