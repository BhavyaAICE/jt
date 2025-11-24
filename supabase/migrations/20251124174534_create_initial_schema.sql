/*
  # Create AuroraServices Database Schema

  ## Tables Created
  
  1. **users**
    - `id` (uuid, primary key) - User ID from auth.users
    - `email` (text) - User email
    - `role` (text) - User role (admin, customer)
    - `created_at` (timestamp) - Account creation time
  
  2. **products**
    - `id` (uuid, primary key) - Product ID
    - `name` (text) - Product name
    - `category` (text) - Product category
    - `description` (text) - Product description
    - `price` (numeric) - Original price
    - `sale_price` (numeric) - Sale price
    - `stock` (integer) - Stock quantity
    - `image` (text) - Product image URL
    - `featured` (boolean) - Featured product flag
    - `created_at` (timestamp)
  
  3. **reviews**
    - `id` (uuid, primary key) - Review ID
    - `author` (text) - Review author name
    - `rating` (integer) - Rating (1-5)
    - `comment` (text) - Review comment
    - `created_at` (timestamp)
  
  4. **orders**
    - `id` (uuid, primary key) - Order ID
    - `order_number` (text) - Order number (ORD-XXX)
    - `product_id` (uuid) - Reference to products
    - `customer_email` (text) - Customer email
    - `amount` (numeric) - Order amount
    - `status` (text) - Order status
    - `created_at` (timestamp)
  
  5. **site_settings**
    - `id` (uuid, primary key) - Settings ID
    - `key` (text, unique) - Setting key
    - `value` (text) - Setting value
    - `updated_at` (timestamp)
  
  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users
  - Admin-only policies for management operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  sale_price numeric NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  image text NOT NULL,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_email text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    customer_email = (SELECT email FROM users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage orders"
  ON orders FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_image', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=600&fit=crop'),
  ('discord_link', 'https://discord.gg/auroraaccounts'),
  ('hero_heading', 'Unlock Premium Digital Services with AuroraServices'),
  ('hero_subheading', 'Your trusted platform for high-quality digital assets, game services, premium accounts, tools, and exclusive solutions.'),
  ('hero_paragraph', 'AuroraServices is a leading online provider of secure, fast, and premium digital services. From game tools and high-value accounts to private utilities and exclusive digital assets, we deliver top-tier products designed for performance and reliability.')
ON CONFLICT (key) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, category, description, price, sale_price, stock, image, featured) VALUES
  ('Full Access Accounts', 'Gaming Accounts', 'Premium full access gaming accounts with verified ownership', 14.99, 8.99, 50, 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop', true),
  ('Fortnite Private', 'Game Cheats', 'Private undetected Fortnite enhancements with regular updates', 14.99, 9.99, 30, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', true),
  ('Fortnite Ultimate', 'Game Cheats', 'Ultimate edition with all premium features unlocked', 19.99, 8.99, 25, 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop', true),
  ('Temp Spoofer', 'Security Tools', 'Temporary hardware ID spoofing tool for enhanced privacy', 14.99, 8.99, 100, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop', true),
  ('Perm Spoofer', 'Security Tools', 'Permanent spoofer with lifetime updates and support', 49.99, 24.99, 15, 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=300&fit=crop', true),
  ('Premium Bundle', 'Bundles', 'Complete package including all premium tools and accounts', 69.99, 39.99, 10, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', true)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (author, rating, comment, created_at) VALUES
  ('Anonymous', 1, 'xxx gets taken back almost instantly', '2025-11-25'),
  ('John D.', 5, 'Very good', '2025-06-22'),
  ('Mike R.', 5, 'Is accounts still', '2025-06-22'),
  ('Sarah K.', 5, 'Best service ever! Fast delivery and great support.', '2025-04-22')
ON CONFLICT DO NOTHING;