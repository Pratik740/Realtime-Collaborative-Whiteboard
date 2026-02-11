import { useSelector } from 'react-redux';

export default function ClientCountIndicator() {
    const clientCount = useSelector(state => state.chat.clientCount);

    return (
        <div className="client-count-indicator" aria-live="polite">
            <span className="client-count-label">Live participants</span>
            <span className="client-count-value">{clientCount}</span>
        </div>
    );
}

