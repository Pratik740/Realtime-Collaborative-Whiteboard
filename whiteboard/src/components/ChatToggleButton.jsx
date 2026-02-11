import { useDispatch, useSelector } from 'react-redux';
import { setChatVisibility } from '../store/chatSlice';

const CHAT_VISIBILITY_STORAGE_KEY = 'whiteboard_chat_visible';

export default function ChatToggleButton() {
    const dispatch = useDispatch();
    const isChatVisible = useSelector(state => state.chat.isChatVisible);

    const handleToggle = () => {
        const nextValue = !isChatVisible;
        dispatch(setChatVisibility(nextValue));
        try {
            window.localStorage.setItem(CHAT_VISIBILITY_STORAGE_KEY, JSON.stringify(nextValue));
        } catch {
            // ignore storage errors
        }
    };

    return (
        <button
            className="chat-toggle-button"
            type="button"
            onClick={handleToggle}
            aria-pressed={isChatVisible}
        >
            {isChatVisible ? 'Hide chat' : 'Show chat'}
        </button>
    );
}

