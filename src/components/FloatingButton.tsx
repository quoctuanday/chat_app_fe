'use client';
import { FiPlus } from 'react-icons/fi';

export default function FloatingButton() {
    return (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-teal-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <FiPlus className="w-6 h-6" />
        </button>
    );
}
