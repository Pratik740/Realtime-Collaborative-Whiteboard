import {io} from 'socket.io-client'
import store from '../store/store'
import { setElements, updateElements } from '../store/toolSlice';

let socket;

export const connectWithSocketServer = () => {
    socket = io("http://localhost:8000");
    socket.on('connect', () => {
        console.log("connected to socket.io server");
    });

    socket.on("whiteboard-state",(elements) => {
        store.dispatch(setElements(elements));
    })

    socket.on("element-update", (elementData) => {
        store.dispatch(updateElements(elementData));        
    })

    socket.on("clear-board",() => {
        store.dispatch(setElements([]));        
    })
}

export const emitUpdateElement = (elementData) => {
    socket.emit("element-update", elementData);
}
export const emitClearBoard = () => {
    socket.emit("clear-board");
}

