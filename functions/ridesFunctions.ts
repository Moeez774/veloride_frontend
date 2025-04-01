import { Dispatch, SetStateAction } from "react"

const accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw';

// for offering a ride
export async function offerRide(userId: string | null | undefined, driverName: string, location: { long: number, lat: number }, dropLocation: { long: number, lat: number }, pickup: string | null, drop: string | null, seats: number, time: string, date: string | undefined, vehicle: string, ride: string, luggage: boolean, petFriendly: boolean, smoking: boolean, needs: boolean, gender: string, negotiate: boolean, recurring: boolean, recurringVal: string, photo: string, note: string, number: boolean, email: boolean, setLoader: Dispatch<SetStateAction<boolean>>, setMessage: Dispatch<SetStateAction<string>>, budget: string, setShowMessage: Dispatch<SetStateAction<boolean>>, setStatusCode: Dispatch<SetStateAction<number>>) {

    setLoader(true)
    setMessage('')
    setStatusCode(0)
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${location.long},${location.lat};${dropLocation.long},${dropLocation.lat}?access_token=${accessToken}`;

    const info = await fetch(url);
    const jsonInfo = await info.json();

    if (jsonInfo.code === 'Ok') {
        const route = jsonInfo.routes[0];
        const distance = (route.distance / 1000).toFixed(2)
        const duration = (route.duration / 60).toFixed(2)

        //generating randomg id for ride
        const rideId = `${location.long}_${location.lat}_${new Date().getTime()}`

        // complete data
        const data = {
            _id: rideId, driverName: driverName, userId: userId, pickupName: pickup, coordinates: [location.long, location.lat], dropLocationCoordinates: [dropLocation.long, dropLocation.lat], dropoffLocation: drop, date: date, seats: seats, time: time, vehicle: vehicle, rideType: ride, luggageAllowed: luggage, petAllowed: petFriendly, smokingAllowed: smoking, wheelchairAccess: needs, gender: gender, totalBudget: budget, negotiate: negotiate, recurring: recurring, recurringVal: recurringVal, photo: photo, note: note, number: number, email: email, distance: distance, duration: duration
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
    } else {
        setStatusCode(404)
        setShowMessage(true)
        setMessage("Failed to fetch routes. Please ensure all fields are filled or try again.")
    }

}