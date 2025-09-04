import React from 'react';
interface ChatWindowProps {
    className?: string;
}
export default function ChatWindow({ className }: ChatWindowProps) {
    return <div className={`${className}`}></div>;
}
