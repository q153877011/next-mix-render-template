import OpenAI from "openai";
import getRequestBody from '../getRequestBody.js';

export async function onRequest(context) {
  // Get request information
const { request } = context;
  const method = request.method;
  
  // Only allow POST requests
  if (method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST requests are supported' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Parse request body
    const requestData = await getRequestBody(request);
    const { prompt, maxTokens = 500 } = requestData;
    
    // Validate input
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Please provide a text prompt' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Initialize OpenAI client with API key from environment variable
    // Note: In production, the API key should be stored in environment variables
    const apiKey = process.env.OPENAI_API_KEY || 'your-api-key';
    const baseURL = process.env.OPENAI_API_URL || 'https://api.studio.nebius.com/v1/';
    const openai = new OpenAI({ baseURL, apiKey });
    
    // Call OpenAI API to generate text
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1-0528",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });
    
    // Extract and return the generated text
    const generatedText = completion.choices[0].message.content;
    
    return new Response(JSON.stringify({
      success: true,
      generatedText,
      usage: completion.usage
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('OpenAI API call error:', error);
    
    return new Response(JSON.stringify({
      error: 'Error generating text',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}