# AuroraServices Setup Guide

## Admin Account Setup

The application now uses **Magic Link Authentication** (passwordless login).

To create an admin account:

1. Click "Sign In / Sign Up" on the login page
2. Enter your email (e.g., `admin@auroraservices.com`) in the popup
3. Check your email inbox for the magic link
4. Click the magic link to sign in
5. After signing in for the first time, run this SQL query in Supabase SQL Editor to grant admin privileges:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@auroraservices.com';
```

6. Refresh the page or log out and log back in to access the admin panel.

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
- Magic link authentication (passwordless login)

## Authentication Features

- Passwordless login via magic links sent to email
- No password management required
- Secure email-based authentication
- Automatic user creation on first login
- Role-based access control (admin/customer)

## Tech Stack

- React (JSX)
- Supabase (Database & Authentication with Magic Links)
- Vite (Build tool)
- Pure CSS (No Tailwind)
