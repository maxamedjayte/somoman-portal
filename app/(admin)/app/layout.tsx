"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Mail, LogOut, Bell, Search } from "lucide-react";

const navigationItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/requests", label: "Requests", icon: FileText },
    { href: "/app/messages", label: "Messages", icon: Mail },
];

const pageTitles: Record<string, string> = {
    "/app/dashboard": "Dashboard Overview",
    "/app/requests": "Manage Requests",
    "/app/messages": "Messages & Inquiries",
};

export default function AdminAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const pageTitle = pageTitles[pathname] || "Admin Panel";

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden w-72 flex-col border-r border-white/10 bg-[#0d1f1a] text-white lg:flex">
                    <div className="border-b border-white/10 px-6 py-6">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/80">
                            Admin Portal
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                            SomOman
                        </h2>
                        <p className="mt-1 text-sm text-white/60">Management Dashboard</p>
                    </div>

                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navigationItems.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active
                                            ? "bg-white text-[#0d1f1a] shadow-[0_16px_40px_rgba(255,255,255,0.08)]"
                                            : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4">
                        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main area */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Topbar */}
                    <header className="border-b border-[#e9ecef] bg-white/85 backdrop-blur-xl">
                        <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-[#191c1d]">
                                    {pageTitle}
                                </h1>
                                <p className="mt-1 text-sm text-[#191c1d]/60">
                                    Welcome back to the admin panel.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden items-center gap-2 rounded-2xl bg-[#f3f4f5] px-4 py-2.5 md:flex">
                                    <Search className="h-4 w-4 text-[#191c1d]/50" />
                                    <span className="text-sm text-[#191c1d]/50">Search...</span>
                                </div>

                                <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3f4f5] text-[#191c1d]/70 transition hover:bg-[#e9ecef]">
                                    <Bell className="h-5 w-5" />
                                </button>

                                <div className="flex items-center gap-3 rounded-2xl bg-[#f3f4f5] px-3 py-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003527] text-sm font-bold text-white">
                                        M
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold text-[#191c1d]">Admin User</p>
                                        <p className="text-xs text-[#191c1d]/55">Super Admin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}