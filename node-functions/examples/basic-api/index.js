import getRequestBody from '../getRequestBody.js';

export async function onRequest(context) {
  // Get request information
  const { request } = context;
  const method = request.method;
  
  // Handle requests based on different HTTP methods and paths
  try {
    // Handle GET requests
    if (method === 'GET') {
      // Mock getting user list
      const users = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Mike', email: 'mike@example.com' }
      ];
      return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle POST requests
    else if (method === 'POST') {
      // Get request body data
      const data = await getRequestBody(request);
      // Mock creating user
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'User created successfully', 
        data: { id: Date.now(), ...data }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle PUT requests
    else if (method === 'PUT') {
      const pathname = request.url;
      const userId = pathname.split('/').pop();
      const data = await getRequestBody(request);
      // Mock updating user
      return new Response(JSON.stringify({ 
        success: true, 
        message: `User ${userId} updated successfully`,
        data: { id: userId, ...data }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle DELETE requests
    else if (method === 'DELETE') {
      const pathname = request.url;
      const userId = pathname.split('/').pop();
      // Mock deleting user
      return new Response(JSON.stringify({ 
        success: true, 
        message: `User ${userId} deleted successfully` 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle unsupported paths
    return new Response(JSON.stringify({ error: 'Resource not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}