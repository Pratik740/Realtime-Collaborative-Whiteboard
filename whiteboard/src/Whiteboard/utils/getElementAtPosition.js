import { toolTypes } from "../../constants"
import { cursorPositions } from "../../constants"

const distance = (a,b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

const onLine = (x, y, x1, y1, x2, y2) => {
    const maxDistance = 1;
    const a = {x: x1, y: y1}
    const b = {x: x2, y: y2}
    const c = {x, y}
    const offset = distance(a,b) - (distance(a,c) + distance(b,c));
    return (Math.abs(offset) < maxDistance) ? cursorPositions.INSIDE : false;
}

const nearPoint = (x, y, x1, y1, cursorPosition) => {
    return (Math.abs(x-x1) < 10 && Math.abs(y-y1) < 10) ? cursorPosition : false
}
const positionWithinElement = (x, y, element) => {
    const {type, x1, y1, x2, y2} = element

    switch(type){
        case toolTypes.RECTANGLE:
            const topLeft = nearPoint(x,y,x1,y1,cursorPositions.TOP_LEFT);
            const topRight = nearPoint(x,y,x2,y1,cursorPositions.TOP_RIGHT);
            const bottomLeft = nearPoint(x,y,x1,y2,cursorPositions.BOTTOM_LEFT);
            const bottomRight = nearPoint(x,y,x2,y2,cursorPositions.BOTTOM_RIGHT);
            const inside = (x >= x1 && x <= x2 && y >= y1 && y <= y2) ? cursorPositions.INSIDE : false;
            return topLeft || topRight || bottomLeft || bottomRight || inside
        case toolTypes.TEXT:
            return (x >= x1 && x <= x2 && y >= y1 && y <= y2) ? cursorPositions.INSIDE : false;
        case toolTypes.LINE:
            const on = onLine(x,y,element.x1,element.y1,element.x2,element.y2);
            const start = nearPoint(x,y,x1,y1,cursorPositions.START);
            const end = nearPoint(x,y,x2,y2,cursorPositions.END);
            return start || end || on;
    }
}


export const getElementAtPosition = (x, y, elements) => {
    return elements.map(e => ({
        ...e,
        position: positionWithinElement(x, y, e)
    })).find(e => e.position !== false)
}