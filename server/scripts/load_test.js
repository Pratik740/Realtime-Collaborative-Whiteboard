const { io } = require("socket.io-client");

const URL = "http://localhost:8000";
const MAX_CLIENTS = 1;
const EVENTS_PER_SECOND = 100; // Start with > 50 to trigger rate limit

console.log(`🚀 Starting Load Test on ${URL}`);

const socket = io(URL);

socket.on("connect", () => {
    console.log(`✅ Connected with ID: ${socket.id}`);

    let counter = 0;
    const interval = setInterval(() => {
        counter++;
        socket.emit("element-update", {
            id: `test-${counter}`,
            type: "PENCIL",
            points: [{ x: counter, y: counter }],
        });

        if (counter >= EVENTS_PER_SECOND) {
            clearInterval(interval);
            console.log(`⚡ Sent ${counter} events. Waiting for server response...`);
        }
    }, 1000 / EVENTS_PER_SECOND);
});

socket.on("connect_error", (err) => {
    console.log(`❌ Connection Error: ${err.message}`);
});

socket.on("error", (err) => {
    console.log(`⚠️  Server Error (Rate Limit?): ${err}`);
});

socket.on("disconnect", (reason) => {
    console.log(`🔌 Disconnected: ${reason}`);
});
