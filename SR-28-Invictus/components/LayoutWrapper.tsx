'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopNavbar from '@/components/TopNavbar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Define routes that should be full-screen (no sidebar/navbar)
    const isLandingPage = pathname === '/'

    if (isLandingPage) {
        return <>{children}</>
    }

    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Mobile top navbar */}
            <TopNavbar />

            {/* Sidebar - hidden on mobile, visible on md+ */}
            <aside className="hidden md:block md:w-64 border-r border-sidebar-border bg-sidebar">
                <Sidebar />
            </aside>

            {/* Main content area */}
            <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
                {children}
            </main>
        </div>
    )
}
