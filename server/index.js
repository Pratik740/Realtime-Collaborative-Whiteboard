const express = require('express')
const app = express()
const http = require('http')
const { Server} = require('socket.io')
const cors = require("cors")

const server = http.createServer(app)

app.use(cors())

const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"],
    }
})

let elements = []

app.get('/',(req,res)=>{
    res.send("Hello server is working");
});

io.on("connection", (socket) => {
    console.log("New client connected: ",socket.id)
    io.to(socket.id).emit("whiteboard-state", elements);

    socket.on("element-update", (elementData) => {
        //console.log(socket.id,elements)
        updateElementInElements(elementData);
        socket.broadcast.emit("element-update",elementData);
    })

    
    socket.on("clear-board",() => {
        socket.broadcast.emit("clear-board");   
    })

    socket.on("disconnect",() => {
        console.log("user disconnected")
    })
})

const updateElementInElements = (elementData) => {
    const index = elements.findIndex(el => el.id === elementData.id);
    if(index === -1) elements.push(elementData);
    else elements[index] = elementData;
}

setInterval(() => console.log(elements),10000);


const PORT = 8000

server.listen(PORT, () => console.log("Server is running"))