import { useEffect, useState } from "react"
import { GamePhase, type Board, type GameState } from "./types";
import PlayerSetup from "./Views/PlayerSetup";
import MapSetup from "./Views/MapSetup";

function App() {
    const [gameState, setGameState] = useState({} as GameState);

    useEffect(() => {
        fetch("/api/game-state")
            .then((res) => res.json())
            .then((json) => {
                setGameState(json);
            }).catch((err) => console.error(err))
    }, [])

    const [board, setBoard] = useState({} as Board);
    const [boardLoaded, setBoardLoaded] = useState(false);

    useEffect(() => {
        fetch("/api/game-state")
            .then((res) => res.json())
            .then((json) => {
                setGameState(json);
            }).catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        fetch("/api/board")
            .then((res) => res.json())
            .then((json) => {
                setBoard(json);
                setBoardLoaded(true);
            }).catch((err) => console.error(err))
    }, [])

    const renderCurrentView = () => {
        switch (gameState.phase) {
            case GamePhase.PLAYER_SETUP:
                return <PlayerSetup gameState={gameState} setGameState={setGameState} />
            case GamePhase.MAP_MAKING:
                return <MapSetup board={board} setBoard={setBoard} boardLoaded={boardLoaded} gameState={gameState} setGameState={setGameState} />
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
