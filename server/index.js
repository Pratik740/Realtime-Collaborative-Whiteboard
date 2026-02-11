require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const connectDB = require('./config/db');
const Room = require('./models/Room');
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
const authRouter = require("./routes/auth");
app.use(authRouter);

const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const auth = require('./middleware/auth');

const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"],
    }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error"));

        const payload = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod");
        socket.user = await User.findById(payload.id);
        if (!socket.user) return next(new Error("Authentication error"));

        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

// Redis Adapter:
// allows multiple server instances to communicate.
// If User A is on Server 1 and User B is on Server 2,
// Redis passes messages between them so they can still chat/draw.
(async () => {
    try {
        const pubClient = createClient({ url: 'redis://localhost:6379' });
        const subClient = pubClient.duplicate();

        await Promise.all([pubClient.connect(), subClient.connect()]);

        io.adapter(createAdapter(pubClient, subClient));
        console.log("Redis Adapter connected");
    } catch (e) {
        console.error("Redis Adapter failed:", e);
    }
})();

// Rate limit middleware logic remains...
app.get('/', (req, res) => {
    res.send("Server is running with MongoDB integration");
});

// API Routes for creating/joining rooms (Phase 1)
app.post('/api/rooms', auth, async (req, res) => {
    const { roomId } = req.body;
    try {
        let room = await Room.findOne({ roomId });
        if (!room) {
            room = new Room({ roomId, elements: [], messages: [] });
            await room.save();
        }
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

const broadcastRoomCount = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const count = room ? room.size : 0;
    io.to(roomId).emit("client-count", count);
};


const CACHE_KEY_PREFIX = "room_state:";

io.on("connection", async (socket) => {
    console.log("New client connected: ", socket.id);

    // Rate Limiting Middleware (Packet Level):
    // Limits events (drawing/chat) per second.
    socket.use(async ([event, ...args], next) => {
        try {
            const client = io.of("/").adapter.pubClient;
            if (!client) {
                return next();
            }
            const key = `ratelimit:${socket.id}`;

            const current = await client.incr(key);
            if (current === 1) {
                await client.expire(key, 1);
            }

            if (current > 5) {
                // Emit error to client so they know they are throttled
                socket.emit("error", "Rate limit exceeded");
                console.log("Rate Limit")
                return next(new Error("Rate limit exceeded"));
            }
            next();
        } catch (err) {
            console.error("Rate limit error:", err);
            next(err);
        }
    });
    // connectedClients logic removed

    // Dynamic Room Join
    const roomId = socket.handshake.query.roomId;
    if (!roomId) return socket.disconnect();

    socket.join(roomId);
    broadcastRoomCount(roomId);

    // Auto-create room if not exists (Safe because we have User)
    try {
        let room = await Room.findOne({ roomId });
        if (!room) {
            room = new Room({
                roomId,
                owner: socket.user._id,
                elements: [],
                messages: []
            });
            await room.save();
            console.log(`Room ${roomId} created by ${socket.user.username}`);
        }
    } catch (err) {
        console.error("Error creating room:", err);
    }

    // Caching Strategy (Read-Through):
    // 1. Try to get state from Redis (Fast)
    // 2. If missing, get from MongoDB (Slow) and populate Redis.
    try {
        const cacheKey = CACHE_KEY_PREFIX + roomId;
        const client = io.of("/").adapter.pubClient;

        let cachedElements = await client.get(cacheKey);

        if (cachedElements) {
            console.log("Using Cached State from Redis");
            io.to(socket.id).emit("whiteboard-state", JSON.parse(cachedElements));
        } else {
            console.log("Cache Miss - Fetching from DB");
            const room = await Room.findOne({ roomId });
            if (room) {
                io.to(socket.id).emit("whiteboard-state", room.elements || []);
                // Populate Cache
                await client.set(cacheKey, JSON.stringify(room.elements));
            }
        }

        // Chat history (separate cache or just DB for now)
        const room = await Room.findOne({ roomId });
        if (room && room.messages && room.messages.length > 0) {
            const history = room.messages.slice(-100);
            io.to(socket.id).emit("chat-history", history);
        }

    } catch (err) {
        console.error("Error fetching room data:", err);
    }

    socket.on("element-update", async (elementData) => {
        socket.broadcast.to(roomId).emit("element-update", elementData);

        // Write Strategy (Write-Through / Write-Behind):
        // We update the Cache immediately (so next reader gets new data).
        // We optimize DB writes by buffering or checking existence (here simplified).
        try {
            // Update Cache
            const cacheKey = CACHE_KEY_PREFIX + roomId;
            const client = io.of("/").adapter.pubClient;

            // Get current cache state
            let currentElements = await client.get(cacheKey);
            let elements = currentElements ? JSON.parse(currentElements) : [];

            const index = elements.findIndex(el => el.id === elementData.id);
            if (index === -1) {
                elements.push(elementData);
            } else {
                elements[index] = elementData;
            }

            // Update Redis
            await client.set(cacheKey, JSON.stringify(elements));

            // Update MongoDB (Async - Fire and Forget for speed, or await for safety)
            const room = await Room.findOne({ roomId });
            if (room) {
                const dbIndex = room.elements.findIndex(el => el.id === elementData.id);
                if (dbIndex === -1) {
                    room.elements.push(elementData);
                } else {
                    room.elements[dbIndex] = elementData;
                }
                await room.save();
            }
        } catch (err) {
            console.error("Error saving element:", err);
        }
    });

    socket.on("clear-board", async () => {
        socket.broadcast.to(roomId).emit("clear-board");
        try {
            // Clear Cache
            const cacheKey = CACHE_KEY_PREFIX + roomId;
            const client = io.of("/").adapter.pubClient;
            await client.del(cacheKey);

            // Clear DB
            await Room.findOneAndUpdate({ roomId }, { elements: [] });
        } catch (err) {
            console.error("Error clearing board:", err);
        }
    });

    socket.on("chat-message", async (messageData) => {
        socket.broadcast.to(roomId).emit("chat-message", messageData);
        try {
            const room = await Room.findOne({ roomId });
            if (room) {
                room.messages.push(messageData);
                if (room.messages.length > 100) {
                    room.messages.shift();
                }
                await room.save();
            }
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("disconnecting", () => {
        const rooms = socket.rooms;
        rooms.forEach((room) => {
            if (room !== socket.id) {
                // Determine new count (current size - 1 because they haven't left yet)
                const socketRoom = io.sockets.adapter.rooms.get(room);
                const count = socketRoom ? Math.max(0, socketRoom.size - 1) : 0;
                io.to(room).emit("client-count", count);
            }
        });
    });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));