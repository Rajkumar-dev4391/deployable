# Supabase Database Setup Guide

This guide will walk you through setting up your Supabase database for the MCP Chat Bot application.

## Step 1: Create a Supabase Project

1. **Go to [Supabase](https://supabase.com)** and sign up for a free account
2. **Click "New Project"**
3. **Fill in the project details:**
   - Project Name: `mcp-chat-bot`
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to your users
4. **Click "Create new project"**
5. **Wait for the project to be created** (this takes 1-2 minutes)

## Step 2: Get Your Project Credentials

Once your project is ready:

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy the following values:**
   - Project URL (starts with `https://`)
   - `anon` public key
   - `service_role` secret key (click "Reveal" to see it)

## Step 3: Set Up Environment Variables

### Frontend Environment Variables
Create `frontend/.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3000
```

### Backend Environment Variables
Create `server/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Other required variables
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_random_session_secret_here
FRONTEND_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

## Step 4: Run Database Migrations

The database migrations are already created in the `supabase/migrations/` folder. To apply them:

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your_project_ref
   ```
   (Find your project ref in your Supabase dashboard URL)

4. **Push migrations:**
   ```bash
   supabase db push
   ```

### Option B: Manual SQL Execution

If you prefer to run the SQL manually:

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste each migration file content** (in order):
   - `supabase/migrations/20250706094923_little_spring.sql`
   - `supabase/migrations/20250706094934_twilight_firefly.sql`
4. **Execute each migration** by clicking "Run"

## Step 5: Set Up Storage Bucket

1. **Go to Storage in your Supabase dashboard**
2. **Create a new bucket:**
   - Name: `attachments`
   - Public: `false` (private bucket)
3. **Set up storage policies:**
   - Go to Storage → Policies
   - Create policies for the `attachments` bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to view their own files
CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 6: Configure Row Level Security (RLS)

The migrations already set up RLS policies, but verify they're enabled:

1. **Go to Authentication → Policies**
2. **Verify these tables have RLS enabled:**
   - `users`
   - `chats`
   - `messages`
   - `attachments`
   - `auth_tokens`
   - `feedback`
   - `projects`

## Step 7: Test the Database Connection

1. **Start your backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Check the health endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **You should see a response indicating database connectivity**

## Step 8: Verify Sample Data

The migrations include sample feedback data. To verify:

1. **Go to Table Editor in Supabase**
2. **Check the `feedback` table**
3. **You should see 5 sample feedback entries**

## Database Schema Overview

Your database will have these tables:

### Core Tables
- **`users`** - User profiles from Google OAuth
- **`chats`** - Chat conversations
- **`messages`** - Individual messages in chats
- **`attachments`** - File attachments

### Feature Tables
- **`projects`** - User-created project folders
- **`feedback`** - User testimonials for login page
- **`auth_tokens`** - Google OAuth tokens
- **`user_preferences`** - User settings and preferences

### Storage
- **`attachments` bucket** - File storage for uploads

## Troubleshooting

### Common Issues

1. **"relation does not exist" errors:**
   - Make sure all migrations have been applied
   - Check that RLS is enabled on all tables

2. **Authentication errors:**
   - Verify your environment variables are correct
   - Check that the service role key has the right permissions

3. **Storage upload errors:**
   - Ensure the `attachments` bucket exists
   - Verify storage policies are set up correctly

4. **Connection errors:**
   - Double-check your Supabase URL and keys
   - Make sure your project is not paused (free tier limitation)

### Getting Help

If you encounter issues:

1. **Check Supabase logs** in your dashboard
2. **Review the API logs** in your Supabase project
3. **Check the browser console** for frontend errors
4. **Review server logs** for backend errors

## Next Steps

Once your database is set up:

1. **Configure Google OAuth** (see main README.md)
2. **Set up OpenAI API key**
3. **Start the development servers**
4. **Test the complete application**

## Production Considerations

For production deployment:

1. **Use environment-specific URLs**
2. **Set up proper backup policies**
3. **Configure monitoring and alerts**
4. **Review and adjust RLS policies**
5. **Set up database backups**

---

**Important Notes:**
- Keep your service role key secure and never expose it in frontend code
- The anon key is safe to use in frontend applications
- Free tier has limitations on database size and API calls
- Consider upgrading to Pro tier for production use