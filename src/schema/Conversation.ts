import { User } from './User';
import { ConversationMember, MemberRole } from './ConvservationMember';
import { Message } from './Message';

export type ConversationType = 'private' | 'group';

export interface Conversation {
    conversation_id: string;
    type: ConversationType;
    avatar_url?: string;
    name?: string;
    created_at?: string;
    created_by?: User;
    created_by_id?: string;
    members?: ConversationMember[];
    messages?: Message[];
    lastMessage?: Message;
}
