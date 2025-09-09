'use client';
import React from 'react';
import { MdCall, MdCallEnd } from 'react-icons/md';
import Avatar from '@/components/Avatar';

interface IncomingCallModalProps {
    callerName: string;
    avatar_url: string | null;
    onAccept: () => void;
    onDecline: () => void;
}

export default function IncomingCallModal({
    callerName,
    avatar_url,
    onAccept,
    onDecline,
}: IncomingCallModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="flex justify-center mb-4">
                    <Avatar
                        username={callerName}
                        avatarUrl={avatar_url}
                        w={80}
                        h={80}
                    />
                </div>
                <h2 className="text-xl font-semibold mb-4">
                    {callerName} đang gọi cho bạn
                </h2>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onAccept}
                        className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center"
                    >
                        <MdCall size={24} />
                    </button>
                    <button
                        onClick={onDecline}
                        className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
                    >
                        <MdCallEnd size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
