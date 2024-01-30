"use client"

import {FC} from "react";
import {useRouter} from "next/navigation";
import {twMerge} from "tailwind-merge";
import {RxCaretLeft, RxCaretRight} from "react-icons/rx";
import {HiHome} from "react-icons/hi";
import {BiSearch} from "react-icons/bi";
import Button from "@/components/Button";
import useAuthModal from "@/hooks/useAuthModule";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useUser} from "@/hooks/useUser";
import {FaUserAlt} from "react-icons/fa";
import { toast } from "react-hot-toast";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header:FC<HeaderProps> = ({children,className}) => {

    const router = useRouter()
    const authModal = useAuthModal()

    const supabaseClient = useSupabaseClient()

    const { user } = useUser()

    const handleLogout = async () => {
        let a = await supabaseClient
        console.log(a)
        const { error } = await supabaseClient.auth.signOut()
        router.refresh()
        console.log(1)
        if (error){
            toast.error(error.message)
            console.log(2)
        } else{
            toast.success('logged out')
            console.log(3)
        }
    }

    return (
        <div
            className={twMerge(`
                h-fit
                bg-gradient-to-b
                from-emerald-800
                p-6 
            `,
                className
            )}
        >
            <div
                className='
                    w-full
                    mb-4
                    flex
                    items-center
                    justify-between
                '
            >
                <div
                    className='
                        hidden
                        md:flex
                        gap-x-2
                        items-center
                    '
                >
                    <button
                        onClick={() => router.back()}
                        className='
                            rounded-full
                            bg-black
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        '
                    >
                        <RxCaretLeft size={35} className={'text-white'}/>
                    </button>
                    <button
                        onClick={() => router.forward()}
                        className='
                            rounded-full
                            bg-black
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        '
                    >
                        <RxCaretRight size={35} className={'text-white'}/>
                    </button>
                </div>
                <div className='flex md:hidden gap-x-2 items-center'>
                    <button
                        className="
                            rounded-full
                            p-2
                            bg-white
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "
                    >
                        <HiHome className={'text-black'} size={20}/>
                    </button>
                    <button
                        className="
                            rounded-full
                            p-2
                            bg-white
                            flex
                            items-center
                            justify-center
                            hover:opacity-75
                            transition
                        "
                    >
                        <BiSearch className={'text-black'} size={20}/>
                    </button>
                </div>
                <div
                    className="
                        flex
                        justify-between
                        items-center
                        gap-x-4
                    "
                >
                    {/* что    где это сохраняется        что это      (user)*/}
                    {user ? (
                        <div className={`flex gap-x-4 items-center`}>
                            <Button
                                onClick={handleLogout}
                                className={`bg-white px-6 py-2`}
                            >
                                Loggout
                            </Button>
                            <Button
                                onClick={() => router.push('/account')}
                                className={`bg-white`}
                            >
                                <FaUserAlt/>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="
                                        bg-transparent
                                        text-neutral-300
                                        font-medium
                                    "
                                >
                                    Sign up
                                </Button>
                            </div>

                            <div>
                                <Button
                                    onClick={authModal.onOpen}
                                    className="
                                        bg-white
                                        px-6
                                        py-2
                                    "
                                >
                                    Log in
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default Header;