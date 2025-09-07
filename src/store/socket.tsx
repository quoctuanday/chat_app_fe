'use client';
import { User } from '@/schema/User';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

interface UserContextProps {
    userLoginData: User | null;
    setUserLoginData: (user: User | null) => void;
    socket: Socket | null;
    joinConversation: (conversationId: string) => void;
    leaveConversation: (conversationId: string) => void;
    sendMessage: (params: {
        conversation_id: string;
        content?: string;
        reply_to_id?: string;
        message_type?: 'text' | 'image' | 'file' | 'system';
    }) => void;
}

// Create context with explicit type
const UserContextObj: React.Context<UserContextProps | undefined> =
    createContext<UserContextProps | undefined>(undefined);

// Define props type for UserProvider
interface UserProviderProps {
    children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
    const [userLoginData, setUserLoginData] = useState<User | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('userLoginData');
        if (storedUser) {
            const user: User = JSON.parse(storedUser);
            setUserLoginData(user);

            const socketInstance = io(
                process.env.NEXT_PUBLIC_WS_URL as string,
                {
                    query: { userId: user.user_id },
                    withCredentials: true,
                }
            );

            socketRef.current = socketInstance;
            setSocket(socketInstance);

            socketInstance.on('connect', () => {
                console.log('Socket connected:', socketInstance.id);
            });

            socketInstance.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            socketInstance.on('newMessage', (msg) => {
                console.log('Received message:', msg);
            });

            socketInstance.on('statusChange', ({ userId, status }) => {
                console.log(`User ${userId} status changed: ${status}`);
            });

            return () => {
                socketInstance.disconnect();
            };
        }
    }, []);

    const joinConversation = (conversationId: string) => {
        socketRef.current?.emit('joinConversation', { conversationId });
    };

    const leaveConversation = (conversationId: string) => {
        socketRef.current?.emit('leaveConversation', { conversationId });
    };

    const sendMessage = (params: {
        conversation_id: string;
        content?: string;
        reply_to_id?: string;
        message_type?: 'text' | 'image' | 'file' | 'system';
    }) => {
        if (!userLoginData) return;
        socketRef.current?.emit('sendMessage', {
            senderId: userLoginData.user_id,
            ...params,
        });
    };

    return (
        <UserContextObj.Provider
            value={{
                userLoginData,
                setUserLoginData,
                socket,
                joinConversation,
                leaveConversation,
                sendMessage,
            }}
        >
            {children}
        </UserContextObj.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContextObj);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
