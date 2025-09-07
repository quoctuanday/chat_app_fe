'use client';
import { getConversationDetail } from '@/api';
import React, { useEffect, useRef, useState } from 'react';

interface ChatWindowProps {
    className?: string;
    conversationId: string | null;
}

export default function CameraWindow({
    className,
    conversationId,
}: ChatWindowProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            if (!conversationId) return;
            const response = await getConversationDetail(conversationId);
            if (response) {
                console.log(response.data.data);
            }
        };
        getData();
    }, [conversationId]);

    useEffect(() => {
        // Lấy danh sách camera
        navigator.mediaDevices.enumerateDevices().then((all) => {
            const cams = all.filter((d) => d.kind === 'videoinput');
            setDevices(cams);

            // Ưu tiên chọn cam tích hợp laptop
            const builtIn = cams.find(
                (d) =>
                    d.label.toLowerCase().includes('integrated') ||
                    d.label.toLowerCase().includes('built-in') ||
                    d.label.toLowerCase().includes('wide vision')
            );
            setSelectedDevice(builtIn?.deviceId || cams[0]?.deviceId || null);
        });
    }, []);

    const handleToggleCamera = async () => {
        if (!isCameraOn) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: selectedDevice
                        ? { deviceId: { exact: selectedDevice } }
                        : true,
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setIsCameraOn(true);
            } catch (err) {
                console.error('Không thể bật camera:', err);
            }
        } else {
            // Tắt camera
            if (videoRef.current?.srcObject) {
                const tracks = (
                    videoRef.current.srcObject as MediaStream
                ).getTracks();
                tracks.forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        }
    };

    return (
        <div className={`${className}`}>
            <div className="flex gap-2 items-center mb-3">
                <select
                    value={selectedDevice || ''}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="border rounded p-1"
                >
                    {devices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                            {d.label || 'Camera không tên'}
                        </option>
                    ))}
                </select>

                <button
                    className="border px-4 py-2 bg-amber-200 rounded"
                    onClick={handleToggleCamera}
                >
                    {isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
                </button>
            </div>

            <div className="w-[300px] h-[300px] border border-blue-500 mt-4">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-md"
                />
            </div>
        </div>
    );
}
