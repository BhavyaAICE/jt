# AuroraServices Setup Guide

## Admin Account Setup

The application uses **Email-based Authentication** (no password required).

### Creating Your First Admin Account

1. **Sign up as a regular user first**
   - Go to login page
   - Enter your secret admin email (e.g., `admin@auroraservices.com`)
   - Click "Sign In" - you'll be logged in automatically
   - You're now logged in as a customer

2. **Grant admin privileges via Supabase**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Run this query to promote your email to admin:
   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'admin@auroraservices.com';
   ```

3. **Log out and log back in**
   - You'll now have access to the admin panel automatically

## How to Access Admin Panel

1. Navigate to the login page
2. Enter your admin email address (must have admin role)
3. Click "Sign In"
4. You'll be automatically redirected to the admin panel

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
- Email-based authentication (no password required)

## Authentication Features

- Direct email-based login (no password needed)
- No magic links or email verification
- Instant authentication
- Automatic user creation on first login
- Role-based access control (admin/customer)

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
