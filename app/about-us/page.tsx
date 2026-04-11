import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import AboutUsContent from "./AboutUsContent";

export const dynamic = 'force-dynamic';

type AboutConfig = {
  title: string;
  about_us_title?: string;
  about_us_subtitle?: string;
  about_us_description?: string;
  about_us_full_description?: string;
  about_us_video?: string;
  video?: string;
};

async function getConfig(): Promise<AboutConfig | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("config")
      .select("title, about_us_title, about_us_subtitle, about_us_description, about_us_full_description, about_us_video, video")
      .single();

    if (error) {
      console.error("Error fetching config:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getConfig:", error);
    return null;
  }
}

export default async function AboutUsPage() {
  const config = await getConfig();

  const aboutTitle = config?.about_us_title || "About SomOman";
  const aboutSubtitle = config?.about_us_subtitle || "Your trusted partner for services in Oman";
  const aboutDescription = config?.about_us_description || "";
  const aboutFullDescription = config?.about_us_full_description || "";
  const videoUrl = config?.about_us_video || config?.video || "";

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#003527] to-emerald-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <Link href="/" className="mb-6 inline-block text-sm font-semibold text-white/80 hover:text-white hover:underline">
            ← Back to home
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{aboutTitle}</h1>
          {aboutSubtitle && (
            <p className="mt-3 max-w-2xl text-base text-white/80 md:text-lg">{aboutSubtitle}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Video Section */}
            {videoUrl && (
              <div className="overflow-hidden rounded-[30px] bg-black shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                <AboutUsContent videoUrl={videoUrl} />
              </div>
            )}

            {/* Description */}
            {(aboutDescription || aboutFullDescription) && (
              <div className="rounded-[30px] bg-white p-6 md:p-8 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
                {aboutDescription && (
                  <p className="text-base leading-7 text-[#191c1d]/80 md:text-lg md:leading-8">{aboutDescription}</p>
                )}
                {aboutFullDescription && (
                  <div className="mt-6 space-y-4 text-sm leading-7 text-[#191c1d]/70 md:text-base md:leading-8">
                    {aboutFullDescription.split('\n').map((paragraph, i) => (
                      paragraph.trim() ? <p key={i}>{paragraph}</p> : null
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-[30px] bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-6">
              <h3 className="text-lg font-extrabold text-[#003527]">Need Our Services?</h3>
              <p className="mt-2 text-sm text-[#191c1d]/70">
                Book a service today and let us help you with your needs in Oman.
              </p>
              <Link
                href="/request/apply"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#003527] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#003527]/20 transition hover:-translate-y-0.5"
              >
                Book a Service
              </Link>
            </div>

            <div className="rounded-[30px] bg-white p-6 shadow-[0_20px_45px_rgba(25,28,29,0.05)]">
              <h3 className="text-lg font-extrabold text-[#191c1d]">Contact Us</h3>
              <p className="mt-2 text-sm text-[#191c1d]/70">
                Have questions? Reach out to us directly.
              </p>
              <Link
                href="/#contact"
                className="mt-4 inline-block text-sm font-semibold text-[#003527] hover:underline"
              >
                Go to Contact Section →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
