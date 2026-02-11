import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const username = localStorage.getItem("username") || "User";

    const createRoom = () => {
        const newRoomId = uuidv4();
        navigate(`/room/${newRoomId}`);
    };

    const joinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            navigate(`/room/${roomId}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Hello, {username}!</h2>
                <div style={styles.actions}>
                    <button onClick={createRoom} style={styles.primaryButton}>
                        Create New Room
                    </button>
                    <div style={styles.separator}>OR</div>
                    <form onSubmit={joinRoom} style={styles.joinForm}>
                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            style={styles.input}
                        />
                        <button type="submit" style={styles.secondaryButton}>
                            Join Room
                        </button>
                    </form>
                </div>
                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
    },
    card: {
        width: "400px",
        padding: "2rem",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    actions: {
        margin: "2rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    primaryButton: {
        padding: "1rem",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "1.1rem",
        cursor: "pointer",
    },
    secondaryButton: {
        padding: "0.75rem",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100px", // Fixed width for alignment
    },
    joinForm: {
        display: "flex",
        gap: "0.5rem",
        justifyContent: "center",
    },
    input: {
        padding: "0.75rem",
        border: "1px solid #ddd",
        borderRadius: "4px",
        flexGrow: 1,
    },
    separator: {
        color: "#666",
        fontWeight: "bold",
    },
    logoutButton: {
        marginTop: "1rem",
        padding: "0.5rem 1rem",
        backgroundColor: "transparent",
        color: "#dc3545",
        border: "1px solid #dc3545",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default Dashboard;
