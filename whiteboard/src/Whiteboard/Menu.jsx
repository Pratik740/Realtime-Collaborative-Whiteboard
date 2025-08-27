import React from "react";
import IconButton from "./IconButton";
import rectangleIcon from '../resources/icons/Rectangle.svg'
import lineIcon from '../resources/icons/Line.svg'
import eraseIcon from '../resources/icons/rubber.png'
import pencilIcon from '../resources/icons/Pencil.png'
import textIcon from '../resources/icons/text.svg'
import selectIcon from '../resources/icons/select.png'
import {toolTypes} from '../constants/index'




const Menu = () => {
    
    return (
        <div className="menu-container">
            <IconButton src={rectangleIcon} type={toolTypes.RECTANGLE}/>
            <IconButton src={lineIcon} type={toolTypes.LINE}/>
            <IconButton src={eraseIcon} type={toolTypes.ERASER} isRubber/>
            <IconButton src={pencilIcon} type={toolTypes.PENCIL}/>
            <IconButton src={textIcon} type={toolTypes.TEXT}/>
            <IconButton src={selectIcon} type={toolTypes.SELECTION}/>
        </div>
    )
}

export default Menu