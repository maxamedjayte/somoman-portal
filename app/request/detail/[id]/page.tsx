"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useParams } from "next/navigation";
import { Loader2, CheckCircle, Lock, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

type BookingRequest = {
    id: string;
    full_name: string;
    country: string;
    service_id: string;
    payment_method: string;
    payment_status: string;
    paid_money: number;
    process: string;
    created_at: string;
    booking_pin: string;
    scheduled_date?: string;
    scheduled_day_of_week?: number;
    scheduled_start_time?: string;
    scheduled_end_time?: string;
    schedule_status?: string;
    schedule_note?: string;
};

type Service = {
    title: string;
};

type Config = {
    whatsapp_number: string;
};

export default function RequestDetailPage() {
    const params = useParams();
    const [request, setRequest] = useState<BookingRequest | null>(null);
    const [service, setService] = useState<Service | null>(null);
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [pinError, setPinError] = useState("");

    useEffect(() => {
        fetchRequest();
    }, [params.id]);

    async function fetchRequest() {
        const supabase = createClient();

        const storedPin = localStorage.getItem(`booking_pin_${params.id}`);

        const [requestRes, configRes] = await Promise.all([
            supabase.from("booking_requests").select("*").eq("id", params.id).single(),
            supabase.from("config").select("whatsapp_number").single(),
        ]);

        if (requestRes.error) {
            console.error("Error fetching request:", requestRes.error);
        } else if (requestRes.data) {
            setRequest(requestRes.data);

            if (storedPin && storedPin === requestRes.data.booking_pin) {
                setVerified(true);
            }

            const { data: serviceData } = await supabase
                .from("services")
                .select("title")
                .eq("id", requestRes.data.service_id)
                .single();

            if (serviceData) setService(serviceData);
        }

        if (configRes.data) setConfig(configRes.data);
        setLoading(false);
    }

    function handlePinVerification(e: React.FormEvent) {
        e.preventDefault();
        if (pinInput === request?.booking_pin) {
            setVerified(true);
            setPinError("");
        } else {
            setPinError("Invalid PIN. Please try again.");
        }
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
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
                <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <p className="text-lg font-semibold text-[#191c1d]">Request not found</p>
                    <Link
                        href="/"
                        className="mt-4 inline-block text-sm font-semibold text-[#003527] hover:underline"
                    >
                        Return to homepage
                    </Link>
                </div>
            </div>
        );
    }

    if (!verified) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
                <div className="w-full max-w-md rounded-[30px] bg-white p-8 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#003527]/10 mx-auto">
                        <Lock className="h-8 w-8 text-[#003527]" />
                    </div>
                    <h2 className="mb-2 text-center text-2xl font-extrabold text-[#191c1d]">Enter Your PIN</h2>
                    <p className="mb-6 text-center text-sm text-[#191c1d]/60">
                        Please enter the 4-digit PIN that was provided when you created this booking request.
                    </p>

                    <form onSubmit={handlePinVerification} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value);
                                    setPinError("");
                                }}
                                placeholder="Enter 4-digit PIN"
                                maxLength={4}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-semibold outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                            {pinError && (
                                <p className="mt-2 text-sm text-red-600">{pinError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-[#003527] px-6 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5"
                        >
                            Verify PIN
                        </button>
                    </form>

                    <Link
                        href="/"
                        className="mt-6 block text-center text-sm font-semibold text-[#003527] hover:underline"
                    >
                        Return to homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12">
            <div className="mx-auto max-w-2xl px-4">
                <div className="mb-8">
                    <Link href="/" className="text-sm font-semibold text-[#003527] hover:underline">
                        ← Back to home
                    </Link>
                </div>

                <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="rounded-[30px] bg-gradient-to-br from-emerald-500 to-[#003527] p-8 text-center text-white shadow-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h1 className="text-2xl font-extrabold">Booking Request Submitted!</h1>
                        <p className="mt-2 text-sm opacity-90">
                            Your request has been received and is being processed.
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                            <span className="text-xs font-semibold uppercase tracking-wider opacity-75">Reference ID</span>
                            <span className="font-mono text-sm font-bold">{request.id.slice(0, 8)}</span>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                        <h2 className="mb-4 text-lg font-extrabold text-[#191c1d]">Payment Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Service</span>
                                <span className="text-sm font-semibold text-[#191c1d]">{service?.title || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Payment Method</span>
                                <span className="text-sm font-semibold text-[#191c1d]">{request.payment_method}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-3">
                                <span className="font-bold text-[#191c1d]">Total Amount</span>
                                <span className="text-xl font-extrabold text-emerald-600">${request.paid_money}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Status</span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.payment_status)}`}>
                                    {request.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                        <h2 className="mb-4 text-lg font-extrabold text-[#191c1d]">Booking Information</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Full Name</span>
                                <span className="text-sm font-semibold text-[#191c1d]">{request.full_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Country</span>
                                <span className="text-sm font-semibold text-[#191c1d]">{request.country}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Process Status</span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadge(request.process)}`}>
                                    {request.process}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[#191c1d]/70">Submitted</span>
                                <span className="text-sm text-[#191c1d]/70">
                                    {new Date(request.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Processing Schedule */}
                    {request.scheduled_date && (
                        <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                            <h2 className="mb-4 text-lg font-extrabold text-[#191c1d]">Processing Schedule</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#003527]" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#191c1d]">
                                            {request.schedule_status === "today"
                                                ? "Today"
                                                : new Date(request.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                        </p>
                                        {request.scheduled_start_time && request.scheduled_end_time && (
                                            <p className="text-sm text-[#191c1d]/70">
                                                {request.scheduled_start_time} - {request.scheduled_end_time}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {request.schedule_note && (
                                    <p className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">
                                        {request.schedule_note}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="rounded-[30px] bg-blue-50 border border-blue-200 p-6">
                        <h3 className="mb-3 text-sm font-bold text-blue-900">📋 Next Steps</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>Our team will review your request within 24 hours</span>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>You will receive updates on your booking status</span>
                            </li>
                            <li className="flex gap-2">
                                <span>•</span>
                                <span>Save your PIN: <span className="font-bold">{request.booking_pin}</span> to access this page later</span>
                            </li>
                        </ul>
                    </div>

                    {/* WhatsApp Contact */}
                    {config?.whatsapp_number && (
                        <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                            <div className="text-center">
                                <h3 className="mb-2 text-sm font-bold text-[#191c1d]">Need Help?</h3>
                                <p className="mb-4 text-sm text-[#191c1d]/70">Contact us on WhatsApp for assistance</p>
                                <a
                                    href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
