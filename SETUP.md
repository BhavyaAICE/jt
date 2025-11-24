# AuroraServices Setup Guide

## Admin Account Setup

To create an admin account, you need to:

1. Sign up through the login page with email: `admin@auroraservices.com` and password: `admin123`

2. After signing up, run this SQL query in Supabase SQL Editor to grant admin privileges:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin@auroraservices.com';
```

3. Log out and log back in to see the admin panel.

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
- Fully functional authentication system

## Tech Stack

- React (JSX)
- Supabase (Database & Authentication)
- Vite (Build tool)
- Pure CSS (No Tailwind)
