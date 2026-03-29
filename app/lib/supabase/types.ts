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
  video: string;
  service_price?: number;
  is_discount_active?: boolean;
  discount_price?: number;
  whatsapp_number?: string;
};
