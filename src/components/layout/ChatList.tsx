'use client';
import { getListConversation } from '@/api';
import Avatar from '@/components/Avatar';
import SearchBar from '@/components/SearchBar';
import { Conversation } from '@/schema/Conversation';
import { useUser } from '@/store/socket';
import React, { useEffect, useState } from 'react';

interface ChatListProps {
    className?: string;
}

export default function Chatlist({ className }: ChatListProps) {
    const { userLoginData } = useUser();
    const [messageType, setMessageType] = useState<'all' | 'unread'>('all');
    const [conversations, setConversations] = useState<Conversation[] | null>(
        null
    );

    useEffect(() => {
        const getConservationList = async () => {
            const response = await getListConversation();
            if (response) {
                const data = response.data.data;
                console.log(data);
                setConversations(data);
            }
        };
        getConservationList();
    }, []);

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
                    onClick={() => setMessageType('unread')}
                >
                    Chưa đọc
                </div>
            </div>

            <SearchBar className="mt-[20px]" />

            <div className="mt-[20px] space-y-2">
                {conversations?.map((conversation, index) => {
                    let displayName = '';
                    let lastMessage = '';
                    let avatarUrl: string | undefined;
                    let status: 'online' | 'offline' | 'busy' | undefined;

                    if (conversation.type === 'private') {
                        const other = conversation.members?.find(
                            (m) => m.user_id !== currentUserId
                        );

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
                            className="h-[60px] flex items-center bg-[var(--gray)] rounded-[10px] px-3 gap-3 cursor-pointer hover:bg-[var(--secondary)] transition-colors"
                            key={index}
                        >
                            <Avatar
                                w={50}
                                h={50}
                                username={displayName}
                                avatarUrl={avatarUrl}
                                status={status}
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {displayName}
                                </span>
                                <span className="text-sm text-gray-500">
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
