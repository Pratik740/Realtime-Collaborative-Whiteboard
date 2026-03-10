# 🎨 Real-Time Collaborative Whiteboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)
![Stack](https://img.shields.io/badge/stack-MERN-yellow.svg)

A powerful, **real-time collaborative whiteboard** that lets multiple users draw, chat, and ideate together in private rooms. Built for performance and scalability using the **MERN Stack** and **Socket.IO**.

---

## 🚀 Key Features

### 🔐 Security & Access Control
-   **User Authentication**: Secure Signup & Login utilizing **JWT (JSON Web Tokens)** and **BCrypt** for password hashing.
-   **Room Isolation**: Create private rooms with unique IDs. Drawings and chats are strictly isolated to the room you are in.
-   **Session Management**: Smart session handling ensures you stay logged in until you choose to logout.

### 🎨 Advanced Whiteboard Tools
-   **Infinite Drawing**: Draw freely using **Pencil**, **Line**, **Rectangle**, and **Text** tools.
-   **Smart Selection**: Move, resize, and edit shapes with an intuitive selection tool.
-   **RoughJS Integration**: Sketchy, hand-drawn aesthetic for all shapes.
-   **Real-Time Sync**: Every stroke is broadcast instantly to all other users in the room.

### 💬 Real-Time Communication
-   **Live Chat**: Integrated chat sidebar to discuss ideas while drawing.
-   **Dynamic Participant Count**: See exactly how many users are currently active in your room.
-   **Visual Cues**: Immediate feedback when users join or leave.

### ⚡ Performance & Scalability
-   **Redis Adapter**: Powered by Redis to support horizontal scaling across multiple server instances.
-   **Rate Limiting**: Built-in protection against spam and abuse (Token Bucket algorithm).
-   **Optimized Rendering**: Efficient canvas updates using `useLayoutEffect` and dirty-checking to minimize re-renders.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React + Vite** | Blazing fast UI development |
| **State Management** | **Redux Toolkit** | Robust global state for tools, chat, and auth |
| **Graphics** | **RoughJS** | Hand-drawn styling for canvas elements |
| **Backend** | **Node.js + Express** | Scalable REST API and Socket server |
| **Real-Time** | **Socket.IO** | Bidirectional event-based communication |
| **Database** | **MongoDB** | Persistent storage for Users and Room data |
| **Caching/PubSub** | **Redis** | High-performance message broker and caching |

---

## 🌐 Live Demo & Deployment

This project is fully deployed and accessible live!

**Live Demo:** [http://13.201.116.174](http://13.201.116.174)

### Cloud Infrastructure
- **Hosting:** AWS EC2 (Ubuntu Server)
- **Database:** MongoDB Atlas (Cloud Cluster)
- **Web Server:** Nginx Reverse Proxy
- **Process Manager:** PM2

---

## 📦 Local Development Setup

If you wish to run the project locally for development, follow these steps:

### 1. Prerequisites
-   Node.js (v22+)
-   MongoDB (Running locally or via Atlas)
-   Redis (Running locally or via Docker)

### 2. Clone the Repository
```bash
git clone https://github.com/Pratik740/Collaborative-Whiteboard.git
cd Collaborative-Whiteboard
```

### 3. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
REDIS_URL=redis://localhost:6379 # Optional, defaults to this
```

Create a `.env` file in the `whiteboard` directory:
```env
VITE_API_URL=http://localhost:8000
```

### 4. Start the Application
**Terminal 1 (Backend):**
```bash
cd server
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd whiteboard
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser!

---

## 🖼️ Usage Guide

1.  **Sign Up / Login**: Create an account to get started.
2.  **Dashboard**: Click **"Create New Room"** to generate a unique session ID, or paste an ID to **"Join Room"**.
3.  **Collaborate**: Share the URL with friends.
    -   Use the **Toolbar** (top) to switch tools.
    -   Use the **Chat** (right) to send messages.
    -   Chat sidebar can be toggled to maximize drawing space.

---

## 🔮 Future Roadmap
-   [ ] **Undo/Redo**: History stack for mistakes.
-   [ ] **Cursor Presence**: See where others are pointing.
-   [ ] **Export**: Download board as PNG/PDF.
-   [ ] **RBAC**: Creator/Editor/Viewer roles.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR.

## 📄 License
MIT License.
