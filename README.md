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

## 📦 Installation & Setup

Follow these steps to run the project locally:

### 1. Prerequisites
-   Node.js (v14+)
-   MongoDB (Running locally or Atlas URI)
-   Redis (Running locally)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 3. Backend Setup
```bash
cd server
# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/whiteboard" > .env
echo "JWT_SECRET=your_super_secret_key" >> .env
echo "PORT=8000" >> .env

# Start the Server
npm start
```

### 4. Frontend Setup
```bash
cd ../whiteboard
# Install dependencies
npm install

# Start the Client
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
