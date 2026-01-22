import type { ChangeEvent } from "react"
import "../Styles/Sidebar.css"
import { HexType, type Board, type HexCoordinate } from "../types"

interface SidebarProps {
    board: Board
    set_board: Function,
    selected_hex: HexCoordinate | null
    set_selected_hex: Function
}

function formatSelectedTileString(tile: HexCoordinate): string {
    return `(${tile.q}, ${tile.r})`

}

function validateBoard(board: Board): boolean {
    let clayPitCount = 0;
    let pastureCount = 0;
    let quarryCount = 0;
    let farmCount = 0;
    let forestCount = 0;
    let desertCount = 0;

    for (const hex of board.hexes.values()) {
        switch (hex.type) {
            case HexType.Forest:
                forestCount++;
                break;
            case HexType.Pasture:
                pastureCount++;
                break;
            case HexType.Quarry:
                quarryCount++;
                break;
            case HexType.Claypit: 
                clayPitCount++;
                break;
            case HexType.Farm:
                farmCount++;
                break;
            case HexType.Desert:
                desertCount++;
                break;
            default:
                break;
        }
    }

    if (clayPitCount != 3 || pastureCount != 4 || quarryCount != 3 || farmCount != 4 || forestCount != 4 || desertCount != 1) {
        return false;
    }  else {
        return true;
    }
}

function SetTileForm(props: SidebarProps) {
    if (props.selected_hex === null) {
        return <h3>No Tile Selected</h3>
    }
    const hexCoord = props.selected_hex;
    const key = `${hexCoord.q}, ${hexCoord.r}`;
    const currentTile = props.board?.hexes.get(key);

    const changeTileType = async (e: ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;

        try {
            await fetch("/api/set-type?" + new URLSearchParams({
                q: hexCoord.q.toString(),
                r: hexCoord.r.toString(),
                type: newType
            }).toString(), {
                method: "PUT",
            });

            if (props.board) {
                const newHexes = new Map(props.board.hexes);

                const hexData = newHexes.get(key);
                if (hexData) {
                    newHexes.set(key, { ...hexData, type: parseInt(newType) });
                }

                props.set_board({
                    ...props.board,
                    hexes: newHexes
                });
            }

            props.set_selected_hex(null);

        } catch (err) {
            console.error("Failed to update tile type:", err);
        }

        console.log("Looking for key:", key);
        console.log("Current Map keys:", Array.from(props.board.hexes.keys()));
        console.log("Hex Data found:", props.board.hexes.get(key));
    }

    return (
        <>
            <h3>Selected Tile: {formatSelectedTileString(props.selected_hex)}</h3>
            <form>
                <label htmlFor="type">Tile Type:</label>
                { }
                <select
                    name="type"
                    id="type"
                    onChange={changeTileType}
                    value={currentTile?.type ?? ""}
                >
                    <option value="" disabled>Select a type</option>
                    <option value="0">Woods</option>
                    <option value="1">Pasture</option>
                    <option value="2">Quarry</option>
                    <option value="3">Claypit</option>
                    <option value="4">Farm</option>
                    <option value="5">Desert</option>
                </select>
            </form>
        </>
    )
}

export default function Sidebar(props: SidebarProps) {
    const validBoard = validateBoard(props.board);
    return (
        <div className="sidebar">
            <h1>Catan AI</h1>
            <SetTileForm selected_hex={props.selected_hex} board={props.board} set_selected_hex={props.set_selected_hex} set_board={props.set_board} />
            <h3 className={validBoard ? "no-warning" : "warning"}>{validBoard ? "Valid Board" : "Invalid Board" }</h3>
        </div>
    )
}