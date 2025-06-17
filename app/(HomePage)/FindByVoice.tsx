import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import '@/components/commonOnes/Commons.css'
import { isFuture, isPast, isToday, isYesterday } from 'date-fns'
import { fetchSuggestions, isFutureTime, isPassengerCount, tts } from '@/functions/function'
import { useAuth } from '@/context/AuthProvider'
import { getContacts } from '@/context/ContactsProvider'
import { useRouter } from 'next/navigation'

interface Details {
    start: boolean,
    setStart: Dispatch<SetStateAction<boolean>>,
    setIsSpeaking: Dispatch<SetStateAction<boolean>>,
    isSpeaking: boolean,
    states: any,
    setStates: Dispatch<SetStateAction<any>>,
    step: number,
    setStep: Dispatch<SetStateAction<number>>,
    setIsFetched: Dispatch<SetStateAction<boolean>>,
    questions: any[],
    isLoader: boolean,
    setIsLoader: Dispatch<SetStateAction<boolean>>,
    isListening: boolean,
    setIsListening: Dispatch<SetStateAction<boolean>>,
    message: string,
    setShowVoiceDialog: Dispatch<SetStateAction<boolean>>
}

const FindByVoice: React.FC<Details> = ({ start, setStart, setIsSpeaking, isSpeaking, states, setStates, step, setStep, setIsFetched, questions, isLoader, setIsLoader, isListening, setIsListening, message, setShowVoiceDialog }) => {

    const context = useAuth()
    const user = context?.user
    const authContext = getContacts()
    const router = useRouter()
    const setMatchedRides = authContext?.setMatchedRides
    const hasSpokenRef = useRef<boolean>(false);
    const [suggestions, setSuggestions] = useState<any[]>([])

    const checkDate = (date: string) => {
        const inputDate = new Date(date);
        const past = isPast(inputDate)
        const today = isToday(inputDate)
        const future = isFuture(inputDate)
        return !isNaN(inputDate.getTime()) && date.trim().length > 0 && (!past || today || future);
    }

    // for checking vehicle type validation
    const checkVehicleType = (vehicleType: string) => {
        const vehicleTypes = ['1', '2', '3', '4', 'one', 'two', 'three', 'four', 'compact car', 'sedan', 'suv', 'luxury car'];
        return vehicleTypes.includes(vehicleType.toLowerCase())
    }

    //setting places
    const fetchData = async (input: string) => {
        const results = await fetchSuggestions(input, undefined, setSuggestions)
        if (!results || results.length === 0) {
            hasSpokenRef.current = false
            await handleSpeak({ prompt: "Sorry! we couldn't find this location. Please say valid location." })
            return
        }
        setStates((prevStates: any) => ({
            ...prevStates,
            [questions[step].key]: {
                name: results[0].properties.address_line1 + ', ' + results[0].properties.address_line2,
                coordinates: {
                    long: results[0].geometry.coordinates[0],
                    lat: results[0].geometry.coordinates[1]
                },
                shortName: results[0].properties.address_line1
            },
        }))

        setStep((prev) => prev + 1)
    }

    const startListening = async ({
        expectConfirmation,
        onTranscript,
        positiveWord = '',
        negativeWord = '',
    }: {
        expectConfirmation: boolean;
        onTranscript: (transcript: string, isPositive?: boolean) => void;
        positiveWord?: string;
        negativeWord?: string;
    }) => {
        const SpeechRecognition =
            (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
            const result = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
            if (expectConfirmation) {
                if (result.includes(positiveWord)) {
                    onTranscript(result, true);
                } else if (result.includes(negativeWord)) {
                    onTranscript(result, false);
                }
            } else {
                if (questions[step].key === 'passengerCount') {
                    if (isPassengerCount(result)) {
                        onTranscript(result);
                    } else {
                        handleSpeak({ prompt: "Please say valid passenger count like 'three passengers'." })
                    }
                }
                else if (questions[step].key === 'pickupDate') {
                    if (checkDate(result)) {
                        onTranscript(result);
                    } else {
                        handleSpeak({ prompt: "Please say valid today or upcoming date." })
                    }
                } else if (questions[step].key === 'vehicleType') {
                    if (checkVehicleType(result)) {
                        onTranscript(result);
                    } else {
                        handleSpeak({ prompt: "Please say valid vehicle type like Sedan, SUV, Compact Car, Luxury Car." })
                    }
                }
                else if (questions[step].key === 'pickupTime') {
                    if (isFutureTime(result, isToday(new Date(states.pickupDate)))) {
                        onTranscript(result);
                    } else {
                        handleSpeak({ prompt: "Please say valid upcoming time." })
                    }
                }
                else if (questions[step].key === 'desiredFare') {
                    if (result.includes('no')) {
                        setStep(0)
                        setStates((prevStates: any) => ({
                            ...prevStates,
                            allFares: [],
                        }))
                        setIsSpeaking(false)
                        hasSpokenRef.current = false
                    } else if (result.includes('pkr')) {
                        onTranscript(result);
                    }
                    else {
                        handleSpeak({ prompt: "Please say valid fare from below options, like 'PKR 300' or '300 PKR'. And again if you're unsure, say 'No' to start over." })
                    }
                }
                else {
                    onTranscript(result);
                }
            }

            recognition.stop()
            setIsListening(false)
        }

        recognition.start()
    }

    const handleSpeak = async (question: any) => {
        if (isSpeaking) return;

        if (questions[step].key === 'confirmation') {
            setStates((prevStates: any) => ({
                ...prevStates,
                allFares: [],
            }))
        }

        const promptText = typeof question.prompt === 'function' ? question.prompt(states) : question.prompt;
        await tts(promptText, setIsSpeaking)

        const expectConfirmation = step === 0 || typeof question.prompt === 'function';

        if (step === 7) {
            hasSpokenRef.current = false
            setStep((prev) => prev + 1)
        }
        else {
            setIsListening(true)
            await startListening({
                expectConfirmation,
                positiveWord: 'yes',
                negativeWord: 'no',
                onTranscript: async (transcript, isPositive) => {
                    hasSpokenRef.current = false;

                    if (expectConfirmation) {
                        if (isPositive) {
                            setStep((prev) => prev + 1);
                        } else {
                            setStep(0);
                            setStates((prevStates: any) => ({
                                ...prevStates,
                                allFares: [],
                            }))
                        }
                    } else {
                        if (questions[step].key === 'pickupLocation' || questions[step].key === 'dropoffLocation') {
                            await fetchData(transcript)
                        }
                        else {
                            setStep((prev) => prev + 1);
                            setStates((prevStates: any) => ({
                                ...prevStates,
                                [questions[step].key]: transcript,
                            }));
                        }
                    }
                },
            });
        }
    };

    useEffect(() => {
        if (start && step < questions.length && !hasSpokenRef.current) {
            hasSpokenRef.current = true;
            handleSpeak(questions[step]);
        }

        if (!start || step >= questions.length) {
            setStep(0);
            setIsSpeaking(false);
            hasSpokenRef.current = false;
        }
    }, [start, step])

    useEffect(() => {
        if (step === questions.length) {
            const confirm = async () => {
                setIsLoader(true)
                setStart(false)
                setStep(0)
                return new Promise(async (resolve) => {
                    await tts("Thank you for providing the information. Please wait while we process your request.", setIsSpeaking)
                    resolve(true)
                })
            }

            confirm().then(() => {
                const data = {
                    pickup: states.pickupLocation,
                    dropoff: states.dropoffLocation,
                    vehicleType: states.vehicleType,
                    date: states.pickupDate,
                    time: states.pickupTime,
                    passengers: states.passengerCount,
                    budget: states.desiredFare,
                    userId: user?._id
                }

                const fetchData = async () => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/voice/find-ride-by-voice`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        const responseData = await response.json()
                        if (responseData.statusCode === 200) {
                            setIsFetched(true)
                            const allRides = {
                                rides: responseData.rides,
                                cheapest: responseData.cheapest,
                                preferred: responseData.preferred
                            }

                            if (allRides && setMatchedRides) {
                                setMatchedRides(allRides)
                                await tts(responseData.message, setIsSpeaking)
                                router.push(`/matched-rides?pickupLocation=${states.pickupLocation.shortName}&pickupLongs=${states.pickupLocation.coordinates.long}&pickupLats=${states.pickupLocation.coordinates.lat}&dropoffLocation=${states.dropoffLocation.shortName}&dropoffLongs=${states.dropoffLocation.coordinates.long}&dropoffLats=${states.dropoffLocation.coordinates.lat}&isFound=${responseData.found ? 'true' : 'false'}`)
                            }
                        } else {
                            setIsLoader(false)
                            await tts(responseData.message, setIsSpeaking)
                            setShowVoiceDialog(false)
                        }

                    } catch (err: any) {
                        console.log(err)
                        setIsLoader(false)
                        await tts(err.message, setIsSpeaking)
                        setShowVoiceDialog(false)
                    }
                }
                fetchData()
            }).catch(() => {
                setIsLoader(false)
            })
        }
    }, [step])
    return (
        <div></div>
    )
}

export default FindByVoice