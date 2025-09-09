'use client';
import React, { useEffect, useRef } from 'react';

interface VideoCallModalProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    onEndCall: () => void;
}

export default function VideoCallModal({
    localStream,
    remoteStream,
    onEndCall,
}: VideoCallModalProps) {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Remote video */}
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-lg"
                />

                {/* Local video */}
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute bottom-6 right-6 w-40 h-28 object-cover border-2 border-white rounded-lg shadow-lg"
                />

                {/* End call button */}
                <button
                    onClick={onEndCall}
                    className="absolute top-6 right-6 px-4 py-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700"
                >
                    🔴 Kết thúc
                </button>
            </div>
        </div>
    );
}
