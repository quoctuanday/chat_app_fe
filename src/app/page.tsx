import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import QuickActions from '@/components/QuickAction';
import ChatList from '@/components/ChatList';
import FloatingButton from '@/components/FloatingButton';

export default function HomePage() {
    return (
        <div className="bg-gradient-to-br from-mint-light via-white to-lavender-light min-h-screen">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-6">
                <SearchBar />
                <QuickActions />
                <ChatList />
                <FloatingButton />
            </main>
        </div>
    );
}
