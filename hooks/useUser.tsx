import {User} from "@supabase/gotrue-js";
import { UserDetails ,Subscription} from "@/types";
import {useSessionContext, useUser as useSupaUser} from "@supabase/auth-helpers-react";
import {createContext, useContext, useEffect, useState} from "react";
import {supabase} from "@supabase/auth-ui-shared";

type UserContextType = {
    accessToken: string | null
    user: User | null
    userDetails: UserDetails | null
    isLoading: boolean
    subscription: Subscription | null
}

export const UserContext = createContext<UserContextType | undefiend>(
    undefined
)

export interface Props{
    [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading:isLoadingUser
    } = useSessionContext()

    const user = useSupaUser()
    const accesToken = session?.access_token ?? null
    const [isLoadingData,setIsLoadingData] = useState(false)
    const [userDetails,setUserDetails] = useState<UserDetails | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)

    const getUserDetails = () => supabase.from('users').select('*').single()
    const getSubscription = () =>
        supabase
            .from('subscriptions')
            .select('*,prices(*,product(*))')
            .in('status',['trialing','active'])
            .single()

    useEffect(() => {
        if(user && isLoadingData && !userDetails && !subscription){
            setIsLoadingData(true)

            Promise.allSettled([getUserDetails(), getSubscription()]).then(
                (results) => {
                    const userDetailsPromise = results[0]
                    const subscriptionPromise = results[1]

                     if (userDetailsPromise.status == "fullfield"){
                         setUserDetails(userDetailsPromise.value.data as UserDetails)
                     }

                     if(subscriptionPromise.status === 'fullfield'){
                         setSubscription(subscriptionPromise.value.data as Subscription)
                     }

                     setIsLoadingData(false)
                }
            )
        } else if(!user && !isLoadingUser && !isLoadingData){
            setUserDetails(null)
            setSubscription(null)
        }
    }, [user, isLoadingUser]);

    const value = {
        accesToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    }

    return <UserContext.Provider value={value} {...props}/>
}

export const useUser = () => {
    const context = useContext(UserContext)
    if(context === undefined){
        throw new Error('useUser must be used within a MyUserContextProvider')
    }

    return context
}