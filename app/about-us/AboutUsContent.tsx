"use client";

import { getVideoEmbedUrl, isDirectVideo } from "@/app/components/ui/VideoPlayer";

type AboutUsContentProps = {
    videoUrl: string;
};

export default function AboutUsContent({ videoUrl }: AboutUsContentProps) {
    if (!videoUrl) return null;

    const embedUrl = getVideoEmbedUrl(videoUrl);
    const direct = isDirectVideo(videoUrl);

    if (!embedUrl) return null;

    return (
        <div className="aspect-video w-full overflow-hidden rounded-[30px]">
            {direct ? (
                <video
                    src={embedUrl}
                    controls
                    className="h-full w-full object-cover"
                />
            ) : (
                <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </div>
    );
}
