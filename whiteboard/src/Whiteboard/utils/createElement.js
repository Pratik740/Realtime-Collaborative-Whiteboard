import rough from 'roughjs'
import { toolTypes } from '../../constants'

const generator = rough.generator()

const generateRectangle = ({x1, y1, x2, y2}) => {
    return generator.rectangle(x1, y1, x2-x1, y2-y1);
}

const generateLine = ({x1, y1, x2, y2}) => {
    return generator.line(x1, y1, x2, y2);
}

const createElement = ({x1, y1, x2, y2, tooltype, id, text=""}) => {
    let roughElement;
    switch(tooltype){
        case toolTypes.RECTANGLE:{
            roughElement = generateRectangle({x1,y1,x2,y2});  
            return {
                id: id,
                roughElement,
                type: tooltype,
                x1, y1 , x2, y2,
            }
        };
        case toolTypes.LINE:{
            roughElement = generateLine({x1,y1,x2,y2});  
            return {
                id: id,
                roughElement,
                type: tooltype,
                x1, y1 , x2 , y2, 
            }
        }
        case toolTypes.PENCIL:
            return {
                id: id,
                type: tooltype,
                points: [ {x: x1, y: y1}]
            }
        case toolTypes.TEXT:
            return {
                id: id,
                type: tooltype,
                x1, y1, x2, y2, text: text
            }
        default:
            throw new Error("Something went wrong when creating element");
    }
}

export default createElement;