/**
 * File Upload API for Tencent Cloud COS
 * Supports receiving various file types via multipart/form-data
 * Implements file size limits, type validation, and security controls
 */

const busboy = require('busboy');
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const crypto = require('crypto');

// Tencent Cloud COS Configuration
const cosConfig = {
  SecretId: process.env.COS_SECRET_ID || 'your-secret-id',      // Replace with your SecretId
  SecretKey: process.env.COS_SECRET_KEY || 'your-secret-key',  // Replace with your SecretKey
  Region: process.env.COS_REGION || 'ap-guangzhou',            // Replace with your region
  Bucket: process.env.COS_BUCKET || 'your-bucket-name',        // Replace with your bucket name
};

// Initialize COS instance
const cos = new COS(cosConfig);

// Global file size limit
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for all file types

// File extensions by MIME type (for filename generation)
const ALLOWED_FILE_TYPES = {
  // Image files
  'image/jpeg': { ext: '.jpg' },
  'image/png': { ext: '.png' },
  'image/gif': { ext: '.gif' },
  'image/webp': { ext: '.webp' },
  'image/svg+xml': { ext: '.svg' },
  
  // Video files
  'video/mp4': { ext: '.mp4' },
  'video/webm': { ext: '.webm' },
  'video/quicktime': { ext: '.mov' },
  
  // Audio files
  'audio/mpeg': { ext: '.mp3' },
  'audio/wav': { ext: '.wav' },
  'audio/ogg': { ext: '.ogg' },
  
  // Document files
  'application/pdf': { ext: '.pdf' },
  'application/msword': { ext: '.doc' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: '.docx' },
  'application/vnd.ms-excel': { ext: '.xls' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: '.xlsx' },
  
  // Compressed files
  'application/zip': { ext: '.zip' },
  'application/x-rar-compressed': { ext: '.rar' },
  
  // Generic binary
  'application/octet-stream': { ext: '.bin' },
};

/**
 * Generate a safe filename
 * @param {string} originalFilename - Original filename
 * @param {string} mimeType - File MIME type
 * @returns {string} Safe filename
 */
function generateSafeFilename(originalFilename, mimeType) {
  // Get file type information
  let fileExt;
  
  // First try to get file type information from validateFile
  const validation = validateFile(mimeType, 0); // Pass 0 as file size, just to get file type information
  if (validation.valid && validation.fileTypeInfo) {
    fileExt = validation.fileTypeInfo.ext;
  } else {
    // If no matching type information, try to get extension from original filename
    fileExt = path.extname(originalFilename);
    // If original filename has no extension, set a default extension based on MIME type prefix
    if (!fileExt) {
      const mimePrefix = mimeType.split('/')[0];
      if (mimePrefix === 'image') fileExt = '.img';
      else if (mimePrefix === 'video') fileExt = '.vid';
      else if (mimePrefix === 'audio') fileExt = '.aud';
      else fileExt = '.bin'; // Default binary file extension
    }
  }
  
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomString}${fileExt}`;
}

/**
 * Validate file size only (no type validation)
 * @param {string} mimeType - File MIME type (used only for extension determination)
 * @param {number} fileSize - File size (bytes)
 * @returns {Object} Validation result
 */
function validateFile(mimeType, fileSize) {
  // Get file type info for extension
  let fileTypeInfo = ALLOWED_FILE_TYPES[mimeType];
  
  // If no exact match, determine extension by MIME type prefix
  if (!fileTypeInfo) {
    const mimePrefix = mimeType.split('/')[0];
    
    // Set appropriate extension based on general file type
    if (mimePrefix === 'image') {
      fileTypeInfo = { ext: '.img' };
    } else if (mimePrefix === 'video') {
      fileTypeInfo = { ext: '.vid' };
    } else if (mimePrefix === 'audio') {
      fileTypeInfo = { ext: '.aud' };
    } else {
      // For any other type, use generic binary extension
      fileTypeInfo = { ext: '.bin' };
    }
  }
  
  // All file types are allowed - only check size against global limit
  
  // Check if file size exceeds global limit
  if (fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds limit: ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  return { valid: true, fileTypeInfo };
}

/**
 * Upload file to Tencent Cloud COS
 * @param {Object} fileData - File data
 * @param {string} filename - Filename
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} Upload result
 */
async function uploadToCOS(fileData, filename, mimeType) {
  return new Promise((resolve, reject) => {
    // Build file path, store by date and file type
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fileType = mimeType.split('/')[0];
    
    const key = `uploads/${fileType}/${year}${month}${day}/${filename}`;
    
    cos.putObject({
      Bucket: cosConfig.Bucket,
      Region: cosConfig.Region,
      Key: key,
      Body: fileData,
      ContentType: mimeType,
      // Optional: Set file access permissions
      // ACL: 'public-read',
    }, (err, data) => {
      if (err) {
        console.error('Failed to upload to COS:', err);
        reject(err);
        return;
      }
      
      // Build file access URL
      const fileUrl = `https://${cosConfig.Bucket}.cos.${cosConfig.Region}.myqcloud.com/${key}`;
      
      resolve({
        url: fileUrl,
        key: key,
        etag: data.ETag,
        size: fileData.length,
        mimeType: mimeType,
        originalName: filename
      });
    });
  });
}

/**
 * Handle file upload request
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function onRequest(context) {
  const method = context.request.method;
  const req = context.request;
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Please use POST request.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get Content-Type - accept any content type for upload
  const contentType = req.headers['content-type'] || '';
  const isBinaryUpload = !contentType.includes('multipart/form-data');
  try {
    return new Promise((resolve, reject) => {
      // Process binary file upload
      if (isBinaryUpload) {
        console.log('Processing binary file upload');
        const chunks = [];
        let fileSize = 0;
        
        req.on('data', (chunk) => {
          chunks.push(chunk);
          fileSize += chunk.length;
          
          // Validate file size only
          const validation = validateFile(contentType, fileSize);
          if (!validation.valid) {
            // If file is too large, stop receiving
            req.destroy();
            resolve(new Response(JSON.stringify({ error: validation.error }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        });
        
        req.on('end', async () => {
          try {
            if (fileSize === 0) {
              resolve(new Response(JSON.stringify({ error: 'Empty file received' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
              }));
              return;
            }
            
            // Merge file data
            const fileData = Buffer.concat(chunks);
            
            // Generate safe filename
            const filename = req.headers['x-file-name'] || `file-${Date.now()}`;
            const safeFilename = generateSafeFilename(filename, contentType);
            
            // Upload to storage
            const result = await uploadToCOS(fileData, safeFilename, contentType);
            
            resolve(new Response(JSON.stringify({
              success: true,
              message: 'Binary file upload successful',
              file: result
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          } catch (err) {
            console.error('Binary upload error:', err);
            resolve(new Response(JSON.stringify({ error: `File upload failed: ${err.message}` }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        });
        
        req.on('error', (err) => {
          console.error('Binary upload request error:', err);
          resolve(new Response(JSON.stringify({ error: `Upload request error: ${err.message}` }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }));
        });
        return; // End binary upload processing
      }
      
      // Process multipart/form-data upload
      const bb = busboy({ headers: req.headers });
      const uploadPromises = [];
      const uploadResults = [];
      let uploadError = null;
      let fieldValues = {};

      // Process file fields
      bb.on('file', (fieldname, file, { filename, encoding, mimeType }) => {
        console.log(`Processing file upload: ${filename}, type: ${mimeType}`);
        
        // Collect file data
        const chunks = [];
        let fileSize = 0;
        
        file.on('data', (data) => {
          chunks.push(data);
          fileSize += data.length;
          
          // Validate file size (validate while receiving)
          const validation = validateFile(mimeType, fileSize);
          if (!validation.valid) {
            file.resume(); // Stop receiving file data
            uploadError = validation.error;
          }
        });

        file.on('end', () => {
          // If there's already an error, don't continue processing
          if (uploadError) return;
          
          // Validate file type and size again
          const validation = validateFile(mimeType, fileSize);
          if (!validation.valid) {
            uploadError = validation.error;
            return;
          }
        
        // Generate safe filename
        const safeFilename = generateSafeFilename(filename, mimeType);
        
        // Merge file data
        const fileData = Buffer.concat(chunks);
        
        // Upload to COS
        const uploadPromise = uploadToCOS(fileData, safeFilename, mimeType)
          .then(result => {
            uploadResults.push({
              fieldname,
              ...result
            });
          })
          .catch(err => {
            uploadError = `File ${filename} upload failed: ${err.message}`;
          });
        
        uploadPromises.push(uploadPromise);
      });
    });

    // Process regular fields
    bb.on('field', (fieldname, value) => {
      fieldValues[fieldname] = value;
    });

    // Processing complete
    bb.on('finish', async () => {
      try {
        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        
        if (uploadError) {
          resolve(new Response(JSON.stringify({ error: uploadError }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }));
        } else {
          resolve(new Response(JSON.stringify({
            success: true,
            message: 'File upload successful',
            files: uploadResults,
            fields: fieldValues
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      } catch (err) {
        reject(err);
      }
    });

    // Handle errors
    bb.on('error', (err) => {
      console.error('Busboy error:', err);
      resolve(new Response(JSON.stringify({ error: 'File upload processing failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    });

    // Pipe request to busboy
    req.pipe(bb);
    });
    // End of Promise wrapper
  } catch (error) {
    console.error('File upload error:', error);
    return new Response(JSON.stringify({ error: 'File upload server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};