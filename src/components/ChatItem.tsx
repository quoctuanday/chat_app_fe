'use client';

interface ChatItemProps {
    name: string;
    message: string;
    time: string;
    initials: string;
    color: string;
    online?: boolean;
    unread?: number;
}

export default function ChatItem({
    name,
    message,
    time,
    initials,
    color,
    online = false,
    unread = 0,
}: ChatItemProps) {
    return (
        <div className="chat-item bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 cursor-pointer hover:bg-mint/20">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div
                        className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}
                    >
                        <span className="text-white font-semibold">
                            {initials}
                        </span>
                    </div>
                    {online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 truncate">
                            {name}
                        </h3>
                        <span className="text-sm text-gray-500">{time}</span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">{message}</p>
                </div>
                {unread > 0 && (
                    <div className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unread}
                    </div>
                )}
            </div>
        </div>
    );
}
