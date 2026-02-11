const mongoose = require("mongoose");

const elementSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    elementId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["RECTANGLE", "LINE", "PENCIL", "TEXT", "ERASER", "SELECTION"],
        required: true,
    },
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    points: [
        {
            x: Number,
            y: Number,
        },
    ],
    text: String,
    stroke: String,
    roughElement: mongoose.Schema.Types.Mixed,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("WhiteboardElement", elementSchema);
