const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class FileUploadService {
  static async uploadFile(file, userId) {
    try {
      console.log(`📤 Uploading file: ${file.originalname} for user: ${userId}`);
      
      // Generate unique filename with user folder structure
      const fileExtension = path.extname(file.originalname);
      const uniqueFilename = `${userId}/${uuidv4()}${fileExtension}`;
      
      // Check if bucket exists first
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
        throw new Error('Storage service unavailable');
      }
      
      const attachmentsBucket = buckets.find(bucket => bucket.name === 'attachments');
      if (!attachmentsBucket) {
        throw new Error('Attachments storage bucket not found. Please create the "attachments" bucket in Supabase Storage.');
      }
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(uniqueFilename, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }
      
      console.log(`✅ File uploaded successfully: ${data.path}`);
      
      // Generate a proper filename for database storage
      const dbFilename = `${uuidv4()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      return {
        storagePath: data.path,
        filename: dbFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  static async getFileUrl(storagePath) {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry
      
      if (error) {
        throw error;
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error('Get file URL error:', error);
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }

  static async downloadFile(storagePath) {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(storagePath);
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('File download error:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  static async deleteFile(storagePath) {
    try {
      const { error } = await supabase.storage
        .from('attachments')
        .remove([storagePath]);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  static async checkStorageSetup() {
    try {
      // Check if attachments bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        return { success: false, error: error.message };
      }
      
      const attachmentsBucket = buckets.find(bucket => bucket.name === 'attachments');
      if (!attachmentsBucket) {
        return { 
          success: false, 
          error: 'Attachments bucket not found. Please create it in Supabase Storage.' 
        };
      }
      
      return { success: true, bucket: attachmentsBucket };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = FileUploadService;