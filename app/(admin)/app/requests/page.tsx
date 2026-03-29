"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Loader2, Search, Eye, Filter } from "lucide-react";
import { showToast } from "@/app/lib/toast";
import Link from "next/link";

type BookingRequest = {
    id: string;
    full_name: string;
    phone_number: string;
    country: string;
    service_id: string;
    payment_method: string;
    payment_status: "pending" | "paid" | "failed";
    paid_money: number;
    process: "new" | "review" | "processing" | "completed";
    created_at: string;
};

type Stats = {
    new: number;
    review: number;
    processing: number;
    completed: number;
};

const ITEMS_PER_PAGE = 10;

export default function RequestsPage() {
    const [requests, setRequests] = useState<BookingRequest[]>([]);
    const [stats, setStats] = useState<Stats>({ new: 0, review: 0, processing: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [processFilter, setProcessFilter] = useState<string>("all");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");

    useEffect(() => {
        fetchStats();
        fetchRequests();
    }, [currentPage, searchTerm, processFilter, paymentFilter]);

    async function fetchStats() {
        const supabase = createClient();

        const [newCount, reviewCount, processingCount, completedCount] = await Promise.all([
            supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("process", "new"),
            supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("process", "review"),
            supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("process", "processing"),
            supabase.from("booking_requests").select("*", { count: "exact", head: true }).eq("process", "completed"),
        ]);

        setStats({
            new: newCount.count || 0,
            review: reviewCount.count || 0,
            processing: processingCount.count || 0,
            completed: completedCount.count || 0,
        });
    }

    async function fetchRequests() {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("booking_requests")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        // Apply search
        if (searchTerm) {
            query = query.or(`full_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`);
        }

        // Apply filters
        if (processFilter !== "all") {
            query = query.eq("process", processFilter);
        }
        if (paymentFilter !== "all") {
            query = query.eq("payment_status", paymentFilter);
        }

        // Pagination
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error("Error fetching requests:", error);
            showToast("Failed to load requests", "error");
        } else {
            setRequests(data || []);
            setTotalCount(count || 0);
        }
        setLoading(false);
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const getStatusBadge = (status: string) => {
        const styles = {
            new: "bg-blue-100 text-blue-700",
            review: "bg-yellow-100 text-yellow-700",
            processing: "bg-purple-100 text-purple-700",
            completed: "bg-emerald-100 text-emerald-700",
            pending: "bg-orange-100 text-orange-700",
            paid: "bg-emerald-100 text-emerald-700",
            failed: "bg-red-100 text-red-700",
        };
        return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-[24px] bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">New Requests</p>
                    <p className="mt-2 text-3xl font-extrabold">{stats.new}</p>
                </div>
                <div className="rounded-[24px] bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">Review</p>
                    <p className="mt-2 text-3xl font-extrabold">{stats.review}</p>
                </div>
                <div className="rounded-[24px] bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">Processing</p>
                    <p className="mt-2 text-3xl font-extrabold">{stats.processing}</p>
                </div>
                <div className="rounded-[24px] bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
                    <p className="text-sm font-medium opacity-90">Completed</p>
                    <p className="mt-2 text-3xl font-extrabold">{stats.completed}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={processFilter}
                            onChange={(e) => {
                                setProcessFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        >
                            <option value="all">All Process</option>
                            <option value="new">New</option>
                            <option value="review">Review</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={paymentFilter}
                            onChange={(e) => {
                                setPaymentFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        >
                            <option value="all">All Payment</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_22px_50px_rgba(25,28,29,0.05)]">
                {loading ? (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-[#eef1f2] bg-[#f8f9fa] text-left">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Phone</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Country</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Payment</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Process</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <tr key={request.id} className="border-t border-[#f1f3f5] transition hover:bg-[#fafbfb]">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-[#191c1d]">{request.full_name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[#191c1d]/70">{request.phone_number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[#191c1d]/70">{request.country}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.payment_status)}`}>
                                                    {request.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-[#003527]">${request.paid_money}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.process)}`}>
                                                    {request.process}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[#191c1d]/70">
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/app/requests/${request.id}`}
                                                    className="flex items-center gap-1 rounded-lg bg-[#4059aa] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#4059aa]/90"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-[#f1f3f5] px-6 py-4">
                                <p className="text-sm text-[#191c1d]/60">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} results
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#191c1d] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${currentPage === page
                                                    ? "bg-[#003527] text-white"
                                                    : "border border-gray-200 text-[#191c1d] hover:bg-gray-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#191c1d] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {requests.length === 0 && (
                            <div className="p-12 text-center">
                                <p className="text-sm text-[#191c1d]/55">No booking requests found.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}