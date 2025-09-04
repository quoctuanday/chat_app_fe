import { Message } from './Message';

export type FileType = 'image' | 'video' | 'file' | 'audio';

export interface Attachment {
    attachment_id: string;
    message_id: string;
    file_url: string;
    file_type: FileType;
    file_size?: number;
    uploaded_at: string;
    message?: Message;
}
