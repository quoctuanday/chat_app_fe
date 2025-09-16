'use client';
import Image from 'next/image';
import React from 'react';

interface AvatarProps {
    username: string;
    avatarUrl?: string | null;
    status?: 'online' | 'offline' | 'busy';
    w?: number; // width
    h?: number; // height
    classname?: string;
}

function getInitials(name: string): string {
    if (!name) return '?';
    return name
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join('')
        .slice(0, 2);
}

export default function Avatar({
    username,
    avatarUrl,
    status,
    w = 50,
    h = 50,
    classname,
}: AvatarProps) {
    return (
        <div
            className={`relative rounded-full bg-[var(--primary)]  flex items-center justify-center ${classname}`}
            style={{ width: w, height: h }}
        >
            {avatarUrl ? (
                <div
                    className="relative rounded-full overflow-hidden"
                    style={{ width: w, height: h }}
                >
                    <Image
                        src={avatarUrl}
                        alt={`Avatar of ${username}`}
                        fill
                        className="object-cover"
                    />
                </div>
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
