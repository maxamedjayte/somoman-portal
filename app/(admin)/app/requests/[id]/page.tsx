"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { showToast } from "@/app/lib/toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type BookingRequest = {
    id: string;
    full_name: string;
    phone_number: string;
    country: string;
    service_id: string;
    message: string;
    payment_method: string;
    payment_status: "pending" | "paid" | "failed";
    paid_money: number;
    process: "new" | "review" | "processing" | "completed";
    created_at: string;
    updated_at: string;
};

export default function RequestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [request, setRequest] = useState<BookingRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        process: "" as BookingRequest["process"],
        payment_status: "" as BookingRequest["payment_status"],
        paid_money: 0,
    });

    useEffect(() => {
        fetchRequest();
    }, [params.id]);

    async function fetchRequest() {
        const supabase = createClient();
        const { data, error } = await supabase
            .from("booking_requests")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            console.error("Error fetching request:", error);
            showToast("Failed to load request", "error");
        } else if (data) {
            setRequest(data);
            setFormData({
                process: data.process,
                payment_status: data.payment_status,
                paid_money: data.paid_money,
            });
        }
        setLoading(false);
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        setUpdating(true);

        const supabase = createClient();
        const { error } = await supabase
            .from("booking_requests")
            .update({
                process: formData.process,
                payment_status: formData.payment_status,
                paid_money: formData.paid_money,
                updated_at: new Date().toISOString(),
            })
            .eq("id", params.id);

        if (error) {
            console.error("Error updating request:", error);
            showToast("Failed to update request", "error");
        } else {
            showToast("Request updated successfully", "success");
            fetchRequest();
        }
        setUpdating(false);
    }

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

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="rounded-[30px] bg-white p-12 text-center shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                <p className="text-sm text-[#191c1d]/55">Request not found</p>
                <Link
                    href="/app/requests"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#003527] hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/app/requests"
                    className="flex items-center gap-2 text-sm font-semibold text-[#003527] transition hover:gap-3"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Requests
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Request Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                        <h2 className="mb-6 text-xl font-extrabold text-[#191c1d]">Request Details</h2>

                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Full Name
                                    </label>
                                    <p className="text-sm font-semibold text-[#191c1d]">{request.full_name}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Phone Number
                                    </label>
                                    <p className="text-sm font-semibold text-[#191c1d]">{request.phone_number}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Country
                                    </label>
                                    <p className="text-sm font-semibold text-[#191c1d]">{request.country}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Service ID
                                    </label>
                                    <p className="text-sm font-semibold text-[#191c1d]">{request.service_id}</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                    Message
                                </label>
                                <p className="text-sm text-[#191c1d]/70">{request.message || "No message provided"}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Payment Method
                                    </label>
                                    <p className="text-sm font-semibold text-[#191c1d]">{request.payment_method}</p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Paid Amount
                                    </label>
                                    <p className="text-lg font-extrabold text-[#003527]">${request.paid_money}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Payment Status
                                    </label>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.payment_status)}`}>
                                        {request.payment_status}
                                    </span>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Process Status
                                    </label>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.process)}`}>
                                        {request.process}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Created At
                                    </label>
                                    <p className="text-sm text-[#191c1d]/70">
                                        {new Date(request.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-[0.14em] text-[#191c1d]/45">
                                        Updated At
                                    </label>
                                    <p className="text-sm text-[#191c1d]/70">
                                        {new Date(request.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Form */}
                <div className="lg:col-span-1">
                    <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)] sticky top-6">
                        <h2 className="mb-6 text-xl font-extrabold text-[#191c1d]">Update Request</h2>

                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Process Status
                                </label>
                                <select
                                    value={formData.process}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, process: e.target.value as BookingRequest["process"] }))}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    required
                                >
                                    <option value="new">New</option>
                                    <option value="review">Review</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Payment Status
                                </label>
                                <select
                                    value={formData.payment_status}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, payment_status: e.target.value as BookingRequest["payment_status"] }))}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Paid Amount
                                </label>
                                <input
                                    type="number"
                                    value={formData.paid_money}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, paid_money: parseFloat(e.target.value) }))}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updating}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#003527] px-6 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Update Request
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
