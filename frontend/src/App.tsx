import { useEffect, useState, type FormEvent } from "react"
import { PlayerColour, type GameState } from "./types";

function App() {
    const [gameState, setGameState] = useState({} as GameState);
    const [loadedGameState, setLoadedGameState] = useState(false);

    useEffect(() => {
        fetch("/api/game-state")
            .then((res) => res.json())
            .then((json) => {
                setGameState(json);
                setLoadedGameState(true);
            }).catch((err) => console.error(err))
    }, [])

    if (!loadedGameState) {
        return (
            <div>
                <h1>Loading Game State</h1>
            </div>
        )
    }

    const addPlayer = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const colour = formData.get("colour") as PlayerColour;
        const ai = formData.get("ai") === "on";

        fetch("/api/add-player", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "colour": colour,
                "ai": ai
            }),
        }).catch((err) => console.error(err));

        setGameState((prevState) => ({
            ...prevState,
            players: [...prevState.players, { colour, ai, wheat: 0, bricks: 0, wood: 0, sheep: 0, stone: 0 }],
            used_colours: [...prevState.used_colours, colour]
        }));
    }

    return (
        <>
            <h1>Catan AI</h1>
            <h3>Player Count: {gameState.players.length}</h3>
            <form onSubmit={addPlayer}>
                <h2>Create New Player</h2>
                <select name="colour" id="colour">
                    {
                        Object.values(PlayerColour).map((colour) => {
                            if (gameState.used_colours.includes(colour as PlayerColour) === false)
                                return <option value={colour} key={colour}>{colour}</option>
                        })
                    }
                </select>
                <label htmlFor="ai">AI?</label>
                <input type="checkbox" name="ai" id="ai" />
                <input type="submit" value="Submit" />
            </form>
            {
                gameState.players.map((player, index) => {
                    return <div key={index}>
                        <p>Colour: {player.colour}</p>
                        <p>Is AI?: {player.ai ? "yes" : "no"}</p>
                    </div>
                })
            }
        </>
    )
}

export default App
