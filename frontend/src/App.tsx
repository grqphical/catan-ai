import { useEffect, useState } from "react"

function App() {
    const [board, setBoard] = useState<unknown>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()
        fetch("/api/board", { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`Request failed: ${res.status}`)
                return res.json()
            })
            .then(setBoard)
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message)
            })
        return () => controller.abort()
    }, [])
    return (
        <>
            <p>{JSON.stringify(board)}</p>
        </>
    )
}

export default App
