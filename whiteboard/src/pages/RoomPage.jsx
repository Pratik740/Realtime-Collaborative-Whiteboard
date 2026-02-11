import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom";
import Whiteboard from "../Whiteboard/Whiteboard"
import Chat from "../Chat/Chat"
import ClientCountIndicator from "../components/ClientCountIndicator"
import ChatToggleButton from "../components/ChatToggleButton"
import { connectWithSocketServer } from "../socketConn/socketConn"
import { setChatVisibility } from "../store/chatSlice"

const CHAT_VISIBILITY_STORAGE_KEY = 'whiteboard_chat_visible';

const RoomPage = () => {
    const dispatch = useDispatch();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const isChatVisible = useSelector(state => state.chat.isChatVisible);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        connectWithSocketServer({ roomId, token });

        try {
            const storedVisibility = window.localStorage.getItem(CHAT_VISIBILITY_STORAGE_KEY);
            if (storedVisibility !== null) {
                dispatch(setChatVisibility(JSON.parse(storedVisibility)));
            }
        } catch (error) {
            console.warn("Unable to read chat visibility preference", error);
        }
    }, [dispatch, roomId, navigate]);

    return (
        <>
            <ClientCountIndicator />
            <ChatToggleButton />
            <Whiteboard />
            {isChatVisible ? <Chat /> : null}
        </>
    )
}

export default RoomPage;
