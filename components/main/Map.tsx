'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from 'next/navigation';
import Alert from './Alert';
import { X } from 'lucide-react';

interface Details {
    setter1: Dispatch<SetStateAction<string | null>>,
    setter2: Dispatch<SetStateAction<string | null>>,
    mapSetter: Dispatch<SetStateAction<boolean>>,
    val1: string | null,
    val2: string | null,
    link: string,
    setLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>,
    statements: string[],
    location: { long: number; lat: number },
    secondStatements: string[],
    setDropLocation: Dispatch<SetStateAction<{ long: number, lat: number }>>,
    dropLocation: { long: number; lat: number },
}

mapboxgl.accessToken = 'pk.eyJ1IjoibW9lZXoxMjMiLCJhIjoiY204Z3p3cHNrMDUxbjJrcjhvbGYxanU2MyJ9.ErFjedlF8xF7QZQmyTnIiw';

const Map: React.FC<Details> = ({ setter1, setter2, link, setLocation, statements, mapSetter, val1, val2, location, secondStatements, dropLocation, setDropLocation }) => {

    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null)
    const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

    //for taking first two places that pinned
    const [places, setPlaces] = useState<any[]>([])
    const [warn, setWarn] = useState(false)
    const [proceed, setProceed] = useState(false)

    //for navigation to form page
    const router = useRouter()

    useEffect(() => {
        setWarn(true)
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([longitude, latitude]);
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    }, []);

    useEffect(() => {
        if (!userLocation) return;

        const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: userLocation,
            zoom: 14
        });

        mapInstance.addControl(new mapboxgl.NavigationControl());

        // Add a red marker for user's location
        new mapboxgl.Marker({ color: "red" })
            .setLngLat(userLocation)
            .setPopup(new mapboxgl.Popup().setHTML("<h3>You are here!</h3>"))
            .addTo(mapInstance);

        mapInstance.on('click', async (e) => {
            const { lng, lat } = e.lngLat;

            if (markers.length >= 2) return

            var requestOptions = {
                method: 'GET',
            }

            // Fetch place name using Mapbox Geocoding API
            let a = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=7c961581499544e085f28a826bf9ebeb`, requestOptions)
            const response = await a.json()
            setPlaces(prev => ([prev, ...response.features]))

            // Create a new marker
            const newMarker = new mapboxgl.Marker({ color: "blue" })
                .setLngLat([lng, lat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>hy</h3>`))
                .addTo(mapInstance)

            // Add the new marker to the state
            setMarkers(prevMarkers => [...prevMarkers, newMarker])
        });

        setMap(mapInstance)

        return () => mapInstance.remove()
    }, [userLocation])

    // setting pickup and drop location after two pins first pin as pikcup and then second as drop
    useEffect(() => {
        if (markers.length === 2) {

            // getting places name and setting them
            const place1 = `${places[0][1].properties.address_line1}, ${places[0][1].properties.address_line2}`
            const place2 = `${places[1].properties.address_line1}, ${places[1].properties.address_line2}`
            setter1(place1)
            setter2(place2)

            // getting longs and lats
            const longs = places[0][1].geometry.coordinates[0]
            const lat = places[0][1].geometry.coordinates[1]
            const dropLongs = places[1].geometry.coordinates[0]
            const dropLat = places[1].geometry.coordinates[1]
            setLocation({
                long: longs,
                lat: lat
            })
            setDropLocation({
                long: dropLongs,
                lat: dropLat
            })

            setProceed(true)
        }
    }, [markers])

    // for proceeding next after confirming locations
    const proceedNext = () => {
        document.body.style.overflowY = 'auto'
        setUserLocation(null)
        router.push(`${link}?from=${encodeURIComponent(val1 || '')}&long=${location.long}&lat=${location.lat}&to=${encodeURIComponent(val2 || '')}&dropLong=${dropLocation.long}&dropLat=${dropLocation.lat}`)
        setProceed(false)
    }

    // for resetting markers if user want to change locations
    const resetLocations = () => {
        setProceed(false)
        setPlaces([])
        markers.forEach(marker => marker.remove());
        setMarkers([])
    }

    const ok = () => setWarn(false)
    const cancel = () => {
        setWarn(false)
        mapSetter(false)
    }

    return (
        <>
           { userLocation && <div className='absolute top-0 p-6 left-0 z-[100]'>
                <div className='p-2.5 cursor-pointer transition-all duration-200 hover:bg-[#fefefead] rounded-full bg-[#fefefe]' onClick={() => mapSetter(false)}>
                    <X size={22} color='#202020' />
                </div>
            </div> }
            <Alert item={warn} statements={statements} setter={setWarn} func1={() => ok()} func2={() => cancel()} />

            <div id="map" className='z-[100] w-full h-full' />
            {!userLocation && <p className='loader'></p>}

            <Alert item={proceed} statements={secondStatements} setter={setProceed} func1={() => proceedNext()} func2={() => resetLocations()} />
        </>
    );
};

export default Map;
