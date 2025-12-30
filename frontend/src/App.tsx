import { useEffect, useState } from "react";
import BoardComponent from "./Components/Board"
import "./Styles/App.css"
import { type Board, type Hex, type HexCoordinate } from "./types";

function App() {
    const b: Board = {
        hexes: new Map<HexCoordinate, Hex>,
    }
    const [board, setBoard] = useState(b);
    const [selectedHex, setSelectedHex] = useState(null);

    useEffect(() => {
        const fetchBoard = async () => {
            const response = await fetch('/api/board')
            const responseJSON = await response.json()
            const hexes = responseJSON["hexes"]

            const convertedHexes = Object.entries(hexes).reduce((acc, [key, value]) => {
                key = key.replaceAll('(', '');
                key = key.replaceAll(')', '')
                const [q, r] = key.split(',').map(Number);
                acc.set({ q, r }, value as Hex);
                return acc;
            }, new Map<HexCoordinate, Hex>());

            setBoard({
                hexes: convertedHexes
            });
        }

        fetchBoard().catch(console.error)
    }, [])

    console.log(board.hexes)

    return (
        <>
            <div className="app">
                <h1 className="title">Catan AI</h1>
                <div className="board">
                    <BoardComponent board={board} set_selcted_hex={setSelectedHex} selected_hex={selectedHex} />
                </div>
            </div>
        </>
    )
}

export default App
