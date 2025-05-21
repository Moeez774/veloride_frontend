import { useState, useEffect } from "react"

interface T{
    data: any;
    loading: boolean;
    error: Error | null;
}

export const useFetch = <T>(fetchFunction: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const fetchData = async() => {
        try {
            setLoading(true)
            setError(null)
            const result = await fetchFunction()
            setData(result);

        } catch(err) {
            // @ts-ignore
            setError(err instanceof Error ? err : new Error("An error occurred"));
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return { data, error, loading }
}