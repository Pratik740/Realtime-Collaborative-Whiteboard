const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    users: [
        {
            socketId: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            role: {
                type: String,
                enum: ["EDITOR", "VIEWER"],
                default: "VIEWER",
            },
        },
    ],
    isPublic: {
        type: Boolean,
        default: false,
    },
    elements: [
        {
            type: mongoose.Schema.Types.Mixed, // Storing element data as mixed type for flexibility with different element structures
        },
    ],
    messages: [
        {
            text: String,
            socketId: String,
            name: String,
            timestamp: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Room", roomSchema);
