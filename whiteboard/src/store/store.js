import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from './toolSlice'
import chatReducer from './chatSlice'

const store = configureStore({
    reducer: {
        whiteboard: whiteboardReducer,
        chat: chatReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck:{
                ignoreActions: ["whiteboard/setElements"],
                ignoredPaths: ["whiteboard.elements"]
           }
        })
})  

export default store