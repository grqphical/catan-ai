import type React from "react";
import type { Board, Tile } from "../types";
import Hexagon from "./Hexagon";

interface BoardProps {
    board: Board
    boardLoaded: boolean
    setSelectedTile: React.Dispatch<React.SetStateAction<Tile>>
    selectedTile: Tile
}

export default function BoardRenderer({ board, boardLoaded, selectedTile, setSelectedTile }: BoardProps) {
    if (!boardLoaded) {
        return
    }

    const handleHexClick = (event: React.MouseEvent) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const q = parseInt(target.dataset.q!)
        const r = parseInt(target.dataset.r!)
        const s = -q - r

        const selectedTileObj = board.tiles.find(tile => tile.coord.q === q && tile.coord.r === r && tile.coord.s == s);
        if (selectedTileObj) {
            setSelectedTile(selectedTileObj);
        }
    }

    return (
        <svg viewBox="-250 -250 500 500" width={700} height={700}>
            {
                board.tiles.map((tile) => {
                    const selected = JSON.stringify(selectedTile.coord) === JSON.stringify(tile.coord)
                    return <Hexagon q={tile.coord.q} r={tile.coord.r} type={tile.resource} key={tile.id} selected={selected} handleHexClick={handleHexClick} />
                })
            }
        </svg>
    )
}