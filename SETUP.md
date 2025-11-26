# AuroraServices Setup Guide

## Authentication System

The application uses **Email/Password Authentication** via Supabase for secure access.

### Sign Up (Create Account)

1. Go to the login page
2. Click the "Sign Up" link/button
3. Enter your email address and create a secure password
4. Click "Sign Up"
5. Your account is created and you're automatically signed in as a **customer**

### Sign In (Log In)

1. Go to the login page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected based on your role:
   - **Customers** → Home page
   - **Admins** → Admin dashboard

## Admin Account Setup

### Creating Your First Admin Account

1. **Sign up as a regular customer first**
   - Go to login page
   - Click "Sign Up"
   - Enter your admin email (e.g., `admin@auroraservices.com`)
   - Create a strong password
   - Click "Sign Up"
   - You're now logged in as a customer

2. **Grant admin privileges in Supabase**
   - Open your [Supabase Dashboard](https://app.supabase.com/)
   - Select your project "auroraservices"
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"
   - Copy and paste this query:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'admin@auroraservices.com';
   ```
   - Click "Run" button
   - You should see "1 row updated"

3. **Log out and log back in**
   - Scroll down to the Navbar and click "Sign Out"
   - Go back to login page
   - Sign in again with your admin email and password
   - You'll now have full access to the admin dashboard

## Admin Panel Features

Once logged in as admin, you have full control over your store:

### Dashboard
- View key metrics: Total products, orders, reviews, and pending orders
- Quick overview of your store performance

### Products Management
- **Add New Product**: Create products with name, category, description, prices, stock, image URL, and featured status
- **Search & Filter**: Search by product name or category, filter by stock status or featured products
- **Quick Actions**:
  - Toggle featured status with star button
  - Increase/decrease stock with +/- buttons
  - View real-time stock status (In Stock/Low Stock/Out of Stock)
- **Edit Products**: Modify all product details
- **Delete Products**: Remove products from catalog

### Stock Management
- See stock levels at a glance with color-coded badges
- Quickly adjust inventory with +/- buttons
- Products show "Out of Stock" when inventory is 0
- Products show "Low Stock" when inventory is below 10

### Pricing Control
- Set original and sale prices for each product
- Display strikethrough original price on storefront
- Highlight current sale price

### Orders Management
- View all customer orders
- See order number, product, customer email, amount, and status
- Track completed and pending orders

### Reviews Management
- View all customer reviews with ratings
- Delete inappropriate or spam reviews

### Site Settings
- Update hero image URL
- Modify Discord server link
- Edit hero heading, subheading, and paragraph text

## Customizable Features

Through the admin panel, you can customize:

- **Hero Image**: Change the main banner image on the homepage
- **Discord Link**: Update the Discord server invitation link
- **Hero Content**: Modify the heading, subheading, and paragraph text
- **Products**: Add, edit, or delete products
- **Reviews**: Manage customer reviews
- **Orders**: View and manage customer orders

## Default Settings

The application comes pre-configured with:
- Hero image from Unsplash
- Discord link: https://discord.gg/auroraaccounts
- Sample products and reviews
- Email/password authentication via Supabase

## Authentication Features

- Secure email/password authentication via Supabase
- No magic links or email verification required
- Instant login and redirect
- Automatic user creation with admin/customer roles
- Role-based access control (admin/customer)
- Persistent sessions (stay logged in across page refreshes)
- Logout functionality

## Site Stats

- **Products**: 5
- **Happy Customers**: 300+
- **Vouches**: 900
- **Average Rating**: 4.8/5 (mostly 4 and 5 stars)

## Tech Stack

- React (JSX)
- Supabase (Database)
- Vite (Build tool)
- Pure CSS (No Tailwind)
