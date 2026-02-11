import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setUsername, setSidebarWidth } from '../store/chatSlice';
import { emitChatMessage } from '../socketConn/socketConn';
import './Chat.css';

const USERNAME_STORAGE_KEY = 'whiteboard_chat_username';
const SIDEBAR_WIDTH_STORAGE_KEY = 'whiteboard_chat_width';
const MIN_CHAT_WIDTH = 260;
const MAX_CHAT_WIDTH = 600;

const clampWidth = (value) =>
    Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, value));

export default function Chat() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chat.messages);
    const socketId = useSelector(state => state.chat.socketId);
    const username = useSelector(state => state.chat.username);
    const sidebarWidth = useSelector(state => state.chat.sidebarWidth);
    const [inputMessage, setInputMessage] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [nameError, setNameError] = useState('');
    const [isResizing, setIsResizing] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const storedName = window.localStorage.getItem(USERNAME_STORAGE_KEY);
                if (storedName) {
                    dispatch(setUsername(storedName));
                    setNameInput(storedName);
                }
                const storedWidth = window.localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
                if (storedWidth) {
                    const parsedWidth = parseInt(storedWidth, 10);
                    if (!Number.isNaN(parsedWidth)) {
                        dispatch(setSidebarWidth(clampWidth(parsedWidth)));
                    }
                }
            }
        } catch (error) {
            console.warn('Unable to read chat preferences from storage', error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (event) => {
            const availableWidth = window.innerWidth - event.clientX;
            const newWidth = clampWidth(Math.max(availableWidth, MIN_CHAT_WIDTH));
            dispatch(setSidebarWidth(newWidth));
            try {
                window.localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(newWidth));
            } catch {
                // no-op if storage fails
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isResizing, dispatch]);

    const handleSaveName = (e) => {
        e.preventDefault();
        const trimmedName = nameInput.trim();
        if (!trimmedName) {
            setNameError('Name cannot be empty');
            return;
        }
        dispatch(setUsername(trimmedName));
        setNameError('');
        try {
            window.localStorage.setItem(USERNAME_STORAGE_KEY, trimmedName);
        } catch (error) {
            console.warn('Unable to save username to storage', error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!username) {
            setNameError('Please set your name before chatting');
            return;
        }
        if (inputMessage.trim() === '') return;

        const message = {
            id: Date.now(),
            text: inputMessage.trim(),
            socketId: socketId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            name: username
        };

        dispatch(addMessage(message));
        emitChatMessage(message);
        setInputMessage('');
    };

    const renderSenderLabel = (msg) => {
        if (msg.socketId === socketId) {
            return 'You';
        }
        if (msg.name) {
            return msg.name;
        }
        return `User ${msg.socketId?.slice(0, 6)}`;
    };

    const startResizing = (event) => {
        event.preventDefault();
        setIsResizing(true);
    };

    return (
        <div
            className={`chat-container ${isResizing ? 'is-resizing' : ''}`}
            style={{ width: `${sidebarWidth}px` }}
        >
            <div
                className="chat-resizer"
                onMouseDown={startResizing}
                role="separator"
                aria-label="Resize chat panel"
                aria-orientation="vertical"
            />
            <div className="chat-header">
                <h3>Chat</h3>
                <form className="chat-name-form" onSubmit={handleSaveName}>
                    <input
                        type="text"
                        className="chat-name-input"
                        placeholder="Enter your name"
                        value={nameInput}
                        onChange={(e) => {
                            setNameInput(e.target.value);
                            if (nameError) setNameError('');
                        }}
                    />
                    <button type="submit" className="chat-name-save">
                        Save
                    </button>
                </form>
            </div>
            {nameError ? <div className="chat-name-error">{nameError}</div> : null}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">No messages yet. Start chatting!</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.socketId === socketId ? 'own-message' : ''}`}
                        >
                            <div className="message-header">
                                <span className="message-sender">
                                    {renderSenderLabel(msg)}
                                </span>
                                <span className="message-time">{msg.timestamp}</span>
                            </div>
                            <div className="message-text">{msg.text}</div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder={username ? 'Type a message...' : 'Set your name to start chatting'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={!username}
                />
                <button type="submit" className="chat-send-button" disabled={!username}>
                    Send
                </button>
            </form>
        </div>
    );
}

