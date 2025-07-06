const fs = require('fs').promises;
const path = require('path');
const supabase = require('../config/supabase');

class FileParser {
  static async parseFile(storagePath, mimeType, originalName) {
    try {
      console.log(`📄 Parsing file: ${originalName} (${mimeType})`);
      
      // Check if file exists in storage
      const { data: fileList, error: listError } = await supabase.storage
        .from('attachments')
        .list(path.dirname(storagePath), {
          search: path.basename(storagePath)
        });
      
      if (listError || !fileList || fileList.length === 0) {
        throw new Error(`File not found in storage: ${storagePath}`);
      }
      
      // Download file from Supabase Storage
      const { data: fileData, error } = await supabase.storage
        .from('attachments')
        .download(storagePath);
      
      if (error) {
        throw new Error(`Failed to download file: ${error.message}`);
      }
      
      // Convert blob to buffer
      const buffer = Buffer.from(await fileData.arrayBuffer());
      
      // Parse based on file type
      let content = '';
      
      if (mimeType.startsWith('text/')) {
        content = await this.parseTextFile(buffer);
      } else if (mimeType === 'application/pdf') {
        content = await this.parsePDF(buffer, originalName);
      } else if (mimeType.includes('word') || mimeType.includes('document')) {
        content = await this.parseWordDocument(buffer, originalName);
      } else if (mimeType.startsWith('image/')) {
        content = await this.parseImage(buffer, originalName);
      } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
        content = await this.parseSpreadsheet(buffer, originalName);
      } else {
        content = `File "${originalName}" (${mimeType}) uploaded successfully. File size: ${Math.floor(buffer.length / 1024)}KB. Content parsing not supported for this file type, but the file is available for download.`;
      }
      
      console.log(`✅ File parsed successfully: ${content.length} characters extracted`);
      return content;
      
    } catch (error) {
      console.error(`❌ Error parsing file ${originalName}:`, error);
      return `Error parsing file "${originalName}": ${error.message}. The file was uploaded but content extraction failed.`;
    }
  }
  
  static async parseTextFile(buffer) {
    try {
      return buffer.toString('utf-8');
    } catch (error) {
      return buffer.toString('latin1'); // Fallback encoding
    }
  }
  
  static async parsePDF(buffer, filename) {
    try {
      const sizeKB = Math.floor(buffer.length / 1024);
      return `PDF document "${filename}" uploaded successfully (${sizeKB}KB). 

Content Summary: This appears to be a PDF document. To extract text content from PDFs, additional parsing libraries would need to be installed on the server.

The file is available for:
- Download and viewing
- Sharing with others
- Processing by vision-capable AI models
- Manual review and analysis

You can ask me to help you work with this document in other ways, such as creating summaries based on the filename or helping you organize it.`;
    } catch (error) {
      return `PDF parsing error: ${error.message}`;
    }
  }
  
  static async parseWordDocument(buffer, filename) {
    try {
      const sizeKB = Math.floor(buffer.length / 1024);
      return `Word document "${filename}" uploaded successfully (${sizeKB}KB).

Content Summary: This appears to be a Microsoft Word document. To extract text content from Word documents, additional parsing libraries would need to be installed on the server.

The file is available for:
- Download and viewing
- Sharing via Google Drive
- Converting to Google Docs format
- Manual review and editing

You can ask me to help you work with this document, such as:
- Creating a new Google Doc with similar content
- Organizing it in your Google Drive
- Sharing it with specific people`;
    } catch (error) {
      return `Word document parsing error: ${error.message}`;
    }
  }
  
  static async parseSpreadsheet(buffer, filename) {
    try {
      const sizeKB = Math.floor(buffer.length / 1024);
      return `Spreadsheet "${filename}" uploaded successfully (${sizeKB}KB).

Content Summary: This appears to be a spreadsheet file (Excel/CSV). To extract data from spreadsheets, additional parsing libraries would need to be installed on the server.

The file is available for:
- Download and viewing
- Converting to Google Sheets
- Data analysis and processing
- Sharing with team members

You can ask me to help you work with this spreadsheet, such as:
- Creating a new Google Sheet with similar structure
- Analyzing data patterns
- Setting up automated reports`;
    } catch (error) {
      return `Spreadsheet parsing error: ${error.message}`;
    }
  }
  
  static async parseImage(buffer, filename) {
    try {
      const sizeKB = Math.floor(buffer.length / 1024);
      const dimensions = await this.getImageDimensions(buffer);
      
      return `Image "${filename}" uploaded successfully (${sizeKB}KB${dimensions ? `, ${dimensions}` : ''}).

Content Summary: This is an image file that has been successfully uploaded and is ready for processing.

The image can be:
- Viewed and downloaded
- Analyzed by AI vision models for content description
- Shared via Google Drive
- Used in documents and presentations
- Processed for text extraction (OCR) if it contains text

You can ask me to:
- Describe what's in the image
- Extract any text from the image
- Help organize it in your Google Drive
- Use it in creating documents or presentations`;
    } catch (error) {
      return `Image processing error: ${error.message}`;
    }
  }
  
  static async getImageDimensions(buffer) {
    try {
      // Basic image dimension detection would require additional libraries
      // For now, return null and let the main function handle it
      return null;
    } catch (error) {
      return null;
    }
  }
  
  static async getFileMetadata(storagePath) {
    try {
      const { data, error } = await supabase.storage
        .from('attachments')
        .list(path.dirname(storagePath), {
          search: path.basename(storagePath)
        });
      
      if (error) throw error;
      
      const fileInfo = data.find(file => file.name === path.basename(storagePath));
      return fileInfo || null;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }
}

module.exports = FileParser;