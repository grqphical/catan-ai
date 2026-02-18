import React, { useEffect, useState } from "react"
import BoardRenderer from "../Components/BoardRenderer"
import { HexType, type Board, type GameState, type Tile } from "../types"

interface MapSetupProps {
    board: Board
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    boardLoaded: boolean
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

export default function MapSetup({ board, setBoard, boardLoaded, gameState, setGameState }: MapSetupProps) {
    const [selectedTile, setSelectedTile] = useState({} as Tile)

    const [validBoard, setValidBoard] = useState(false);

    useEffect(() => {
        fetch("/api/validate-board")
            .then((res) => res.json())
            .then((json) => {
                setValidBoard(json.valid);
            }).catch((err) => console.error(err))
    }, [selectedTile])

    const handleTileTypeChange = (event: React.ChangeEvent) => {
        event.preventDefault();
        const target = event.target as HTMLSelectElement
        const newResource = target.value
        setSelectedTile({ ...selectedTile, resource: newResource as HexType })
        const updatedBoard = board.tiles.map(tile =>
            tile.coord.q === selectedTile.coord.q &&
                tile.coord.r === selectedTile.coord.r &&
                tile.coord.s === selectedTile.coord.s
                ? { ...tile, resource: newResource as HexType }
                : tile
        )
        setBoard({
            ...board,
            tiles: updatedBoard
        })

        fetch(`/api/set-tile-type?q=${selectedTile.coord.q}&r=${selectedTile.coord.r}&s=${selectedTile.coord.s}&type=${newResource}`, {
            method: "PUT"
        })
    }

    return (
        <>
            <BoardRenderer board={board} boardLoaded={boardLoaded} setSelectedTile={setSelectedTile} selectedTile={selectedTile} />
            <p>Is valid board? {validBoard ? "yes" : "no"}</p>
            <div>
                <h2>Current Selected Tile: {selectedTile.coord !== undefined ? `(${selectedTile.coord.q}, ${selectedTile.coord.r}, ${selectedTile.coord.s})` : "None"}</h2>
                <select name="tileType" id="tileType" value={selectedTile.resource} onChange={handleTileTypeChange}>
                    {
                        Object.values(HexType).map((type) => {
                            return <option value={type} key={type}>{type}</option>
                        })
                    }
                </select>
            </div>
        </>
    )
}