import { User } from './User';
import { Message } from './Message';

export type Status = 'sent' | 'delivered' | 'read';

export interface MessageStatus {
    message_id: string;
    user_id: string;
    status: Status;
    updated_at: string;
    message?: Message;
    user?: User;
}
