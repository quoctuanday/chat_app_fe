// src/schema/Friendship.ts
import { User } from './User';

export type FriendStatus = 'pending' | 'accepted' | 'blocked';

export interface Friendship {
    user_id: string;
    friend_id: string;
    status: FriendStatus;
    created_at: string;
    updated_at: string;
    user?: User;
    friend?: User;
}
