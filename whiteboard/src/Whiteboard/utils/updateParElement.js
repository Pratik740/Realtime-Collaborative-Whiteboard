import { toolTypes} from '../../constants/index'
import { createElement} from './index'
import { emitUpdateElement } from '../../socketConn/socketConn';  

export const updatePencilElement = ({index, newPoints}, elements) => {    
    const elementsCopy = [...elements]
    elementsCopy[index] = {
        ...elementsCopy[index],
        points: newPoints
    }
    emitUpdateElement(elementsCopy[index])
    return elementsCopy;
}

export const updateParElement = ({index, x1, y1, x2, y2, tooltype, text, id}, elements) => {
    const elementsCopy = [...elements];
    switch (tooltype) {
        case toolTypes.LINE:
        case toolTypes.RECTANGLE:
            const updatedElement = createElement({ x1, y1, x2, y2, tooltype, id});
            elementsCopy[index] = updatedElement;
            emitUpdateElement(updatedElement);
            return elementsCopy;
        case toolTypes.PENCIL:
            console.log("imhere")
            elementsCopy[index] = {
                ...elements[index],
                points: [...elements[index].points, { x: x2, y: y2}]
            }
            emitUpdateElement(elementsCopy[index]);            
            return elementsCopy;
        case toolTypes.TEXT:
            const textWidth = document.getElementById('canvas').getContext("2d").measureText(text).width;
            const textHeight = 24;
            console.log(x1,y1);
            elementsCopy[index] = {
                ...createElement({
                    id,
                    x1,
                    y1,
                    x2: x1+textWidth,
                    y2: y1+textHeight,
                    tooltype: tooltype,
                    text
                })
            } 
            emitUpdateElement(elementsCopy[index])
            return elementsCopy;
        default:
            throw new Error("Something went wrong when updating element")
    }
}

