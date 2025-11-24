# AuroraServices Setup Guide

## Admin Account Setup

The application uses **Email-based Authentication** (no password required).

To create an admin account:

1. Go to the login page and enter your email (e.g., `admin@auroraservices.com`)
2. Click "Sign In" - you'll be logged in automatically
3. After signing in for the first time, run this SQL query in Supabase SQL Editor to grant admin privileges:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@auroraservices.com';
```

4. Log out and log back in to access the admin panel.

## How to Access Admin Panel

1. Navigate to the login page
2. Enter your admin email address
3. Click "Sign In"
4. You'll be automatically redirected to the admin panel

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
