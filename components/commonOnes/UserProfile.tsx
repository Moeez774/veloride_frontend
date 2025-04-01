import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { Car, DoorOpen, Gift, Leaf, LifeBuoy, LogOut, MessageCircle, ShieldCheck, Sliders, User, User2, Wallet } from 'lucide-react'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Details {
    user: any,
    scroll: boolean,
    logOut: () => Promise<void>
}

const UserProfile: React.FC<Details> = ({ user, scroll, logOut }) => {

    const router = useRouter()
    
    return (
        <div className='hidden md:flex items-center'>

            {user && <DropdownMenu>
                <DropdownMenuTrigger className='outline-none'>
                    <div className='cursor-pointer flex items-center'>
                        {/* if user hasn't any photo */}
                        {user.photo?.startsWith("hsl") && (
                            <div className={`rounded-full flex justify-center items-center text-white ${scroll? 'h-7 w-7 md:w-9 md:h-9': 'h-8 w-8 md:w-10 md:h-10'}`} style={{ background: user.photo }}>
                                <h1 className='inter md:text-lg'>{user.fullname?.charAt(0).toUpperCase()}</h1>
                            </div>
                        )}

                        {/* user with profile */}
                        {!user.photo?.startsWith("hsl") && (
                            <div>
                                <img className={`${scroll? 'w-7 md:w-9': 'w-8 md:w-10'} transition-all duration-200 rounded-full`} src={user.photo || undefined} alt="" />
                            </div>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='inter hidden lg:block w-56 text-[#202020] p-2 -translate-x-20'>
                    <DropdownMenuLabel className='inter'>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className='cursor-pointer'><User2 size={15} color='#202020' /> Profile & Settings</DropdownMenuItem>
                    <Link href={'/chats'} ><DropdownMenuItem className='cursor-pointer'><MessageCircle size={15} color='#202020' /> Messages </DropdownMenuItem></Link>
                    <Link href={'/my-rides'} ><DropdownMenuItem className='cursor-pointer'><Car size={15} color='#202020' /> Your Rides</DropdownMenuItem></Link>
                    <DropdownMenuItem className='cursor-pointer'><Wallet size={15} color='#202020' /> Payments & Wallet</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem className='cursor-pointer'><Leaf size={15} color='#202020' /> Eco Rewards & Badges</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'><LifeBuoy size={15} color='#202020' /> Support & Help</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'><Gift size={15} color='#202020' /> Refer & Earn</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'><ShieldCheck size={15} color='#202020' /> Privacy & Security</DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer' onClick={async () => {
                        await logOut()
                        await signOut(auth)
                        router.push('/hop-in')
                    }}><DoorOpen size={15} color='#202020' /> Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>}

            {!user && <Link href='/auth/sign-in' ><User size={scroll ? 22 : 25} className='transition-all duration-200 cursor-pointer' color='#202020' /></Link>}


        </div>
    )
}

export default UserProfile
