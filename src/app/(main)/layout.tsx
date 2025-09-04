import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid grid-cols-[240px_1fr] min-h-screen bg-[var(--background)]">
            <Sidebar className="bg-[var(--sidebar)] p-[20px]" />
            {children}
        </div>
    );
}
