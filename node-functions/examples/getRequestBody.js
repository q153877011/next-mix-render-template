export default async function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    // Listen for data block events
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    // Listen for end events
    request.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString();
        // Trying to parse JSON
        if(body) {
          try {
            const jsonData = JSON.parse(body);
            resolve(jsonData);
          } catch (error) {
            resolve(body);
          }
        } else {
          resolve({});
        }
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}