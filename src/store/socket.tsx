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
    callUser: (to: string, conversationId: string) => void;
    acceptCall: (to: string) => void;
    rejectCall: (to: string) => void;
    sendOffer: (to: string, sdp: RTCSessionDescriptionInit) => void;
    sendAnswer: (to: string, sdp: RTCSessionDescriptionInit) => void;
    sendIceCandidate: (to: string, candidate: RTCIceCandidate) => void;
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

            //Chat events
            socketInstance.on('newMessage', (msg) => {
                console.log('Received message:', msg);
            });

            socketInstance.on('statusChange', ({ userId, status }) => {
                console.log(`User ${userId} status changed: ${status}`);
            });

            // Call events
            socketInstance.on('incomingCall', (data) => {
                console.log('Incoming call:', data);
            });
            socketInstance.on('callAccepted', (data) => {
                console.log('Call accepted:', data);
            });
            socketInstance.on('callRejected', (data) => {
                console.log('Call rejected:', data);
            });
            socketInstance.on('offer', (data) => {
                console.log('Received offer:', data);
            });
            socketInstance.on('answer', (data) => {
                console.log('Received answer:', data);
            });
            socketInstance.on('ice-candidate', (data) => {
                console.log('Received ICE candidate:', data);
            });

            return () => {
                socketInstance.disconnect();
            };
        }
    }, []);

    // === Chat ===
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

    // === Video Call ===
    const callUser = (to: string, conversationId: string) => {
        if (!userLoginData) return;
        socketRef.current?.emit('callUser', {
            to,
            from: userLoginData.user_id,
            conversationId,
        });
    };

    const acceptCall = (to: string) => {
        if (!userLoginData) return;
        socketRef.current?.emit('acceptCall', {
            to,
            from: userLoginData.user_id,
        });
    };

    const rejectCall = (to: string) => {
        if (!userLoginData) return;
        socketRef.current?.emit('rejectCall', {
            to,
            from: userLoginData.user_id,
        });
    };

    const sendOffer = (to: string, sdp: RTCSessionDescriptionInit) => {
        if (!userLoginData) return;
        socketRef.current?.emit('offer', {
            to,
            from: userLoginData.user_id,
            sdp,
        });
    };

    const sendAnswer = (to: string, sdp: RTCSessionDescriptionInit) => {
        if (!userLoginData) return;
        socketRef.current?.emit('answer', {
            to,
            from: userLoginData.user_id,
            sdp,
        });
    };

    const sendIceCandidate = (to: string, candidate: RTCIceCandidate) => {
        if (!userLoginData) return;
        socketRef.current?.emit('ice-candidate', {
            to,
            from: userLoginData.user_id,
            candidate,
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
                callUser,
                acceptCall,
                rejectCall,
                sendOffer,
                sendAnswer,
                sendIceCandidate,
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
