import { useEffect, useState } from "react"
import { GamePhase, type GameState } from "./types";
import PlayerSetup from "./Components/PlayerSetup";

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
                <h1>Loading Game State...</h1>
            </div>
        )
    }

    const renderCurrentView = () => {
        switch (gameState.phase) {
            case GamePhase.PLAYER_SETUP:
                return <PlayerSetup gameState={gameState} setGameState={setGameState} />
            case GamePhase.MAP_MAKING:
                return <div>WIP</div>
        }
    }

    return (
        <>
            <h1>Catan AI</h1>
            {
                renderCurrentView()
            }

        </>
    )
}

export default App
