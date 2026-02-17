import type { FormEvent } from "react";
import { GamePhase, PlayerColour, type GameState } from "../types";

interface PlayerSetupProps {
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export default function PlayerSetup({ gameState, setGameState }: PlayerSetupProps) {
    const addPlayer = (e: FormEvent) => {
        e.preventDefault();
        if (gameState.players.length == 4) {
            return
        }

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

    const resetPlayers = () => {
        setGameState((prevState) => ({
            ...prevState,
            players: [],
            used_colours: []
        }));

        fetch("/api/reset-players", {
            method: "PATCH"
        })
    }

    const movePhases = () => {
        setGameState((prevState) => ({
            ...prevState,
            phase: GamePhase.MAP_MAKING
        }));

        fetch(`/api/set-game-phase?phase=${GamePhase.MAP_MAKING}`, {
            method: "PUT"
        })
    }

    return (
        <>
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

            <h2>Players:</h2>
            <button onClick={resetPlayers}>Reset Players</button>
            {
                gameState.players.map((player, index) => {
                    return <div key={index}>
                        <p>Colour: {player.colour}</p>
                        <p>Is AI?: {player.ai ? "yes" : "no"}</p>
                    </div>
                })
            }
            <button onClick={movePhases}>Complete Player Setup</button>
        </>
    )
}