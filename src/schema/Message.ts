import { User } from './User';
import { MessageStatus, Status } from './MessageStatus';
import { Attachment, FileType } from './Attachment';

export type MessageType = 'text' | 'image' | 'file' | 'system';

export interface Message {
    message_id: string;
    conversation_id: string;
    sender_id: string;
    content?: string;
    message_type: MessageType;
    created_at: string;
    sender?: User;
    statuses?: MessageStatus[];
    attachments?: Attachment[];
}
