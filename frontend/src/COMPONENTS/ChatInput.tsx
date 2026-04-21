import React, { useState } from "react";

interface Props {
    onSend: (msg: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<Props> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState("");

    const send = () => {
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
    };

    return (
        <div style={{ display: "flex", gap: 10 }}>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
            />
            <button onClick={send} disabled={isLoading}>
                Send
            </button>
        </div>
    );
};

export default ChatInput;