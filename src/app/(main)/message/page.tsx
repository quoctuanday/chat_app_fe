'use client';
import ChatList from '@/components/layout/ChatList';
import ChatWindow from '@/components/layout/ChatWindow';
import { useState } from 'react';

export default function MessagePage() {
    const [selectedConversationId, setSelectedConversationId] = useState<
        string | null
    >(null);
    return (
        <div className="grid grid-cols-[300px_1fr] min-h-screen bg-[var(--background)]">
            <ChatList
                setSelectedConversation={setSelectedConversationId}
                className="border-2 border-[var(--secondary)]"
            />
            <ChatWindow conversationId={selectedConversationId} />
        </div>
    );
}
