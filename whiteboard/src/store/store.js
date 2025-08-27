import { configureStore } from "@reduxjs/toolkit";
import whiteboardReducer from './toolSlice'

const store = configureStore({
    reducer: {
        whiteboard: whiteboardReducer,
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