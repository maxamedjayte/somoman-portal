"use client";

import { useState } from "react";

type VideoPlayerProps = {
    videoUrl: string;
    className?: string;
};

export function getVideoEmbedUrl(url: string): string | null {
    if (!url) return null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be')
            ? url.split('youtu.be/')[1]?.split('?')[0]
            : url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (url.includes('tiktok.com')) {
        const videoId = url.split('/video/')[1]?.split('?')[0];
        return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;
    }

    if (url.match(/\.(mp4|webm|ogg)$/i)) {
        return url;
    }

    return url;
}

export function isDirectVideo(url: string): boolean {
    return !!url.match(/\.(mp4|webm|ogg)$/i);
}

export default function VideoPlayer({ videoUrl, className }: VideoPlayerProps) {
    const [showVideo, setShowVideo] = useState(false);

    const embedUrl = getVideoEmbedUrl(videoUrl);
    const direct = isDirectVideo(videoUrl);

    if (!videoUrl) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setShowVideo(true)}
                className={`relative flex items-center justify-center rounded-full bg-black/45 text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur-sm transition hover:scale-105 ${className || "h-20 w-20"}`}
                aria-label="Play video"
            >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/20" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#003527]">
                    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                        <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
                    </svg>
                </span>
            </button>

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
                        {direct ? (
                            <video
                                src={embedUrl}
                                controls
                                autoPlay
                                className="w-full rounded-2xl"
                            />
                        ) : (
                            <iframe
                                src={embedUrl + (embedUrl.includes('youtube.com') ? '&autoplay=1' : '')}
                                className="aspect-video w-full rounded-2xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
