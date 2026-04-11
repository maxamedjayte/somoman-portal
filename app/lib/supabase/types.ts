export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  checklist: string[];
  price: number;
  is_active: boolean;
  created_at?: string;
};

export type Config = {
  title: string;
  hero_title: string;
  hero_subtitle: string;
  background_image: string;
  image_1?: string;
  image_2?: string;
  video: string;
  service_price?: number;
  is_discount_active?: boolean;
  discount_price?: number;
  whatsapp_number?: string;
  about_us_title?: string;
  about_us_subtitle?: string;
  about_us_description?: string;
  about_us_full_description?: string;
  about_us_video?: string;
};

export type WorkSchedule = {
  id?: string;
  day_of_week: number;
  is_working_day: boolean;
  start_time?: string | null;
  end_time?: string | null;
  max_requests: number;
  created_at?: string;
  updated_at?: string;
};
