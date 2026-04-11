"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { Save, Loader2, Upload } from "lucide-react";
import { showToast } from "@/app/lib/toast";
import Image from "next/image";

type ConfigData = {
    id?: string;
    title: string;
    hero_title: string;
    hero_subtitle: string;
    background_image: string;
    image_1: string;
    image_2: string;
    video: string;
    service_price: number;
    is_discount_active: boolean;
    discount_price: number;
    whatsapp_number: string;
    about_us_title: string;
    about_us_subtitle: string;
    about_us_description: string;
    about_us_full_description: string;
    about_us_video: string;
};

export default function ConfigPage() {
    const [config, setConfig] = useState<ConfigData>({
        title: "",
        hero_title: "",
        hero_subtitle: "",
        background_image: "",
        image_1: "",
        image_2: "",
        video: "",
        service_price: 0,
        is_discount_active: false,
        discount_price: 0,
        whatsapp_number: "",
        about_us_title: "",
        about_us_subtitle: "",
        about_us_description: "",
        about_us_full_description: "",
        about_us_video: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function fetchConfig() {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("config")
                .select("*")
                .single();

            if (error) {
                console.error("Error fetching config:", error);
                showToast("Failed to load configuration", "error");
            } else if (data) {
                setConfig(data);
            }
            setLoading(false);
        }
        fetchConfig();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof ConfigData = "background_image") => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const supabase = createClient();

        const fileExt = file.name.split(".").pop();
        const fileName = `${field}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("som-omaan")
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            showToast("Failed to upload image", "error");
        } else {
            const { data } = supabase.storage.from("som-omaan").getPublicUrl(fileName);
            setConfig((prev) => ({ ...prev, [field]: data.publicUrl }));
            showToast("Image uploaded successfully", "success");
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const supabase = createClient();

        // First, get the current config to find the correct identifier
        const { data: currentConfig } = await supabase
            .from("config")
            .select("*")
            .single();

        if (!currentConfig) {
            showToast("Config not found in database", "error");
            setSaving(false);
            return;
        }

        // Update using id if available, otherwise use the first unique column
        const updateData = {
            title: config.title,
            hero_title: config.hero_title,
            hero_subtitle: config.hero_subtitle,
            background_image: config.background_image,
            image_1: config.image_1,
            image_2: config.image_2,
            video: config.video,
            service_price: config.service_price,
            is_discount_active: config.is_discount_active,
            discount_price: config.discount_price,
            whatsapp_number: config.whatsapp_number,
            about_us_title: config.about_us_title,
            about_us_subtitle: config.about_us_subtitle,
            about_us_description: config.about_us_description,
            about_us_full_description: config.about_us_full_description,
            about_us_video: config.about_us_video,
        };

        let query = supabase.from("config").update(updateData);

        // Use id if it exists, otherwise use title
        if (currentConfig.id) {
            query = query.eq("id", currentConfig.id);
        } else {
            query = query.eq("title", currentConfig.title);
        }

        const { error, data } = await query.select();

        if (error) {
            console.error("Error updating config:", error);
            showToast("Failed to save configuration: " + error.message, "error");
        } else if (!data || data.length === 0) {
            console.error("No rows updated");
            showToast("No changes were saved. Check database permissions.", "error");
        } else {
            showToast("Configuration saved successfully!", "success");
            // Refresh the config to show updated values
            setConfig(data[0]);
        }
        setSaving(false);
    };

    const handleChange = (field: keyof ConfigData, value: string | number | boolean) => {
        setConfig((prev) => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#003527]" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1d]">
                    Site Configuration
                </h2>
                <p className="mt-1 text-sm text-[#191c1d]/60">
                    Update your homepage settings and pricing
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <h3 className="mb-6 text-lg font-bold text-[#191c1d]">General Settings</h3>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Site Title
                            </label>
                            <input
                                type="text"
                                value={config.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Hero Title
                            </label>
                            <input
                                type="text"
                                value={config.hero_title}
                                onChange={(e) => handleChange("hero_title", e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Hero Subtitle
                            </label>
                            <textarea
                                value={config.hero_subtitle}
                                onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Background Image
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={config.background_image}
                                    onChange={(e) => handleChange("background_image", e.target.value)}
                                    placeholder="Or paste image URL"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gray-200" />
                                    <span className="text-xs text-gray-500">OR</span>
                                    <div className="h-px flex-1 bg-gray-200" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "background_image")}
                                    className="hidden"
                                    id="bg-image-upload"
                                />
                                <label
                                    htmlFor="bg-image-upload"
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium text-gray-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            Upload background image
                                        </>
                                    )}
                                </label>
                                {config.background_image && (
                                    <div className="relative h-40 w-full overflow-hidden rounded-xl border border-gray-200">
                                        <Image
                                            src={config.background_image}
                                            alt="Background preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Slider Image 2
                            </label>
                            <p className="mb-2 text-xs text-[#191c1d]/60">Displayed after the background image in the hero slider.</p>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={config.image_1}
                                    onChange={(e) => handleChange("image_1", e.target.value)}
                                    placeholder="Paste image URL"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gray-200" />
                                    <span className="text-xs text-gray-500">OR</span>
                                    <div className="h-px flex-1 bg-gray-200" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "image_1")}
                                    className="hidden"
                                    id="image-1-upload"
                                />
                                <label
                                    htmlFor="image-1-upload"
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload Slider Image 2
                                        </>
                                    )}
                                </label>
                                {config.image_1 && (
                                    <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-200">
                                        <Image
                                            src={config.image_1}
                                            alt="Slider image 2 preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Slider Image 3
                            </label>
                            <p className="mb-2 text-xs text-[#191c1d]/60">Displayed after slider image 2 in the hero slider.</p>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={config.image_2}
                                    onChange={(e) => handleChange("image_2", e.target.value)}
                                    placeholder="Paste image URL"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-gray-200" />
                                    <span className="text-xs text-gray-500">OR</span>
                                    <div className="h-px flex-1 bg-gray-200" />
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "image_2")}
                                    className="hidden"
                                    id="image-2-upload"
                                />
                                <label
                                    htmlFor="image-2-upload"
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm font-medium text-gray-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload Slider Image 3
                                        </>
                                    )}
                                </label>
                                {config.image_2 && (
                                    <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-200">
                                        <Image
                                            src={config.image_2}
                                            alt="Slider image 3 preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Video URL
                            </label>
                            <input
                                type="url"
                                value={config.video}
                                onChange={(e) => handleChange("video", e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <h3 className="mb-6 text-lg font-bold text-[#191c1d]">Pricing Settings</h3>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                Service Price
                            </label>
                            <input
                                type="number"
                                value={config.service_price}
                                onChange={(e) => handleChange("service_price", parseFloat(e.target.value))}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="discount-active"
                                checked={config.is_discount_active}
                                onChange={(e) => handleChange("is_discount_active", e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                            />
                            <label htmlFor="discount-active" className="text-sm font-semibold text-[#191c1d]">
                                Enable Discount Pricing
                            </label>
                        </div>

                        {config.is_discount_active && (
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                    Discount Price
                                </label>
                                <input
                                    type="number"
                                    value={config.discount_price}
                                    onChange={(e) => handleChange("discount_price", parseFloat(e.target.value))}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <h3 className="mb-6 text-lg font-bold text-[#191c1d]">Contact Settings</h3>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            value={config.whatsapp_number}
                            onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                            placeholder="+252XXXXXXXXX"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        />
                        <p className="mt-2 text-xs text-[#191c1d]/60">
                            Include country code (e.g., +252XXXXXXXXX). This will be used for WhatsApp contact on booking success page.
                        </p>
                    </div>
                </div>

                <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                    <h3 className="mb-6 text-lg font-bold text-[#191c1d]">About Us Page Settings</h3>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                About Us Title
                            </label>
                            <input
                                type="text"
                                value={config.about_us_title}
                                onChange={(e) => handleChange("about_us_title", e.target.value)}
                                placeholder="About SomOman"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                About Us Subtitle
                            </label>
                            <input
                                type="text"
                                value={config.about_us_subtitle}
                                onChange={(e) => handleChange("about_us_subtitle", e.target.value)}
                                placeholder="Your trusted partner for services in Oman"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                About Us Short Description
                            </label>
                            <textarea
                                value={config.about_us_description}
                                onChange={(e) => handleChange("about_us_description", e.target.value)}
                                rows={3}
                                placeholder="A brief overview shown at the top of the About Us page"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                About Us Full Description
                            </label>
                            <textarea
                                value={config.about_us_full_description}
                                onChange={(e) => handleChange("about_us_full_description", e.target.value)}
                                rows={6}
                                placeholder="Detailed description. Use line breaks to separate paragraphs."
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#191c1d]">
                                About Us Video URL
                            </label>
                            <input
                                type="url"
                                value={config.about_us_video}
                                onChange={(e) => handleChange("about_us_video", e.target.value)}
                                placeholder="YouTube, TikTok, or direct video URL (fallback to hero video if empty)"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                            />
                            <p className="mt-2 text-xs text-[#191c1d]/60">
                                If empty, the hero video URL will be used as fallback.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-2xl bg-[#003527] px-6 py-3 font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
