import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { getListConversationByQuery } from '@/api';
import { getInitials } from '@/helper/getInitials';
import Image from 'next/image';
import { useUser } from '@/store/socket';

interface SearchBarProps {
    className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
    const { userLoginData } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const fetchData = async () => {
            try {
                const res = await getListConversationByQuery({ name: query });
                setResults(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        const debounce = setTimeout(fetchData, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const getConversationInfo = (item: any) => {
        if (item.type === 'group') {
            return {
                name: item.name,
                avatar: item.avatar_url,
            };
        } else {
            const other = item.members.find(
                (m: any) => m.user_id !== userLoginData?.user_id
            );
            return {
                name: other?.username || 'Unknown',
                avatar: other?.avatar_url,
            };
        }
    };

    return (
        <div className={`${className} relative`} ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/70 backdrop-blur-sm border border-mint-dark/30 rounded-2xl px-8 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />

                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-mint/50 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-sm border border-teal-200/50 rounded-2xl shadow-lg z-20 max-h-80 overflow-y-auto">
                    <div className="p-3">
                        {query && results.length > 0 && (
                            <>
                                <div className="text-sm text-gray-500 mb-2">
                                    Tìm thấy {results.length} kết quả
                                </div>
                                <div className="space-y-2">
                                    {results.map((item, i) => {
                                        const { name, avatar } =
                                            getConversationInfo(item);
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center space-x-3 p-3 hover:bg-mint/40 rounded-xl cursor-pointer transition-colors"
                                                onClick={() => {
                                                    alert(`Bạn chọn ${name}`);
                                                    setIsOpen(false);
                                                    setQuery('');
                                                }}
                                            >
                                                {avatar ? (
                                                    <Image
                                                        src={avatar}
                                                        width={100}
                                                        height={100}
                                                        alt={name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {getInitials(name)}
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-gray-800 truncate">
                                                        {name}
                                                    </h4>
                                                    <p className="text-gray-600 text-sm truncate">
                                                        {item.type === 'group'
                                                            ? 'Nhóm trò chuyện'
                                                            : 'Cuộc trò chuyện riêng'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {query && results.length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                <svg
                                    className="w-12 h-12 mx-auto mb-3 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <p>Không tìm thấy cuộc trò chuyện nào</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
