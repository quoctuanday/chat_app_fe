'use client';
import ChatItem from './ChatItem';

export default function ChatList() {
    const chats = [
        {
            name: 'Anh Nguyễn',
            message: 'Bạn: Hẹn gặp lại nhé! 👋',
            time: '2 phút',
            initials: 'AN',
            color: 'bg-gradient-to-r from-purple-400 to-pink-400',
            online: true,
            unread: 0,
        },
        {
            name: 'Mai Linh',
            message: 'Cảm ơn bạn nhiều! Mình sẽ xem xét...',
            time: '15 phút',
            initials: 'ML',
            color: 'bg-gradient-to-r from-blue-400 to-teal-400',
            online: true,
            unread: 2,
        },
        {
            name: 'Nhóm Dự án ABC',
            message: 'Tuấn: Chúng ta họp lúc 2h chiều nhé',
            time: '1 giờ',
            initials: '👥',
            color: 'bg-gradient-to-r from-indigo-400 to-purple-400',
            unread: 5,
        },
        {
            name: 'Hương Trà',
            message: 'Chúc bạn một ngày tốt lành! ☀️',
            time: '3 giờ',
            initials: 'HT',
            color: 'bg-gradient-to-r from-pink-400 to-rose-400',
        },
        {
            name: 'Đức Khang',
            message: 'Bạn có rảnh cuối tuần không?',
            time: 'Hôm qua',
            initials: 'DK',
            color: 'bg-gradient-to-r from-emerald-400 to-teal-400',
            online: true,
        },
    ];

    return (
        <div className="space-y-3">
            {chats.map((chat, i) => (
                <ChatItem key={i} {...chat} />
            ))}
        </div>
    );
}
