import { cursorPositions } from "../../constants"
export const getCursorForPosition = (position) => {
    switch(position){
        case cursorPositions.TOP_LEFT:
        case cursorPositions.BOTTOM_RIGHT:
            return "nwse-resize";
        case cursorPositions.END:
        case cursorPositions.START:
            return "ew-resize";
        case cursorPositions.TOP_RIGHT:
        case cursorPositions.BOTTOM_LEFT:
            return "nesw-resize";
        default:
            return "move"
    }
}