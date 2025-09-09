// hooks/useWebRTC.ts
'use client';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/store/socket';

export function useWebRTC() {
    const { socket, sendOffer, sendAnswer, sendIceCandidate } = useUser();
    const pcRef = useRef<RTCPeerConnection | null>(null);

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const createPeerConnection = (targetUserId: string) => {
        if (pcRef.current) return pcRef.current;
        const pc = new RTCPeerConnection();

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendIceCandidate(targetUserId, event.candidate);
            }
        };

        pcRef.current = pc;
        return pc;
    };

    const startCall = async (targetUserId: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);

        const pc = createPeerConnection(targetUserId);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendOffer(targetUserId, offer);
    };

    const handleOffer = async (
        from: string,
        sdp: RTCSessionDescriptionInit
    ) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);

        const pc = createPeerConnection(from);
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        sendAnswer(from, answer);
    };

    const handleAnswer = async (sdp: RTCSessionDescriptionInit) => {
        await pcRef.current?.setRemoteDescription(
            new RTCSessionDescription(sdp)
        );
    };

    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
        try {
            await pcRef.current?.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        } catch (err) {
            console.error('Error adding ice candidate', err);
        }
    };

    const endCall = () => {
        pcRef.current?.close();
        pcRef.current = null;
        localStream?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
        setRemoteStream(null);
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('offer', ({ from, sdp }) => handleOffer(from, sdp));
        socket.on('answer', ({ sdp }) => handleAnswer(sdp));
        socket.on('ice-candidate', ({ candidate }) =>
            handleIceCandidate(candidate)
        );

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    }, [socket]);

    return { localStream, remoteStream, startCall, endCall };
}
