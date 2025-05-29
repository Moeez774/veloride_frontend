import { useAuth } from "@/context/AuthProvider";
import { Notification } from "@/context/states";
import socket from "@/utils/socket";
import { Dispatch, SetStateAction } from "react"

const accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw';

// for offering a ride
export async function offerRide(userId: string | null | undefined, driverName: string, location: { long: number, lat: number }, dropLocation: { long: number, lat: number }, pickup: string | null, drop: string | null, seats: number, time: string, date: string | undefined, vehicle: string, ride: string, luggage: boolean, petFriendly: boolean, smoking: boolean, negotiate: boolean, photo: string, note: string, number: boolean, email: boolean, setLoader: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>, budget: number, setShowMessage: Dispatch<SetStateAction<boolean>>, setStatusCode: Dispatch<SetStateAction<number>>, user: any, setNotifications: Dispatch<SetStateAction<Notification[]>>) {

    setLoader(true)
    setMessage('')
    setStatusCode(0)
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.long},${location.lat};${dropLocation.long},${dropLocation.lat}?access_token=${accessToken}`;

    const info = await fetch(url)
    const jsonInfo = await info.json()

    if (jsonInfo.code === 'Ok') {
        const route = jsonInfo.routes[0];
        const distance = (route.distance / 1000).toFixed(2)
        const duration = (route.duration / 60).toFixed(2)

        //generating randomg id for ride
        const rideId = `${location.long}_${location.lat}_${new Date().getTime()}`

        // complete data
        const data = {
            _id: rideId, driver_rating: user?.rating, driverName: driverName, userId: userId, pickupName: pickup, coordinates: [location.long, location.lat], dropLocationCoordinates: [dropLocation.long, dropLocation.lat], dropoffLocation: drop, date: date, seats: seats, time: time, vehicle: vehicle, rideType: ride, luggageAllowed: luggage, petAllowed: petFriendly, smokingAllowed: smoking, gender: user?.gender, totalBudget: budget, negotiate: negotiate, photo: photo, note: note, number: number, email: email, distance: distance, duration: duration, passengers: [], rating: user?.rating
        }

        let a = await fetch('http://localhost:4000/rides/offer-ride', {
            method: "POST", headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: data })
        })

        let response = await a.json()
        setStatusCode(response.statusCode)
        setShowMessage(true)
        setMessage(response.message)

        const notification = response.notification
        const otpNotification = response.otpNotification

        setNotifications(prev => [otpNotification, notification, ...prev])

    } else {
        setStatusCode(404)
        setShowMessage(true)
        setMessage("Failed to fetch routes. Please ensure all fields are filled or try again.")
    }

}

//function for finding best ride for user
export async function findRide(pickup: string | null, drop: string | null, date: string | undefined, passengers: number, time: string, price: number, vehicle: string, location: { long: number, lat: number }, dropLocation: { long: number, lat: number }, email: boolean, number: boolean, setMatchedRides: Dispatch<SetStateAction<any>> | null, setHideForm: Dispatch<SetStateAction<boolean>>, router: any, luggage: boolean, petFriendly: boolean, smoking: boolean, rating: string, setLoader: Dispatch<SetStateAction<boolean>>, setShowMessage: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>, ride: string, gender: string, user: any) {

    //complete data
    const data = {
        pickup: pickup, drop: drop, date: date, time: time, passengers: passengers, price: price, vehicle: vehicle, location: location, dropLocation: dropLocation, number: number, email: email, rating: rating, smoking: smoking, petFriendly: petFriendly, luggage: luggage, rideType: ride, gender: gender, userId: user?._id
    }

    // returning error if all fields are not filled properly
    if (data.pickup === '' || data.drop === '' || data.date === '' || data.time === '' || data.vehicle === '') {
        setHideForm(false)
        setLoader(true)
        setTimeout(() => {
            setMessage("Please fill out all required fields for proceeding.")
            setShowMessage(true)
        }, 10)
        return
    }

    setHideForm(true)

    let a = await fetch('http://localhost:4000/rides/find-ride', {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: data })
    })

    const response = await a.json()
    if (response.statusCode === 200 && setMatchedRides) {
        const allRides = {
            rides: response.rides,
            cheapest: response.cheapest,
            preferred: response.preferred
        }

        setMatchedRides(allRides)
        router.push(`/matched-rides?pickupLocation=${pickup}&pickupLongs=${location.long}&pickupLats=${location.lat}&dropoffLocation=${drop}&dropoffLongs=${dropLocation.long}&dropoffLats=${dropLocation.lat}&isFound=${response.found ? 'true' : 'false'}`)
    }
    else {
        setHideForm(false)
        setLoader(true)
        setTimeout(() => {
            setMessage(response.message)
            setShowMessage(true)
        }, 10)
    }
}

//for declining passenger
export async function declinePassenger(rideId: string, passengerId: string, declineMessage: string) {
    try {
        const response = await fetch('http://localhost:4000/rides/decline-passenger', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rideId: rideId, passengerId: passengerId, declineMessage: declineMessage })
        })

        const data = await response.json()
        alert(data.message)
        if (data.statusCode === 200) {
            return data
        }
    } catch (error) {
        alert(error)
        return
    }
}

//for marking passenger dropped off
export async function markPassengerDroppedOff(rideId: string, passengerId: string) {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/drop-passenger`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rideId: rideId, passengerId: passengerId })
        })

        const data = await res.json()
        alert(data.message)
        if (data.statusCode === 200) {
            socket.emit('passenger-dropped-off', { rideId: rideId, passengerId: passengerId, ride: data.ride, notification: data.notification })
            return data.ride
        }
    } catch (error) {
        console.log(error)
        return
    }
}
