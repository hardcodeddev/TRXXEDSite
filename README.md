
# EDM Artist Hub - Supabase Backend Setup Guide

This application is configured to use Supabase for its backend, providing real-time content updates and secure admin access. Follow these steps carefully to set up your own free Supabase project and connect it to the application.

## Step 1: Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign up for a free account.
2.  On your dashboard, click **"New project"**.
3.  Give your project a **Name**, generate a secure **Database Password** (and save it somewhere safe), and choose a **Region** closest to you.
4.  Click **"Create new project"** and wait a few minutes for it to be set up.

## Step 2: Get Your API Credentials

Once your project is ready, you need to find your unique API keys.

1.  In the left sidebar of your Supabase project, click the **Settings** icon (the cog wheel).
2.  In the settings menu, click on **API**.
3.  You will see your **Project URL** and your **Project API Keys**.
4.  Find the key labeled `anon` and `public`. Click to copy it.
5.  **Keep this page open.** You will need both the URL and this `anon` key in Step 5.

## Step 3: Set Up the Database Schema

This is the most important step. You will run a single script to create all the necessary tables and relationships in your database.

1.  In the left sidebar of your Supabase project, click the **SQL Editor** icon (a page with `SQL` on it).
2.  Click **"+ New query"**.
3.  Copy the entire SQL script below and paste it into the Supabase SQL Editor.

```sql
-- 1. CREATE TABLES

-- Stores the main artist info (will only have one row)
CREATE TABLE artist_info (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  artist_name text,
  logo_url text,
  hero_image text,
  soundcloud_embed_url text,
  socials jsonb
);

-- Stores tour dates/shows
CREATE TABLE shows (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  date date,
  venue text,
  city text,
  ticket_url text
);

-- Stores music releases
CREATE TABLE releases (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text,
  image_url text
);

-- Stores the streaming links for each release
CREATE TABLE release_links (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  release_id bigint REFERENCES releases(id) ON DELETE CASCADE,
  platform text,
  url text
);

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- This is a critical security step.

ALTER TABLE artist_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_links ENABLE ROW LEVEL SECURITY;

-- 3. CREATE RLS POLICIES

-- Policy 1: Allow public, read-only access for everyone.
-- This lets your website visitors see the content.
CREATE POLICY "Allow public read access" ON artist_info FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON shows FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON releases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON release_links FOR SELECT USING (true);

-- Policy 2: Allow full access (insert, update, delete) for authenticated users.
-- This lets YOU, the logged-in admin, manage the content.
CREATE POLICY "Allow full access for authenticated users" ON artist_info FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON shows FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON releases FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access for authenticated users" ON release_links FOR ALL
USING (auth.role() = 'authenticated');

-- 4. INSERT INITIAL DATA (Optional, but recommended)
-- This adds some placeholder data so your site isn't empty.

INSERT INTO artist_info (artist_name, logo_url, hero_image, soundcloud_embed_url, socials)
VALUES (
  'NEBULA',
  'https://i.imgur.com/gSAqDIS.png',
  'https://picsum.photos/seed/nebula-hero/1920/1080',
  'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1865969688&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
  '{"instagram": "https://instagram.com", "twitter": "https://twitter.com", "facebook": "https://facebook.com", "spotify": "https://spotify.com", "soundcloud": "https://soundcloud.com"}'
);

```
4.  After pasting the code, click the green **"RUN"** button. You should see a "Success. No rows returned" message. Your database is now ready!

## Step 4: Configure Authentication

This allows you to create a secure admin user account.

1.  In the left sidebar, click the **Authentication** icon (a key).
2.  Under the **Configuration** section, click **Providers**.
3.  Click on the **Email** provider to expand it.
4.  Ensure the `Enable Email Provider` toggle is **ON**.
5.  **IMPORTANT:** Turn **OFF** the toggle for `Confirm email`. This simplifies the sign-up process so you don't have to verify your email to log in for the first time.

## Step 5: Configure the Application

Now, you'll connect your website code to your new Supabase backend.

1.  In the project's code, create a new file named `supabase.ts` inside a new `supabase` directory.
2.  The path should be: `supabase/supabase.ts`.
3.  Copy the code below into your new `supabase/supabase.ts` file.
4.  Replace the placeholder values `'YOUR_SUPABASE_URL'` and `'YOUR_SUPABASE_ANON_KEY'` with the credentials you copied in Step 2.

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types'; // This will be created in the next step

// 🛑 Replace with your own Supabase project URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Step 6: Create Your Admin Account

Your application is now fully configured. The final step is to create your admin user account.

1.  Run the application locally or open the deployed website.
2.  Navigate to the admin panel by adding `/#admin` to the end of the URL (e.g., `http://localhost:3000/#admin`).
3.  You will see a login form. Click on the **"Sign Up"** tab.
4.  Enter your email and create a secure password.
5.  Click **"Sign Up"**. This will create your account and log you in for the first time.

**That's it!** You are now logged into the admin panel and can manage your website's content in real-time. For all future visits, simply go to the `/#admin` URL and use the **"Sign In"** tab with the credentials you just created.

