'use client';
import { getListConversation, getListConversationByQuery } from '@/api';
import Avatar from '@/components/Avatar';
import SearchBar from '@/components/SearchBar';
import { convertTime } from '@/helper/convertTime';
import { Conversation } from '@/schema/Conversation';
import { useUser } from '@/store/socket';
import React, { SetStateAction, useEffect, useState } from 'react';

interface ChatListProps {
    className?: string;
    setSelectedConversation: React.Dispatch<
        React.SetStateAction<string | null>
    >;
}

export default function Chatlist({
    className,
    setSelectedConversation,
}: ChatListProps) {
    const { userLoginData, socket } = useUser();
    const [messageType, setMessageType] = useState<'all' | 'group'>('all');
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null
    );

    useEffect(() => {
        const getConservationList = async () => {
            try {
                let response;
                if (messageType === 'all') {
                    response = await getListConversation();
                } else {
                    response = await getListConversationByQuery({
                        type: messageType,
                    });
                }

                if (response) {
                    const data = response.data.data;
                    console.log(data);
                    data.sort((a: Conversation, b: Conversation) => {
                        const timeA = new Date(
                            a.lastMessage?.created_at || 0
                        ).getTime();
                        const timeB = new Date(
                            b.lastMessage?.created_at || 0
                        ).getTime();
                        return timeB - timeA;
                    });
                    setConversations(data);
                    if (data.length > 0) {
                        setSelectedConversation(data[0].conversation_id);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        getConservationList();
    }, [messageType]);

    useEffect(() => {
        if (!socket || !conversations) return;
        conversations.forEach((conv) => {
            socket.emit('joinConversation', {
                conversationId: conv.conversation_id,
            });
        });

        const handleNewMessage = (msg: any) => {
            setConversations((prev) => {
                if (!prev) return prev;

                const updated = prev.map((conv) =>
                    conv.conversation_id === msg.conversation_id
                        ? { ...conv, lastMessage: msg }
                        : conv
                );

                const exists = updated.some(
                    (conv) => conv.conversation_id === msg.conversation_id
                );
                if (!exists) {
                    updated.unshift({
                        conversation_id: msg.conversation_id,
                        type: 'private',
                        members: [],
                        lastMessage: msg,
                        name: 'Unknown',
                        unreadCount: 1,
                        initials: '',
                    } as Conversation);
                }

                updated.sort((a, b) => {
                    const timeA = new Date(
                        a.lastMessage?.created_at || 0
                    ).getTime();
                    const timeB = new Date(
                        b.lastMessage?.created_at || 0
                    ).getTime();
                    return timeB - timeA;
                });

                return updated;
            });
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, conversations]);

    const currentUserId = userLoginData?.user_id;

    return (
        <div className={`${className} p-[10px]`}>
            <h1 className="font-bold text-[25px]">Đoạn chat</h1>

            <div className="relative flex items-center bg-[var(--gray)] mt-[10px] rounded-[10px] p-[2px] overflow-hidden">
                <div
                    className={`absolute top-[2px] bottom-[2px] w-1/2 rounded-[10px] bg-[var(--primary)] transition-transform duration-300`}
                    style={{
                        transform:
                            messageType === 'all'
                                ? 'translateX(0%)'
                                : 'translateX(100%)',
                    }}
                ></div>

                <div
                    className="w-1/2 text-center py-1 rounded-[10px] cursor-pointer relative z-10 select-none"
                    onClick={() => setMessageType('all')}
                >
                    Tất cả
                </div>
                <div
                    className="w-1/2 text-center py-1 rounded-[10px] cursor-pointer relative z-10 select-none"
                    onClick={() => setMessageType('group')}
                >
                    Nhóm
                </div>
            </div>

            <SearchBar className="mt-[20px]" />

            <div className="mt-[20px]">
                {conversations?.map((conversation, index) => {
                    let displayName = '';
                    let lastMessage = '';
                    let avatarUrl: string | undefined;
                    let status: 'online' | 'offline' | 'busy' | undefined;
                    const lastTime = convertTime(
                        conversation.lastMessage?.created_at || ''
                    );

                    if (conversation.type === 'private') {
                        const other = conversation.members?.find(
                            (m) => m.user_id !== currentUserId
                        );
                        lastMessage = conversation.lastMessage?.content || '';
                        displayName = other?.username || 'Unknown';
                        avatarUrl = other?.avatar_url || undefined;
                        status = undefined;
                    } else {
                        lastMessage = conversation.lastMessage?.content || '';
                        displayName = conversation.name || 'Nhóm';
                        avatarUrl = conversation.avatar_url || undefined;
                        status = undefined;
                    }

                    return (
                        <div
                            className="h-[60px] flex items-center  rounded-[10px] px-3 gap-3 cursor-pointer hover:bg-[var(--secondary)] transition-colors"
                            key={index}
                            onClick={() =>
                                setSelectedConversation(
                                    conversation.conversation_id
                                )
                            }
                        >
                            <Avatar
                                w={50}
                                h={50}
                                username={displayName}
                                avatarUrl={avatarUrl}
                                status={status}
                                classname="flex-shrink-0"
                            />
                            <div className="flex flex-col w-full">
                                <div className="flex items-center justify-between ">
                                    <span className="font-semibold">
                                        {displayName}
                                    </span>
                                    <span className="text-gray-500 text-[10px]">
                                        {lastTime}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 line-clamp-1">
                                    {lastMessage}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
