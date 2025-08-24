'use client';
import { FiMoreVertical } from 'react-icons/fi';

export default function Header() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-mint-dark/20 px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-mint-dark to-lavender-dark rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">💬</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
                        ChatApp
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-mint/50 rounded-full transition-colors">
                        <FiMoreVertical className="w-6 h-6 text-gray-600" />
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full"></div>
                </div>
            </div>
        </header>
    );
}
