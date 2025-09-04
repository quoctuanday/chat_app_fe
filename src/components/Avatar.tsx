'use client';
import Image from 'next/image';
import React from 'react';

interface AvatarProps {
    username: string;
    avatarUrl?: string | null;
    status?: 'online' | 'offline' | 'busy';
    w?: number; // width
    h?: number; // height
}

function getInitials(name: string): string {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join('')
        .slice(0, 2); // Lấy tối đa 2 ký tự
}

export default function Avatar({
    username,
    avatarUrl,
    status,
    w = 50,
    h = 50,
}: AvatarProps) {
    return (
        <div
            className={`relative rounded-full bg-[var(--primary)] border flex items-center justify-center`}
            style={{ width: w, height: h }}
        >
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={`Avatar of ${username}`}
                    width={w}
                    height={h}
                    className="rounded-full object-cover"
                />
            ) : (
                <span
                    className="text-white font-semibold"
                    style={{ fontSize: Math.floor(h / 2) }}
                >
                    {getInitials(username)}
                </span>
            )}

            {/* Status dot */}
            {status && (
                <div
                    className={`absolute rounded-full w-1/4 h-1/4 ${
                        status === 'online'
                            ? 'bg-[var(--online)]'
                            : status === 'busy'
                            ? 'bg-yellow-500'
                            : 'bg-[var(--offline)]'
                    }`}
                    style={{ bottom: 2, right: 2 }}
                ></div>
            )}
        </div>
    );
}
