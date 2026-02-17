import type { Board } from "../types";
import Hexagon from "./Hexagon";

interface BoardProps {
    board: Board
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    boardLoaded: boolean
}

export default function BoardRenderer({ board, setBoard, boardLoaded }: BoardProps) {
    if (!boardLoaded) {
        return
    }
    return (
        <svg viewBox="-300 -300 600 600" width={600} height={600}>
            {
                board.tiles.map((tile) => {
                    return <Hexagon q={tile.coord.q} r={tile.coord.r} type={tile.resource} key={tile.id} />
                })
            }
        </svg>
    )
}