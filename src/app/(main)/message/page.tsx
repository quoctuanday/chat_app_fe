import ChatList from '@/components/layout/ChatList';
import ChatWindow from '@/components/layout/ChatWindow';
import Sidebar from '@/components/layout/Sidebar';

export default function MessagePage() {
    return (
        <div className="grid grid-cols-[300px_1fr] min-h-screen bg-[var(--background)]">
            <ChatList className="border-2 border-[var(--secondary)]" />
            <ChatWindow />
        </div>
    );
}
