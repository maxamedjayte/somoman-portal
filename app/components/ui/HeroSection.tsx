"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Config } from "@/app/lib/supabase/types";
import VideoPlayer from "./VideoPlayer";

type HeroSectionProps = {
    config: Config | null;
};

export default function HeroSection({ config }: HeroSectionProps) {
    const title = config?.title || "SOM-OMAN";
    const heroTitle = config?.hero_title || "soo dhowow SomOman";
    const heroSubtitle = config?.hero_subtitle || "U hel adeegyada ugu fiican ee dalka Oman si fudud oo casri ah.";
    const backgroundImage = config?.background_image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
    const videoUrl = config?.video || "";

    // Build slider images: background_image (1st), image_1 (2nd), image_2 (3rd)
    const sliderImages = [backgroundImage, config?.image_1, config?.image_2].filter(Boolean) as string[];
    const hasMultipleImages = sliderImages.length > 1;

    const [currentSlide, setCurrentSlide] = useState(0);

    const goToNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, [sliderImages.length]);

    useEffect(() => {
        if (!hasMultipleImages) return;
        const timer = setInterval(goToNext, 7000);
        return () => clearInterval(timer);
    }, [goToNext, hasMultipleImages]);

    const overlay = "linear-gradient(135deg,rgba(0,53,39,0.62),rgba(6,78,59,0.38)),";

    return (
        <section className="relative overflow-hidden text-white">
            {/* Background / Slider */}
            {hasMultipleImages ? (
                <>
                    {sliderImages.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
                            style={{
                                backgroundImage: `${overlay}url('${img}')`,
                                opacity: i === currentSlide ? 1 : 0,
                            }}
                        />
                    ))}
                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                        {sliderImages.map((_, i) => (

                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide
                                    ? "w-6 bg-white"
                                    : "w-2 bg-white/40 hover:bg-white/60"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `${overlay}url('${sliderImages[0]}')`,
                    }}
                />
            )}

            <div className="relative mx-auto flex min-h-[32vh] max-w-7xl flex-col px-4 pb-5 pt-4 md:min-h-[42vh] md:px-6 md:pb-8">
                <div className="mb-5 flex items-center justify-between rounded-full bg-white/90 px-4 py-3 text-[#003527] shadow-[0_18px_50px_rgba(25,28,29,0.08)] backdrop-blur-xl md:mb-8 md:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003527] text-sm font-bold text-white">
                            S
                        </div>
                        <p className="text-xl font-extrabold tracking-tight">{title}</p>
                    </div>

                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link href="/">Home</Link>
                        <Link href="/about-us">About Us</Link>
                        <Link href="/#contact">Contact</Link>
                        <Link
                            href="/auth/login"
                            className="rounded-full bg-[#003527] px-5 py-2 text-white"
                        >
                            Login
                        </Link>
                    </nav>

                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003527]/8 md:hidden"
                        aria-label="Open menu"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                </div>

                <div className="grid flex-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">

                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-4 md:block mb-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="max-w-[220px] md:max-w-xl">
                                <p className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md md:mb-3 md:text-[11px]">
                                    Ku soo dhowow SomOman
                                </p>

                                <h1 className="text-[2rem] font-extrabold leading-[0.98] tracking-[-0.03em] md:max-w-md md:text-5xl">
                                    {heroTitle}
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-white/90 md:mt-4 md:max-w-md md:text-base md:leading-7">
                                    {heroSubtitle}
                                </p>

                                {/* Desktop Buttons */}
                                <div className="mt-6 hidden items-center gap-3 md:flex">
                                    <Link
                                        href="/request/apply"
                                        className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#191c1d] shadow-[0_16px_40px_rgba(25,28,29,0.12)] transition hover:-translate-y-0.5"
                                    >
                                        Dalbo hadda
                                    </Link>

                                    <Link
                                        href="/about-us"
                                        className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                                    >
                                        About Us
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile Play Button */}
                            {videoUrl && (
                                <VideoPlayer videoUrl={videoUrl} className="h-16 w-16 shrink-0 ring-4 ring-white/20 md:hidden" />
                            )}
                        </div>

                        {/* Mobile Buttons: About Us + Contact Us */}
                        <div className="flex items-center gap-3 md:hidden">
                            <Link
                                href="/about-us"
                                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#191c1d] shadow-[0_12px_30px_rgba(25,28,29,0.12)] transition hover:-translate-y-0.5"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/#contact"
                                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>


                    {/* RIGHT SIDE (DESKTOP PLAY BUTTON) */}
                    <div className="hidden items-center justify-center md:flex">
                        {videoUrl && (
                            <VideoPlayer videoUrl={videoUrl} className="h-28 w-28 ring-8 ring-white/10" />
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}