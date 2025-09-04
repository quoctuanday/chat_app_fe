export type UserStatus = 'online' | 'offline' | 'busy';

export interface User {
    user_id: string;
    username: string;
    email?: string;
    password?: string;
    avatar_url?: string;
    status: UserStatus;
    created_at: string;
}
