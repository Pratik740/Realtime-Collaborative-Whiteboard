import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: [],
    socketId: null,
    username: '',
    sidebarWidth: 350,
    clientCount: 0,
    isChatVisible: true
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setSocketId: (state, action) => {
            state.socketId = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setSidebarWidth: (state, action) => {
            state.sidebarWidth = action.payload;
        },
        setClientCount: (state, action) => {
            state.clientCount = action.payload;
        },
        setChatVisibility: (state, action) => {
            state.isChatVisible = action.payload;
        }
    }
})

export const { addMessage, setSocketId, setMessages, setUsername, setSidebarWidth, setClientCount, setChatVisibility } = chatSlice.actions

export default chatSlice.reducer

