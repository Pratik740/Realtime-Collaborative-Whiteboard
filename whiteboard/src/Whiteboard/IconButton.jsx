import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {setElements, setToolType} from '../store/toolSlice'
import { emitClearBoard } from "../socketConn/socketConn";

const IconButton = ({
    src,
    type,
    isRubber
}) => {
    const dispatch = useDispatch()
    const handler = () => {
        dispatch(setToolType(type));            
    }

    const selectedTool = useSelector(state => state.whiteboard.tool)
    const handleRubber = () => {
        dispatch(setElements([]));
        emitClearBoard();   
    }

    return (
        <button onClick = {isRubber ? handleRubber : handler} className={selectedTool == type? "menu_button_active": "menu_button"}>
            <img  className="menu_button__img" width="80%" height="80%" src={src} />
        </button>
    );
};

export default IconButton;