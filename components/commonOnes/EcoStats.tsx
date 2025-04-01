import React, { useEffect, useState } from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const EcoStats = () => {

    const [features, setFeatures] = useState<any>()
    
        // fetching features from backend
        useEffect(() => {
    
            const fetchFeatures = async () => {
                let a = await fetch('http://localhost:4000/data', {
                    method: "GET"
                })
    
                let response = await a.json()
                setFeatures(response.features)
            }
    
            fetchFeatures()
        }, [])
    

    return (
        <div>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className='exo2 cursor-pointer font-medium text-[#202020]'>Eco stats</NavigationMenuTrigger>
                        <NavigationMenuContent className='w-60'>

                            <div className='flex w-96 gap-3'>

                                <div className='flex items-center'>
                                    <img className='w-48' src="/Images/Leonardo_Phoenix_10_A_stunning_highcontrast_illustration_of_a_3.jpg" alt="" />
                                </div>

                               { features && <div className='flex flex-col'>
                                    {features["EcoStats"].map((e: any, index: number) => {
                                        return (
                                            <NavigationMenuLink className='cursor-pointer' key={index}>
                                                <div className='flex flex-col gap-1'>
                                                    <h1 className='exo2 font-semibold'>{e.name}</h1>
                                                    <h1 className='text-xs inter'>{e.about}</h1>
                                                </div>
                                            </NavigationMenuLink>
                                        )
                                    })}
                                </div> }
                            </div>

                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

export default EcoStats
