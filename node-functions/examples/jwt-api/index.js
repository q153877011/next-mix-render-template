// Simple JWT Login API Example
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import getRequestBody from '../getRequestBody';

// In-memory user store (in production, use a database)
const users = [
  {
    id: '1',
    email: 'user@example.com',
    // Default password: 'password123'
    password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    username: 'demo_user'
  }
];

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-variables';
const JWT_EXPIRES_IN = '24h';

/**
 * Hash password using SHA-256
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} - JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Main request handler
 */
export async function onRequest(context) {
  const { request } = context;
  const method = request.method;
  
  // Route handling
  try {
    // Login endpoint
    if (method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return await handleLogin(request);
  } catch (error) {
    console.error('Request error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle user login
 */
async function handleLogin(request) {
  const data = await getRequestBody(request);
  console.log(data)
  const { email, password } = data;
  
  // Validate input
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Find user by email
  const user = users.find(u => u.email === email);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Verify password
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Generate token
  const token = generateToken({ userId: user.id });
  
  // Return success response (excluding password)
  const { password: _, ...userWithoutPassword } = user;
  return new Response(JSON.stringify({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}