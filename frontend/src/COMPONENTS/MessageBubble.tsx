import React from "react";

interface MessageBubbleProps {
    text: string;
    sender: "user" | "ai";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
    const isUser = sender === "user";

    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"
                } animate-fadeIn mb-2`}
        >
            <div
                className={`max-w-xl px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl ${isUser
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm border border-blue-400/30"
                        : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 rounded-bl-sm border border-gray-600/30"
                    }`}
            >
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
