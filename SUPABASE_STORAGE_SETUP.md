# Supabase Storage Setup Guide

## Missing Storage Bucket Setup

You need to create the `attachments` storage bucket in your Supabase project. Here's how:

### Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
2. **Navigate to Storage** in the left sidebar
3. **Click "New Bucket"**
4. **Configure the bucket:**
   - **Bucket name**: `attachments`
   - **Public**: `false` (keep it private)
   - **File size limit**: `10MB` (or your preferred limit)
   - **Allowed MIME types**: Leave empty for all types
5. **Click "Create bucket"**

### Step 2: Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security policies:

1. **Go to Storage → Policies**
2. **Click "New Policy"** for the `attachments` bucket
3. **Create these policies:**

#### Policy 1: Allow authenticated users to upload files
```sql
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow authenticated users to view their own files
```sql
CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3: Allow authenticated users to delete their own files
```sql
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Verify Storage Setup

1. **Go to Storage → attachments bucket**
2. **Try uploading a test file** to verify it works
3. **Check that the policies are active** in the Policies tab

### Step 4: Test File Upload

After setting up the storage bucket, test the file upload functionality:

1. **Start your application**
2. **Go to a chat**
3. **Try uploading a file** using the paperclip icon
4. **Check if the file appears** in the Supabase Storage bucket

## Troubleshooting

### Common Issues:

1. **"Bucket not found" errors:**
   - Make sure the bucket name is exactly `attachments`
   - Verify the bucket exists in your Supabase dashboard

2. **"Permission denied" errors:**
   - Check that all three storage policies are created
   - Verify the policies use the correct bucket_id

3. **File upload fails:**
   - Check file size limits (default is 10MB)
   - Verify MIME types are allowed
   - Check browser console for detailed errors

### Quick Verification Commands:

You can test the storage setup with these SQL queries in your Supabase SQL Editor:

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'attachments';

-- Check storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'attachments';

-- Check if you can list objects (should return empty initially)
SELECT * FROM storage.objects WHERE bucket_id = 'attachments' LIMIT 5;
```

## Next Steps

Once the storage bucket is set up:

1. ✅ **Test file uploads** in the chat interface
2. ✅ **Verify files are stored** in the correct user folders
3. ✅ **Check file download/viewing** functionality
4. ✅ **Test file deletion** when messages are deleted

The application should now work correctly with file attachments!