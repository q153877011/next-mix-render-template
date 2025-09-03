/**
 * CSV to Excel Conversion API
 * This API converts CSV data to Excel format
 * Supports various CSV formats and generates downloadable Excel files
 */

import getRequestBody from '../getRequestBody.js';
import * as XLSX from 'xlsx';

/**
 * Converts CSV data to Excel format
 * @param {String} csvData - The CSV data to convert
 * @param {Object} options - Conversion options
 * @returns {Buffer} - Excel file as buffer
 */
function convertCsvToExcel(csvData, options = {}) {
  // Default options
  const defaults = {
    delimiter: options.delimiter || ',',
    sheetName: options.sheetName || 'Sheet1',
    dateNF: options.dateNF || 'yyyy-mm-dd',
    skipEmptyLines: options.skipEmptyLines !== false
  };

  // Handle empty data
  if (!csvData || csvData.trim() === '') {
    throw new Error('Empty CSV data provided');
  }
  
  // Parse CSV to worksheet
  const arrData = csvData.split('\n').map(line => 
    line.split(defaults.delimiter)
  );
  
  const worksheet = XLSX.utils.aoa_to_sheet(arrData, {
    dateNF: defaults.dateNF,
    skipEmptyLines: defaults.skipEmptyLines
  });
  
  // Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, defaults.sheetName);
  
  // Generate Excel file as buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return excelBuffer;
}

/**
 * Validates CSV data format
 * @param {String} csvData - The CSV data to validate
 * @param {String} delimiter - The delimiter used in the CSV
 * @returns {Boolean} - Whether the CSV data is valid
 */
function validateCsvFormat(csvData, delimiter) {
  if (!csvData || typeof csvData !== 'string') {
    return false;
  }
  
  // Split into lines
  const lines = csvData.trim().split('\n');
  if (lines.length === 0) {
    return false;
  }
  
  // Check if all rows have consistent number of columns
  const firstRowColumns = lines[0].split(delimiter).length;
  return lines.every(line => {
    // Handle quoted fields correctly
    let inQuote = false;
    let columns = 0;
    let field = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === delimiter && !inQuote) {
        columns++;
        field = '';
      } else {
        field += char;
      }
    }
    
    // Count the last field
    columns++;
    
    // Allow some flexibility (±1 column) to account for trailing delimiters
    return Math.abs(columns - firstRowColumns) <= 1;
  });
}

/**
 * Main request handler for the API
 */
export async function onRequest(context) {
  const { request } = context;
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed. Please use POST.'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    // Get request body (should contain CSV data)
    const requestBody = await getRequestBody(request);
    let csvData;
    
    // Handle different input formats
    if (typeof requestBody === 'string') {
      csvData = requestBody;
    } else if (requestBody && requestBody.csvData) {
      csvData = requestBody.csvData;
    } else if (requestBody && requestBody.data && typeof requestBody.data === 'string') {
      csvData = requestBody.data;
    } else {
      throw new Error('Invalid request format. CSV data not found.');
    }
    
    // Extract conversion options from query parameters
    const params = new URL(context.request.url, 'http://www.example.com').searchParams || {};

    const options = {
      delimiter: params.get('delimiter') || ',',
      sheetName: params.get('sheetName') || 'Sheet1',
      dateNF: params.get('dateNF') || 'yyyy-mm-dd',
      skipEmptyLines: params.get('skipEmptyLines') !== 'false'
    };
    
    // Validate CSV format
    if (!validateCsvFormat(csvData, options.delimiter)) {
      throw new Error('Invalid CSV format');
    }
    
    // Convert CSV to Excel
    const excelBuffer = convertCsvToExcel(csvData, options);
    
    // Set filename for download if provided
    const filename = params.get('filename') || 'data.xlsx';
    
    // Return Excel file response
    return new Response(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error converting CSV to Excel:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to convert CSV to Excel',
      message: error.message
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}