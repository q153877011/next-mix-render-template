import sharp from 'sharp';
import getRequestBody from '../getRequestBody';

// Allowed image types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Image watermark API handler function
 * @param {Object} request - HTTP request object
 * @returns {Promise<Response>} HTTP response
 */
export async function onRequest(context) {
  const { request } = context;
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Please use POST request' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Read request body
    let requestBody;
    try {
      // Try to use getRequestBody function
      requestBody = await getRequestBody(request);
    } catch (error) {
      // If failed, try using standard Request API
      const text = await request.text();
      try {
        requestBody = JSON.parse(text);
      } catch (parseError) {
        requestBody = { text };
      }
    }
    
    // Check if request body contains base64 data
    if (!requestBody || !requestBody.image) {
      return new Response(JSON.stringify({ error: 'Missing image data, please provide base64 encoded image in the "image" field' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Decode base64 data
    let base64Data = requestBody.image;
    // If base64 string contains prefix (like data:image/jpeg;base64,), remove the prefix
    if (base64Data.includes(';base64,')) {
      base64Data = base64Data.split(';base64,')[1];
    }
    
    // Convert to Buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log('Received base64 image, size:', imageBuffer.length);
    
    // Check file size
    if (imageBuffer.length > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large, maximum size is 50MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get watermark parameters
    const watermarkText = requestBody.text || 'Watermark Example';
    const opacity = parseFloat(requestBody.opacity || '0.5');
    const textColor = requestBody.textColor || 'white';
    const fontSize = parseInt(requestBody.fontSize || '36', 10);
    
    // Check image format
    const imageInfo = await sharp(imageBuffer).metadata();
    const imageMimeType = `image/${imageInfo.format}`;
    
    if (!ALLOWED_IMAGE_TYPES.includes(imageMimeType)) {
      return new Response(JSON.stringify({ error: 'Unsupported image format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Add text watermark
    const processedImageBuffer = await addTextWatermark(
      imageBuffer,
      watermarkText,
      opacity,
      textColor,
      fontSize
    );
    
    // Return processed image
    return new Response(processedImageBuffer, {
      status: 200,
      headers: { 'Content-Type': imageMimeType }
    });
  } catch (error) {
    console.error('Image processing failed:', error);
    return new Response(JSON.stringify({ error: 'Image processing failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Add text watermark to the bottom right corner of the image
 * @param {Buffer} imageBuffer - Image data
 * @param {string} text - Watermark text
 * @param {number} opacity - Opacity (0-1)
 * @param {string} textColor - Text color
 * @param {number} fontSize - Font size
 * @returns {Promise<Buffer>} Processed image data
 */
async function addTextWatermark(imageBuffer, text, opacity, textColor, fontSize) {
  // Get image information
  const metadata = await sharp(imageBuffer).metadata();
  const { width, height } = metadata;
  
  // Create an SVG with text
  const svgText = `
    <svg width="${width}" height="${height}">
      <style>
        .watermark {
          fill: ${textColor};
          fill-opacity: ${opacity};
          font-size: ${fontSize}px;
          font-weight: bold;
          font-family: 'Arial', sans-serif;
        }
      </style>
      <text 
        x="${width - 20}" 
        y="${height - 20}" 
        text-anchor="end" 
        class="watermark">${text}</text>
    </svg>
  `;
  
  // Composite the SVG watermark onto the original image
  return sharp(imageBuffer)
    .composite([{
      input: Buffer.from(svgText),
      gravity: 'southeast'
    }])
    .toBuffer();
}