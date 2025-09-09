'use client';
import React from 'react';

interface CallWaitingProps {
    calleeName: string;
    onCancel: () => void;
}

export default function CallWaiting({
    calleeName,
    onCancel,
}: CallWaitingProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>

            <div className="relative bg-white p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    Đang gọi {calleeName}...
                </h2>
                <p className="text-gray-600 mb-6">
                    Vui lòng chờ đối phương phản hồi
                </p>
                <button
                    onClick={onCancel}
                    className="px-5 py-2 cursor-pointer bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    Hủy cuộc gọi
                </button>
            </div>
        </div>
    );
}
