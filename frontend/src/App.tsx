import { useState } from "react";
import BoardComponent from "./Components/Board"
import "./Styles/App.css"
import { HexType, type Board, type Hex } from "./types";

function generateCatanLayout(): Array<Hex> {
    const hexes: Array<Hex> = [];
    const mapRadius = 2; // Catan is 3 hexes wide from center to edge

    for (let q = -mapRadius; q <= mapRadius; q++) {
        let r1 = Math.max(-mapRadius, -q - mapRadius);
        let r2 = Math.min(mapRadius, -q + mapRadius);
        for (let r = r1; r <= r2; r++) {
            const type: HexType = HexType.Forest
            hexes.push({ q, r, type });
        }
    }
    return hexes;
};

function App() {
    const b: Board = {
        hexes: generateCatanLayout(),
    }
    const [board, setBoard] = useState(b);
    const [selectedHex, setSelectedHex] = useState(null);

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
