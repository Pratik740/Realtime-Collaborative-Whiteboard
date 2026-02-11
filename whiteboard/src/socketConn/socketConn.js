import { io } from 'socket.io-client'
import store from '../store/store'
import { setElements, updateElements } from '../store/toolSlice';
import { addMessage, setSocketId, setMessages, setClientCount } from '../store/chatSlice';

let socket;

export const connectWithSocketServer = (userDetails) => {
    const { token, roomId } = userDetails;
    socket = io("http://localhost:8000", {
        auth: {
            token,
        },
        query: {
            roomId,
        },
    });
    socket.on('connect', () => {
        console.log("connected to socket.io server");
        store.dispatch(setSocketId(socket.id));
    });

    socket.on("whiteboard-state", (elements) => {
        store.dispatch(setElements(elements));
    })

    socket.on("element-update", (elementData) => {
        store.dispatch(updateElements(elementData));
    })

    socket.on("clear-board", () => {
        store.dispatch(setElements([]));
    })

    socket.on("chat-message", (messageData) => {
        store.dispatch(addMessage(messageData));
    })

    socket.on("chat-history", (messages) => {
        store.dispatch(setMessages(messages));
    })

    socket.on("client-count", (count) => {
        store.dispatch(setClientCount(count));
    })
}

export const emitUpdateElement = (elementData) => {
    socket.emit("element-update", elementData);
}

export const emitClearBoard = () => {
    socket.emit("clear-board");
}

export const emitChatMessage = (messageData) => {
    socket.emit("chat-message", messageData);
}

