'use client';
import { getConversationDetail, getMessageList } from '@/api';
import Avatar from '@/components/Avatar';
import { getInitials } from '@/helper/getInitials';
import { Conversation } from '@/schema/Conversation';
import { Message } from '@/schema/Message';
import { useUser } from '@/store/socket';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { IoVideocam } from 'react-icons/io5';
import CallWaiting from '@/components/CallWaiting';
import IncomingCallModal from '@/components/IncomingCallModal';
import VideoCallModal from '@/components/VideoCallModal';
import { useWebRTC } from '@/hooks/useWebRTC';

interface ChatWindowProps {
    className?: string;
    conversationId: string | null;
}

export default function ChatWindow({
    className,
    conversationId,
}: ChatWindowProps) {
    const {
        userLoginData,
        callUser,
        acceptCall,
        rejectCall,
        socket,
        sendMessage,
    } = useUser();
    const [conversationDetail, setConversationDetail] =
        useState<Conversation | null>(null);
    const [messages, setMessage] = useState<Message[] | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
        null
    );
    const [replyId, setReplyId] = useState<string | null>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);

    //Call event states
    const { localStream, remoteStream, startCall, endCall } = useWebRTC();

    const [showWaiting, setShowWaiting] = useState(false);
    const [incomingCall, setIncomingCall] = useState<{
        from: string;
        conversationId: string;
        username: string;
        avatarUrl: string | null;
    } | null>(null);

    const [inCall, setInCall] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    //fetch data
    useEffect(() => {
        const getData = async () => {
            if (!conversationId) return;
            const conversationDetail = await getConversationDetail(
                conversationId
            );
            const messageList = await getMessageList(conversationId);
            if (conversationDetail && messageList) {
                const conversationData = conversationDetail.data.data;
                const messages = messageList.data.data;
                setConversationDetail(conversationData);
                setMessage(messages);
            }
        };
        getData();
    }, [conversationId]);

    //socket new message
    useEffect(() => {
        if (!conversationId || !socket) return;

        socket.emit('joinConversation', { conversationId });

        const handleNewMessage = (msg: Message) => {
            if (msg.conversation_id === conversationId) {
                setMessage((prev) => (prev ? [...prev, msg] : [msg]));
            }
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.emit('leaveConversation', { conversationId });
            socket.off('newMessage', handleNewMessage);
        };
    }, [conversationId, socket]);

    //senddMessage
    const handleSendMessage = async () => {
        if (!messageInputRef.current || !conversationId) {
            return null;
        }
        sendMessage({
            conversation_id: conversationId,
            content: messageInputRef.current.value,
            reply_to_id: replyId ?? undefined,
            message_type: 'text',
        });
        messageInputRef.current.value = '';
    };

    //call event tracking
    useEffect(() => {
        if (!socket) return;

        socket.on('incomingCall', (data) => setIncomingCall(data));

        socket.on('callAccepted', ({ from }) => {
            setShowWaiting(false);
            setInCall(true);
            startCall(from);
        });

        socket.on('callRejected', () => {
            setShowWaiting(false);
            alert('📵 Đối phương đã từ chối cuộc gọi!');
        });

        return () => {
            socket.off('incomingCall');
            socket.off('callAccepted');
            socket.off('callRejected');
        };
    }, [socket]);

    const handleVideoCall = () => {
        const other = conversationDetail?.members?.find(
            (m) => m.user_id !== userLoginData?.user_id
        );
        if (!other) return;

        callUser(other.user_id, conversationDetail!.conversation_id);
        setShowWaiting(true);
    };

    //initial constant
    if (!conversationDetail) {
        return;
    }
    let displayName = '';
    let avatarUrl: string | null = null;
    let status: 'online' | 'offline' | 'busy' | undefined;

    if (conversationDetail.type === 'private') {
        const other = conversationDetail.members?.find(
            (m) => m.user_id !== userLoginData?.user_id
        );
        displayName = other?.username || 'Unknown';
        avatarUrl = other?.avatar_url || null;
        status = undefined;
    } else {
        displayName = conversationDetail.name || 'Nhóm';
        avatarUrl = (conversationDetail as any).avatar_url || null;
        status = undefined;
    }

    return (
        <div className={`${className} h-[100vh] overflow-hidden flex flex-col`}>
            <div className="flex px-[2rem] items-center justify-between border-b-[2px] border-[var(--secondary)] h-[5rem] w-full">
                <div className="flex items-center">
                    <Avatar
                        username={displayName}
                        avatarUrl={avatarUrl}
                        h={50}
                        w={50}
                    />
                    <span className="ml-2 font-semibold text-[20px]">
                        {displayName}
                    </span>
                </div>
                <div className="flex items-center">
                    <i className="text-[1.25rem] text-[var(--primary)] cursor-pointer p-2 rounded-full hover:bg-[#f0f0f0]">
                        <FaPhoneAlt />
                    </i>
                    <i
                        onClick={handleVideoCall}
                        className="text-[1.25rem] ml-2 text-[var(--primary)] cursor-pointer p-2 rounded-full hover:bg-[#f0f0f0]"
                    >
                        <IoVideocam />
                    </i>
                    <i className="text-[1.25rem] ml-2 text-[var(--primary)] cursor-pointer p-2 rounded-full hover:bg-[#f0f0f0]">
                        <FaInfoCircle />
                    </i>
                </div>
            </div>
            {showWaiting && (
                <CallWaiting
                    calleeName={displayName}
                    onCancel={() => {
                        setShowWaiting(false);
                        endCall();
                    }}
                />
            )}

            {incomingCall && (
                <IncomingCallModal
                    callerName={incomingCall.username}
                    avatar_url={incomingCall.avatarUrl}
                    onAccept={() => {
                        acceptCall(incomingCall.from);
                        setIncomingCall(null);
                        setInCall(true);
                    }}
                    onDecline={() => {
                        rejectCall(incomingCall.from);
                        setIncomingCall(null);
                    }}
                />
            )}

            {inCall && (
                <VideoCallModal
                    localStream={localStream}
                    remoteStream={remoteStream}
                    onEndCall={() => {
                        endCall();
                        setInCall(false);
                    }}
                />
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages?.map((msg, idx) => {
                    const isOwn = msg.sender_id === userLoginData?.user_id;
                    const showAvatar =
                        idx === messages.length - 1 ||
                        messages[idx + 1]?.sender_id !== msg.sender_id;

                    const isSelected = selectedMessageId === msg.message_id;

                    return (
                        <div key={msg.message_id} className="flex flex-col">
                            <div
                                className={`flex ${
                                    isOwn ? 'justify-end' : 'justify-start'
                                } items-end`}
                                onClick={() =>
                                    setSelectedMessageId(
                                        isSelected ? null : msg.message_id
                                    )
                                }
                            >
                                {!isOwn && (
                                    <div className="w-8 flex justify-center mr-2">
                                        {showAvatar ? (
                                            <Avatar
                                                username={
                                                    msg.sender?.username ||
                                                    'Unknown'
                                                }
                                                avatarUrl={
                                                    msg.sender?.avatar_url ||
                                                    null
                                                }
                                                h={32}
                                                w={32}
                                            />
                                        ) : (
                                            <div className="w-8 h-8" />
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`px-4 py-2 rounded-lg max-w-[60%] cursor-pointer ${
                                        isOwn
                                            ? 'bg-[var(--primary)] text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>

                            {isSelected && (
                                <span
                                    className={`text-xs text-gray-500 mt-1 ${
                                        isOwn
                                            ? 'text-right '
                                            : 'text-left pl-10'
                                    }`}
                                >
                                    {new Date(msg.created_at).toLocaleString()}
                                </span>
                            )}
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            <div className=" h-[4rem] border-t-[2px] border-[var(--secondary)] flex items-center px-4">
                <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Aa"
                    className="w-full bg-[var(--secondary)] rounded-lg px-3 py-1 focus:outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    className="text-[var(--primary)] text-[1.25rem] ml-2 cursor-pointer p-2 rounded-full hover:bg-[#f0f0f0]"
                >
                    <IoIosSend />
                </button>
            </div>
        </div>
    );
}
