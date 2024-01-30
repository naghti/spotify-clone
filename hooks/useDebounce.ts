import {useEffect, useState} from "react";

function useDebounce<T> (value:T,delay?:number): T{
    const [debouncedValue, setDebouncedValue] = useState(value)

    // поиск по трекам только спустя 500мс после того как юзер перестал печатать
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        },delay || 500)

        return () => {
            clearTimeout(timer)
        }
    },[value,delay])

    return debouncedValue
}

export default useDebounce