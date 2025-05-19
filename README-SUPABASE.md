# Bucking Broncos Supabase Setup

## Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase dashboard under Project Settings > API.

## Required Packages

Make sure to install the required Supabase packages:

```bash
npm install @supabase/supabase-js @supabase/ssr --legacy-peer-deps
```

## Database Setup

1. Run the SQL from `initial_schema.sql` to create the tables.
2. Run the SQL from `supabase_functions.sql` to create the necessary database functions.
3. Run the SQL from `supabase_auth_setup.sql` to configure authentication and Row Level Security.

## Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings.
2. Enable Email provider under "Auth Providers".
3. Configure your site URL and redirect URLs in "URL Configuration".
4. You may want to disable email confirmations for development under "Email Auth".

## Configuration

After setting up Supabase and creating your tables:

1. Add some initial data:
   - Create an admin user through the registration form, then manually update the `is_admin` flag to `true` in the database.
   - Create a race
   - Add players to the race

2. The Row Level Security policies should already be set up by the `supabase_auth_setup.sql` script.

3. Restart your application with `npm run dev` 