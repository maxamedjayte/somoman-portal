"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Smartphone, CreditCard } from "lucide-react";
import Link from "next/link";

type Service = {
    id: string;
    title: string;
    description: string;
    image: string;
    checklist: string[];
};

type Config = {
    service_price: number;
    is_discount_active: boolean;
    discount_price: number;
};

function BookingApplyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get("service");

    const [service, setService] = useState<Service | null>(null);
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        full_name: "",
        country: "Somalia",
        phone_number: "",
        payment_method: "Mobile Money" as "Mobile Money" | "Master Card",
    });

    useEffect(() => {
        fetchData();
    }, [serviceId]);

    async function fetchData() {
        const supabase = createClient();

        const [serviceRes, configRes] = await Promise.all([
            supabase.from("services").select("*").eq("id", serviceId).single(),
            supabase.from("config").select("service_price, is_discount_active, discount_price").single(),
        ]);

        if (serviceRes.data) setService(serviceRes.data);
        if (configRes.data) setConfig(configRes.data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        const supabase = createClient();

        const bookingPin = Math.floor(1000 + Math.random() * 9000).toString();
        const finalPrice = config?.is_discount_active && config?.discount_price
            ? config.discount_price
            : config?.service_price || 0;

        const { data, error } = await supabase
            .from("booking_requests")
            .insert([
                {
                    full_name: formData.full_name,
                    country: formData.country,
                    phone_number: formData.payment_method === "Mobile Money" ? formData.phone_number : null,
                    service_id: serviceId,
                    payment_method: formData.payment_method,
                    paid_money: finalPrice,
                    payment_status: "pending",
                    process: "new",
                    booking_pin: bookingPin,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Error creating booking:", error);
            alert("Failed to create booking request. Please try again.");
            setSubmitting(false);
        } else {
            localStorage.setItem(`booking_pin_${data.id}`, bookingPin);
            setTimeout(() => {
                router.push(`/request/detail/${data.id}`);
            }, 2000);
        }
    }

    const isFormValid = () => {
        if (!formData.full_name || !formData.country) return false;
        if (formData.payment_method === "Mobile Money" && !formData.phone_number) return false;
        return true;
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4">
                <div className="w-full max-w-md rounded-[30px] bg-white p-8 text-center shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <p className="text-lg font-semibold text-[#191c1d]">Service not found</p>
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

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12">
            <div className="mx-auto max-w-2xl px-4">
                <div className="mb-6">
                    <Link href="/" className="text-sm font-semibold text-[#003527] hover:underline">
                        ← Back to home
                    </Link>
                </div>

                <div className="rounded-[30px] bg-white p-6 md:p-8 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <h1 className="mb-6 text-2xl font-extrabold text-[#191c1d]">Book Service</h1>

                    {/* Compact Service Summary */}
                    <div className="mb-6 flex gap-4 rounded-xl bg-gray-50 p-4">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-[#191c1d]">{service.title}</h3>
                            <p className="mt-1 text-xs text-[#191c1d]/70">{service.description}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Form Fields */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                                placeholder="Enter your full name"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Country *
                            </label>
                            <select
                                value={formData.country}
                                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            >
                                <option value="">Select country</option>
                                <option value="Somalia">🇸🇴 Somalia</option>
                                <option value="Kenya">🇰🇪 Kenya</option>
                                <option value="Ethiopia">🇪🇹 Ethiopia</option>
                                <option value="Djibouti">🇩🇯 Djibouti</option>
                                <option value="Uganda">🇺🇬 Uganda</option>
                                <option value="Tanzania">🇹🇿 Tanzania</option>
                                <option value="South Africa">🇿🇦 South Africa</option>
                                <option value="Nigeria">🇳🇬 Nigeria</option>
                                <option value="Egypt">🇪🇬 Egypt</option>
                                <option value="United States">🇺🇸 United States</option>
                                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                <option value="Canada">🇨🇦 Canada</option>
                                <option value="Australia">🇦🇺 Australia</option>
                                <option value="UAE">🇦🇪 UAE</option>
                                <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                                <option value="Other">🌍 Other</option>
                            </select>
                        </div>

                        {/* Payment Method Tabs */}
                        <div>
                            <label className="mb-3 block text-sm font-semibold text-[#191c1d]">
                                Payment Method *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, payment_method: "Mobile Money" }))}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${formData.payment_method === "Mobile Money"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                >
                                    <Smartphone className={`h-6 w-6 ${formData.payment_method === "Mobile Money" ? "text-emerald-600" : "text-gray-400"
                                        }`} />
                                    <span className={`text-sm font-semibold ${formData.payment_method === "Mobile Money" ? "text-emerald-700" : "text-gray-600"
                                        }`}>
                                        Mobile Money
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, payment_method: "Master Card" }))}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition ${formData.payment_method === "Master Card"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                >
                                    <CreditCard className={`h-6 w-6 ${formData.payment_method === "Master Card" ? "text-emerald-600" : "text-gray-400"
                                        }`} />
                                    <span className={`text-sm font-semibold ${formData.payment_method === "Master Card" ? "text-emerald-700" : "text-gray-600"
                                        }`}>
                                        Master Card
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Conditional Phone Number */}
                        {formData.payment_method === "Mobile Money" && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Phone Number *
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                        <span className="text-lg">🇸🇴</span>
                                        <span className="text-sm font-semibold text-[#191c1d]">+252</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, phone_number: e.target.value }))}
                                        placeholder="61XXXXXXX"
                                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Price Section */}
                        <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 p-4">
                            <div className="flex items-baseline justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Total Amount</p>
                                {config?.is_discount_active && config?.discount_price ? (
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-sm text-gray-500 line-through">${config.service_price}</span>
                                        <span className="text-2xl font-extrabold text-emerald-700">${config.discount_price}</span>
                                    </div>
                                ) : (
                                    <p className="text-2xl font-extrabold text-emerald-700">${config?.service_price || 0}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid() || submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#003527] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                "Book Now"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function BookingApplyPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        }>
            <BookingApplyContent />
        </Suspense>
    );
}
