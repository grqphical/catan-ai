import { useEffect, useState } from "react";
import BoardComponent from "./Components/Board"
import "./Styles/App.css"
import { type Board, type Hex } from "./types";
import Sidebar from "./Components/Sidebar";

function App() {
    const b: Board = {
        hexes: new Map<string, Hex>,
    }
    const [board, setBoard] = useState(b);
    const [selectedHex, setSelectedHex] = useState(null);

    useEffect(() => {
        const fetchBoard = async () => {
            const response = await fetch('/api/board')
            const responseJSON = await response.json()
            const hexes = responseJSON["hexes"]
            const convertedHexes = Object.entries(hexes).reduce((acc, [key, value]) => {
                const cleanKey = key.replace(/[()]/g, '');
                console.log(cleanKey)
                acc.set(cleanKey, value as Hex);
                return acc;
            }, new Map<string, Hex>())

            setBoard({
                hexes: convertedHexes
            });
        }

        fetchBoard().catch(console.error)
    }, [])

    return (
        <>
            <Sidebar board={board} selected_hex={selectedHex} set_selected_hex={setSelectedHex} set_board={setBoard} />
            <div className="app">
                <div className="board">
                    <BoardComponent board={board} set_selcted_hex={setSelectedHex} selected_hex={selectedHex} />
                </div>
            </div>
        </>
    )
}

export default App
