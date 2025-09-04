import { User } from './User';
import { Conversation } from './Conversation';

export type MemberRole = 'member' | 'admin';

export interface ConversationMember {
    conversation_id: string;
    user_id: string;
    username?: string;
    role: MemberRole;
    joined_at: string;
    avatar_url?: string;
    user?: User;
    conversation?: Conversation;
}
