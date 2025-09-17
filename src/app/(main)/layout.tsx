'use client';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className="relative min-h-screen bg-[var(--background)] flex">
            <Sidebar
                className={`bg-[var(--sidebar)] fixed top-0 left-0 h-full transition-transform duration-500 ease-in-out z-20
          ${isCollapsed ? 'w-0' : 'w-[240px]  p-[20px]'}
        `}
                isCollapsed={isCollapsed}
                toggleSidebar={() => setIsCollapsed(!isCollapsed)}
            />

            <div
                className={`flex-1 transition-all duration-500 ease-in-out
          ${isCollapsed ? 'ml-0' : 'ml-[240px]'}
        `}
            >
                {children}
            </div>
        </div>
    );
}
