import { toolTypes } from '../../constants/index'
import { getStroke } from 'perfect-freehand'
import getSvgPathFromStroke from './getSvgPathFromStroke';

const drawPencilElement = (context, element) => {
    const myStroke = getStroke(element.points, {
        size: 6,
    });
    const pathData = getSvgPathFromStroke(myStroke)
    const myPath = new Path2D(pathData);
    context.fillStyle = "black";     
    context.fill(myPath);
} 

const drawTextElement = (context, element) => {
    context.textBaseline = "top";
    context.font = '24px sans-serif'

    if(!element.text) return;
    const lines = element.text.split("\n");   // handle multi-line
    const lineHeight = 28; // tweak as needed

    lines.forEach((line, i) => {
        context.fillText(line, element.x1, element.y1 + i*lineHeight);
    });
}

export const drawElement = ({element, context, rc}) => {
    switch(element.type){
        case toolTypes.RECTANGLE:
        case toolTypes.LINE:
            return rc.draw(element.roughElement);
        case toolTypes.PENCIL:
            return drawPencilElement(context, element);
        case toolTypes.TEXT:
            return drawTextElement(context, element);
            break;
        default:
            console.log("Something went wrong while drawing")
    }   

}