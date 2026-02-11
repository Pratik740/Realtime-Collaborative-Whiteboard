const mongoose = require('mongoose');
const path = require('path');
const Room = require('../models/Room');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const verifyDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is undefined. Check .env path.");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const room = await Room.findOne({ roomId: 'default-room' });
        if (room) {
            console.log("\n📄 Room Data:");
            console.log(`- Room ID: ${room.roomId}`);
            console.log(`- Messages Count: ${room.messages ? room.messages.length : 0}`);
            if (room.elements && room.elements.length > 0) {
                console.log(`- Elements Count: ${room.elements.length}`);
                console.log(`- Sample Element: ${JSON.stringify(room.elements[0]).substring(0, 100)}...`);
            } else {
                console.log("- No elements in room yet.");
            }
        } else {
            console.log("❌ Default room not found");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyDB();
