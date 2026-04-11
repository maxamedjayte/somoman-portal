"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Package, LogOut, Menu, X, ChevronLeft, ChevronRight, FileText, Calendar } from "lucide-react";
import { logout } from "@/app/(auth)/auth/login/actions";
import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { ToastContainer } from "@/app/lib/toast";

const navigationItems = [
    { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/app/requests", label: "Requests", icon: FileText },
    { href: "/app/schedule", label: "Schedule", icon: Calendar },
    { href: "/app/services", label: "Services", icon: Package },
    { href: "/app/config", label: "Config", icon: Settings },
];

const pageTitles: Record<string, string> = {
    "/app/dashboard": "Dashboard Overview",
    "/app/requests": "Booking Requests",
    "/app/schedule": "Work Schedule",
    "/app/services": "Manage Services",
    "/app/config": "Site Configuration",
};

export default function AdminAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const pageTitle = pageTitles[pathname] || "Admin Panel";
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        async function getUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        }
        getUser();
    }, []);

    const getInitials = (email: string | null) => {
        if (!email) return "A";
        return email.charAt(0).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
            <ToastContainer />
            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <div className="flex min-h-screen">
                {/* Sidebar - Desktop */}
                <aside className={`hidden lg:flex flex-col border-r border-white/10 bg-[#0d1f1a] text-white transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-72"
                    }`}>
                    <div className="border-b border-white/10 px-6 py-6">
                        {!sidebarCollapsed ? (
                            <>
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/80">
                                    Admin Portal
                                </p>
                                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                                    SomOman
                                </h2>
                                <p className="mt-1 text-sm text-white/60">Management Dashboard</p>
                            </>
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold">
                                S
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navigationItems.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    title={sidebarCollapsed ? item.label : undefined}
                                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active
                                        ? "bg-white text-[#0d1f1a] shadow-[0_16px_40px_rgba(255,255,255,0.08)]"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                        } ${sidebarCollapsed ? "justify-center" : ""}`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {!sidebarCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-2 p-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <>
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Collapse</span>
                                </>
                            )}
                        </button>
                        <form action={logout}>
                            <button
                                type="submit"
                                title={sidebarCollapsed ? "Sign Out" : undefined}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <LogOut className="h-4 w-4" />
                                {!sidebarCollapsed && <span>Sign Out</span>}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Sidebar - Mobile */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-white/10 bg-[#0d1f1a] text-white transition-transform duration-300 lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } flex`}>
                    <div className="border-b border-white/10 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300/80">
                                    Admin Portal
                                </p>
                                <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                                    SomOman
                                </h2>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2 px-4 py-6">
                        {navigationItems.map((item) => {
                            const active = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
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
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main area */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Topbar */}
                    <header className="sticky top-0 z-30 border-b border-[#e9ecef] bg-white/95 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f4f5] text-[#191c1d] transition hover:bg-[#e9ecef] lg:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-extrabold tracking-tight text-[#191c1d] md:text-2xl">
                                        {pageTitle}
                                    </h1>
                                    <p className="mt-0.5 hidden text-sm text-[#191c1d]/60 sm:block">
                                        Manage your platform efficiently
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 rounded-2xl bg-[#f3f4f5] px-3 py-2 transition hover:bg-[#e9ecef]">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-[#003527] text-sm font-bold text-white shadow-lg">
                                        {getInitials(userEmail)}
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold text-[#191c1d]">
                                            {userEmail ? userEmail.split("@")[0] : "Admin"}
                                        </p>
                                        <p className="text-xs text-[#191c1d]/55">
                                            {userEmail || "Loading..."}
                                        </p>
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