import Footer from "./components/ui/Footer";
import HeroSection from "./components/ui/HeroSection";
import ServiceSection from "./components/ui/ServiceSection";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import { createClient } from "./lib/supabase/server";
import type { Service, Config } from "./lib/supabase/types";

export const dynamic = 'force-dynamic';

async function getConfig(): Promise<Config | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("config")
      .select("title, hero_title, hero_subtitle, background_image, image_1, image_2, video, service_price, is_discount_active, discount_price, whatsapp_number, about_us_title, about_us_subtitle, about_us_description, about_us_full_description, about_us_video")
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

async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, title, description, image, checklist, price, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getServices:", error);
    return [];
  }
}

export default async function HomePage() {
  const [config, services] = await Promise.all([getConfig(), getServices()]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <HeroSection config={config} />
      <ServiceSection services={services} />
      <Footer />
      <WhatsAppButton whatsappNumber={config?.whatsapp_number} />
    </main>
  );
}