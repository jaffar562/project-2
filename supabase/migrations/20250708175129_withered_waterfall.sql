/*
  # Admin Dashboard Schema

  1. New Tables
    - `admin_users` - Admin authentication and roles
    - `hosting_plans` - Minecraft hosting plans management
    - `vps_plans` - VPS hosting plans management  
    - `domain_pricing` - Domain extension pricing
    - `website_content` - Dynamic website content
    - `orders` - Order management and tracking
    - `customers` - Customer information
    - `analytics_data` - Website analytics and metrics
    - `system_settings` - Global system configuration

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access control
    - Secure sensitive data access

  3. Features
    - Plan management with real-time updates
    - Dynamic pricing controls
    - Content management system
    - Order tracking and analytics
    - Customer management
    - System configuration
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions jsonb DEFAULT '{}',
  last_login timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hosting Plans Table
CREATE TABLE IF NOT EXISTS hosting_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('budget', 'powered', 'premium')),
  price_inr integer NOT NULL,
  price_usd integer,
  ram text NOT NULL,
  cpu text NOT NULL,
  storage text NOT NULL,
  location text NOT NULL DEFAULT 'Mumbai',
  features jsonb DEFAULT '[]',
  addon_unit_price integer DEFAULT 30,
  addon_backup_price integer DEFAULT 25,
  is_active boolean DEFAULT true,
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- VPS Plans Table
CREATE TABLE IF NOT EXISTS vps_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('cheap', 'powered')),
  price_inr integer NOT NULL,
  price_usd integer,
  ram text NOT NULL,
  cpu text NOT NULL,
  storage text NOT NULL,
  bandwidth text NOT NULL,
  processor text,
  network text,
  features jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  is_popular boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Domain Pricing Table
CREATE TABLE IF NOT EXISTS domain_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tld text UNIQUE NOT NULL,
  price_inr integer NOT NULL,
  price_usd integer,
  is_featured boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_discount boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Website Content Table
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  content jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text UNIQUE NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('minecraft', 'vps', 'domain')),
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  discord_username text,
  plan_details jsonb NOT NULL,
  total_amount integer NOT NULL,
  currency text DEFAULT 'INR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'cancelled', 'completed')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  discord_username text,
  total_orders integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  last_order_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics Data Table
CREATE TABLE IF NOT EXISTS analytics_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(metric_name, metric_date)
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vps_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can manage all admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- Hosting Plans Policies
CREATE POLICY "Anyone can read active hosting plans"
  ON hosting_plans
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage hosting plans"
  ON hosting_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- VPS Plans Policies
CREATE POLICY "Anyone can read active VPS plans"
  ON vps_plans
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage VPS plans"
  ON vps_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Domain Pricing Policies
CREATE POLICY "Anyone can read active domain pricing"
  ON domain_pricing
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage domain pricing"
  ON domain_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Website Content Policies
CREATE POLICY "Anyone can read active website content"
  ON website_content
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage website content"
  ON website_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Orders Policies
CREATE POLICY "Admins can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Customers Policies
CREATE POLICY "Admins can manage all customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Analytics Data Policies
CREATE POLICY "Admins can manage analytics data"
  ON analytics_data
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- System Settings Policies
CREATE POLICY "Anyone can read public system settings"
  ON system_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Insert default data
INSERT INTO hosting_plans (name, plan_type, price_inr, ram, cpu, storage, features, sort_order) VALUES
('Dirt Plan', 'budget', 49, '2GB', '100% CPU', '5GB SSD', '["Free DDoS Protection"]', 1),
('Wood Plan', 'budget', 99, '4GB', '150% CPU', '10GB SSD', '["Free DDoS Protection"]', 2),
('Stone Plan', 'budget', 159, '6GB', '200% CPU', '15GB SSD', '["Free DDoS Protection"]', 3);

INSERT INTO vps_plans (name, plan_type, price_inr, price_usd, ram, cpu, storage, bandwidth, features, sort_order) VALUES
('Stone Plan', 'cheap', 270, 2, '2GB', '1 vCPU', '20GB SSD', '1TB', '["Basic DDoS Protection", "Root Access", "Instant Setup"]', 1),
('Iron Plan', 'cheap', 455, 3, '4GB', '2 vCPU', '40GB SSD', '2TB', '["Basic DDoS Protection", "Root Access", "Instant Setup"]', 2);

INSERT INTO domain_pricing (tld, price_inr, is_featured, sort_order) VALUES
('.com', 999, true, 1),
('.in', 699, false, 2),
('.org', 799, false, 3),
('.net', 899, false, 4);

INSERT INTO website_content (section, key, content) VALUES
('hero', 'title', '{"text": "Power Your Digital Dreams"}'),
('hero', 'subtitle', '{"text": "Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions designed specifically for Indian users."}'),
('company', 'name', '{"text": "Demon Node™"}'),
('company', 'tagline', '{"text": "Premium Hosting Solutions"}');

INSERT INTO system_settings (key, value, description, is_public) VALUES
('site_maintenance', '{"enabled": false, "message": "Site is under maintenance"}', 'Site maintenance mode', true),
('discord_webhook', '{"url": "https://discord.com/api/webhooks/1390708963229831180/iIcQEkMPv1_bWKzvg58UWBq-c84msuMit4Sh6aw5xa4HaCYyUgdl3fA82W8g2vZLofsp"}', 'Discord webhook URL', false),
('payment_methods', '{"enabled": ["discord"], "default": "discord"}', 'Available payment methods', true);