'use client';
import { FiPlus, FiUsers, FiPhone } from 'react-icons/fi';

export default function QuickActions() {
    return (
        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white px-4 py-2 rounded-full whitespace-nowrap hover:from-teal-500 hover:to-teal-600 transition-all">
                <FiPlus />{' '}
                <span className="font-medium">Cuộc trò chuyện mới</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-lavender-dark/30 text-purple-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-lavender/50 transition-all">
                <FiUsers /> <span className="font-medium">Nhóm</span>
            </button>
            <button className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-mint-dark/30 text-teal-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-mint/50 transition-all">
                <FiPhone /> <span className="font-medium">Cuộc gọi</span>
            </button>
        </div>
    );
}
