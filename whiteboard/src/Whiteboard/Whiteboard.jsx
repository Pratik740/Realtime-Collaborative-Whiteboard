import React, {useRef, useLayoutEffect, useState} from "react";
import { Menu } from './index'
import rough from 'roughjs'
import { useSelector, useDispatch } from 'react-redux'
import { toolTypes, actions, cursorPositions} from '../constants/index'
import { createElement, updateParElement, drawElement, adjustmentRequired, getCursorForPosition, getResizedCoordinates, updatePencilElement} from "./utils/index";
import { v4 as uuid} from 'uuid'
import { updateElements, setElements} from '../store/toolSlice'
import { adjustElementCoordinates } from "./utils/adjustElementCoordinates";
import { emitUpdateElement } from '../socketConn/socketConn'
import { getElementAtPosition } from "./utils/index";



export default function Whiteboard(){
    const dispatch = useDispatch();
    const canvasRef = useRef();
    const textRef = useRef();
    const [action, setAction] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [text, settext] = useState(null);
    const elements = useSelector(state => state.whiteboard.elements);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rc = rough.canvas(canvas);

        elements.forEach(element => {
            drawElement({element, context: ctx, rc});
        });
    }, [elements]);

    const tooltype = useSelector(state => state.whiteboard.tool);
    const handleMouseDown = (e) => {
        if(action === actions.WRITING) return;
        const {clientX, clientY} = e;        
        let element;
        switch (tooltype){
            case toolTypes.RECTANGLE:
            case toolTypes.LINE: 
            case toolTypes.PENCIL:        
                setAction(actions.DRAWING);
                element = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    tooltype,
                    id: uuid()
                });
                setSelectedElement(element);
                dispatch(updateElements(element));
                emitUpdateElement(element);
                break;   
            case toolTypes.TEXT:
                setAction(actions.WRITING)
                element = createElement({
                    x1: clientX,
                    y1: clientY,
                    x2: clientX,
                    y2: clientY,
                    tooltype,
                    id: uuid()
                });
                setSelectedElement(element);
                dispatch(updateElements(element));
                emitUpdateElement(element);
                break;  
            case toolTypes.SELECTION:
                element = getElementAtPosition(clientX, clientY, elements);                
                if( element && 
                    (element.type === toolTypes.RECTANGLE ||
                     element.type === toolTypes.TEXT ||
                     element.type === toolTypes.LINE)
                  ){
                    setAction((element.position === cursorPositions.INSIDE) ? actions.MOVING : actions.RESIZING); 
                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;
                    setSelectedElement({...element, offsetX, offsetY}); 
                }
                if(element && element.type === toolTypes.PENCIL){
                    setAction(actions.MOVING);
                    const xOffsets = element.points.map(point => clientX - point.x);
                    const yOffsets = element.points.map(point => clientY - point.y);
                    setSelectedElement({...element, xOffsets, yOffsets});
                }                         
        }
        
    }

    const handleMouseUp = () => {
        const index = elements.findIndex(el => el.id === selectedElement?.id);
        if(index !== -1){
            if(action === actions.DRAWING || action === actions.RESIZING){
                if(adjustmentRequired(elements[index].type)){
                    const {x1, y1, x2, y2} = adjustElementCoordinates(elements[index]);
                    const elementsCopy = updateParElement({index, x1, y1, x2, y2, tooltype: elements[index].type, id: elements[index].id}, elements);
                    dispatch(setElements(elementsCopy));
                }
            }
        }
        setAction(null);
        setSelectedElement(null);
    }

    const handleMouseMove = (e) => {
        const {clientX, clientY} = e;
        if(action === actions.DRAWING){
            const index = elements.findIndex(el => el.id === selectedElement.id);
            console.log(elements[index]);
            if(index !== -1){
                const elementsCopy = updateParElement({
                    index,
                    x1: elements[index].x1, 
                    y1: elements[index].y1,
                    x2: clientX,
                    y2: clientY,
                    tooltype: elements[index].type,
                    id: elements[index].id
                }, elements);
                dispatch(setElements(elementsCopy));
            }
        }
        if(tooltype === toolTypes.SELECTION){
            const element = getElementAtPosition(clientX, clientY, elements)
            event.target.style.cursor = element ? getCursorForPosition(element.position) : "default";            
        }
        if(tooltype == toolTypes.SELECTION && action === actions.MOVING && selectedElement.type === toolTypes.PENCIL){
            const { id, points, xOffsets, yOffsets} = selectedElement;
            const newPoints = points.map((_, index) => ({
                x: clientX - xOffsets[index],
                y: clientY - yOffsets[index]
            }))
            const index = elements.findIndex(e => e.id === id);
            if(index !== -1){
                const elementsCopy = updatePencilElement({index, newPoints}, elements);                                
                dispatch(setElements(elementsCopy))                
            }
            return;
        }
        if(tooltype === toolTypes.SELECTION && action === actions.MOVING && selectedElement){
            const {id, x1, x2, y1, y2, text, offsetX, offsetY} = selectedElement;
            const width = x2 - x1;
            const height = y2 - y1;
            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;
            const index = elements.findIndex((el) => el.id === selectedElement.id);
            if(index !== -1){
                const elementsCopy = updateParElement({
                    id,
                    x1: newX1,
                    y1: newY1,
                    x2: newX1 + width,
                    text,
                    y2: newY1 + height,
                    tooltype: selectedElement.type,
                    index,
                },
                elements)
                dispatch(setElements(elementsCopy))
            }
        }
        if(tooltype === toolTypes.SELECTION && action === actions.RESIZING && selectedElement){
            const {id, type, position, ...coordinates} = selectedElement;
            const {x1, y1, x2, y2} = getResizedCoordinates(
                clientX,
                clientY,
                position,
                coordinates
            );
            const index = elements.findIndex(el => el.id === selectedElement.id)
            if(index !== -1){
                const elementsCopy = updateParElement({
                    index,
                    x1, y1, x2, y2,
                    tooltype: selectedElement.type,
                    id
                }, elements);
                dispatch(setElements(elementsCopy));
            }
            
        }
    }

    const handleTextAreaBlur = (e) => {
        const {id, x1, y1, type} = selectedElement;
        const index = elements.findIndex(el => el.id === id);
        if(index !== -1){
            const elementsCopy = updateParElement({index, x1, y1, id, tooltype: type, text: e.target.value}, elements);
            dispatch(setElements(elementsCopy)); 
            console.log(elementsCopy) ;
            setAction(null);
            console.log("Blur");
            setSelectedElement(null);
        }
    }

    return(
        <>
            <Menu />
            {action === actions.WRITING ? 
            <textarea 
             ref={textRef}
             onBlur={handleTextAreaBlur}
             onInput={(e) => {
                const ta = e.target;
                ta.style.height = "auto";
                ta.style.width = "auto";
                // Expand to fit content
                ta.style.height = ta.scrollHeight + "px";
                ta.style.width = ta.scrollWidth + "px";
              }}
              onChange={ (e) => {
                const newText = e.target.value
                settext(newText)
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const textWidth = ctx.measureText(newText).width;

                const updatedElement = {
                    ...selectedElement,
                    text: newText,
                    x2: selectedElement.x1 + textWidth,
                    y2: selectedElement.y1 + 24
                };
                
                const index = elements.findIndex(el => el.id === selectedElement.id);
                const elementsCopy = [...elements];
                elementsCopy[index] = updatedElement;
                emitUpdateElement(updatedElement);
              }
              }
             style={{
                position: 'absolute',
                top: selectedElement.y1-3,
                left: selectedElement.x1,
                font: '24px sans-serif',
                margin: 0,
                padding: 0,
                border: 0,
                outline: 0,
                resize: 'none',
                overflow: 'hidden',
                whiteSpace: 'pre',
                background: 'transparent',
             }}
            /> : null}
            
            <canvas
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                height={window.innerHeight}
                width={window.innerWidth}
                id='canvas'
            />
        </>
        
    )  
}