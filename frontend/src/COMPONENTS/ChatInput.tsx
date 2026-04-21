import React, { useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 bg-gradient-to-t from-slate-900 to-slate-900/80 border-t border-blue-500/20 backdrop-blur-xl">
            <div className="flex gap-3 items-end max-w-5xl mx-auto">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="พิมพ์ข้อความของคุณ... (Shift+Enter for new line)"
                    disabled={isLoading}
                    rows={1}
                    className="flex-1 p-3 px-4 rounded-2xl bg-gray-900/50 text-white placeholder-gray-500 outline-none border border-blue-500/30 focus:border-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-24 font-medium"
                    style={{ overflow: "hidden" }}
                    onInput={(e) => {
                        const target = e.currentTarget;
                        target.style.height = "auto";
                        target.style.height = Math.min(target.scrollHeight, 96) + "px";
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform flex items-center gap-2 ${isLoading || !input.trim()
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-blue-500/50"
                        }`}
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin text-lg">⏳</span>
                            <span className="hidden sm:inline">Sending</span>
                        </>
                    ) : (
                        <>
                            <span>📤</span>
                            <span className="hidden sm:inline">Send</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
    );
};

export default ChatInput;
