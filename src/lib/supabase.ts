import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface HostingPlan {
  id: string;
  name: string;
  plan_type: 'budget' | 'powered' | 'premium';
  price_inr: number;
  price_usd?: number;
  ram: string;
  cpu: string;
  storage: string;
  location: string;
  features: string[];
  addon_unit_price: number;
  addon_backup_price: number;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface VPSPlan {
  id: string;
  name: string;
  plan_type: 'cheap' | 'powered';
  price_inr: number;
  price_usd?: number;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  processor?: string;
  network?: string;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DomainPricing {
  id: string;
  tld: string;
  price_inr: number;
  price_usd?: number;
  is_featured: boolean;
  is_trending: boolean;
  is_discount: boolean;
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_id: string;
  order_type: 'minecraft' | 'vps' | 'domain';
  customer_email: string;
  customer_name: string;
  discord_username?: string;
  plan_details: any;
  total_amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'active' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  discord_username?: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebsiteContent {
  id: string;
  section: string;
  key: string;
  content: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
  metadata: any;
  created_at: string;
}