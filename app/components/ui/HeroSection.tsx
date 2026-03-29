"use client";

import { useState } from "react";
import Link from "next/link";
import type { Config } from "@/app/lib/supabase/types";

type HeroSectionProps = {
    config: Config | null;
};

export default function HeroSection({ config }: HeroSectionProps) {
    const [showVideo, setShowVideo] = useState(false);

    const title = config?.title || "SOM-OMAN";
    const heroTitle = config?.hero_title || "soo dhowow SomOman";
    const heroSubtitle = config?.hero_subtitle || "U hel adeegyada ugu fiican ee dalka Oman si fudud oo casri ah.";
    const backgroundImage = config?.background_image || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
    const videoUrl = config?.video || "";

    const getVideoEmbedUrl = (url: string) => {
        if (!url) return null;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be')
                ? url.split('youtu.be/')[1]?.split('?')[0]
                : url.split('v=')[1]?.split('&')[0];
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
        }

        if (url.includes('tiktok.com')) {
            const videoId = url.split('/video/')[1]?.split('?')[0];
            return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
        }

        if (url.match(/\.(mp4|webm|ogg)$/i)) {
            return url;
        }

        return url;
    };

    const embedUrl = getVideoEmbedUrl(videoUrl);
    const isDirectVideo = videoUrl.match(/\.(mp4|webm|ogg)$/i);

    const handlePlayClick = () => {
        if (videoUrl) {
            setShowVideo(true);
        }
    };

    return (
        <section
            className="relative overflow-hidden bg-cover bg-center text-white"
            style={{
                backgroundImage: `linear-gradient(135deg,rgba(0,53,39,0.62),rgba(6,78,59,0.38)),url('${backgroundImage}')`
            }}
        >
            <div className="mx-auto flex min-h-[32vh] max-w-7xl flex-col px-4 pb-5 pt-4 md:min-h-[42vh] md:px-6 md:pb-8">
                <div className="mb-5 flex items-center justify-between rounded-full bg-white/90 px-4 py-3 text-[#003527] shadow-[0_18px_50px_rgba(25,28,29,0.08)] backdrop-blur-xl md:mb-8 md:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#003527] text-sm font-bold text-white">
                            S
                        </div>
                        <p className="text-xl font-extrabold tracking-tight">{title}</p>
                    </div>

                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        <Link href="/">Home</Link>
                        <Link href="/#">Services</Link>
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
                    <div className="flex items-center justify-between gap-4 md:block">
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

                            {/* ✅ NEW BUTTONS (desktop only) */}
                            <div className="mt-6 hidden items-center gap-3 md:flex">
                                <Link
                                    href="/request/apply"
                                    className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#191c1d] shadow-[0_16px_40px_rgba(25,28,29,0.12)] transition hover:-translate-y-0.5"
                                >
                                    Dalbo hadda
                                </Link>

                                <Link
                                    href="/request/apply"
                                    className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                                >
                                    See adeegyada
                                </Link>
                            </div>
                        </div>

                        {/* MOBILE PLAY BUTTON */}
                        <button
                            type="button"
                            onClick={handlePlayClick}
                            aria-label="Play intro video"
                            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black/45 shadow-[0_18px_40px_rgba(0,0,0,0.22)] ring-4 ring-white/20 backdrop-blur-sm transition hover:scale-105 md:hidden"
                        >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/30" />
                            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003527]">
                                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* RIGHT SIDE (DESKTOP PLAY BUTTON) */}
                    <div className="hidden items-center justify-center md:flex">
                        <button
                            type="button"
                            onClick={handlePlayClick}
                            aria-label="Play intro video"
                            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-black/45 shadow-[0_25px_60px_rgba(0,0,0,0.28)] ring-8 ring-white/10 backdrop-blur-sm transition hover:scale-105"
                        >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/20" />
                            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#003527]">
                                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor">
                                    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
                                </svg>
                            </span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Video Modal */}
            {showVideo && embedUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setShowVideo(false)}
                >
                    <button
                        onClick={() => setShowVideo(false)}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                        aria-label="Close video"
                    >
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div
                        className="relative w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isDirectVideo ? (
                            <video
                                src={embedUrl}
                                controls
                                autoPlay
                                className="w-full rounded-2xl"
                            />
                        ) : (
                            <iframe
                                src={embedUrl}
                                className="aspect-video w-full rounded-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}