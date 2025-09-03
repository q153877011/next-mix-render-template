import { Resend } from 'resend';
import getRequestBody from '../getRequestBody';

// Initialize Resend client
// Note: In production, you should store the API key in environment variables

/**
 * Email Sending API
 * Receives user email address and sends an email
 */
export async function onRequest(context) {
  const { request } = context;
  const resend = new Resend(process.env.RESEND_API_KEY ||'your-resend-api-key'); // Replace with your Resend API key
  
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
    
    // Validate request parameters
    if (!requestBody || !requestBody.email) {
      return new Response(JSON.stringify({ error: 'Missing email address, please provide recipient email in the "email" field' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { email } = requestBody;
    console.log('==email: ', email);
    const name = requestBody.name || 'User';
    const subject = requestBody.subject || 'Welcome to our service';
    const customMessage = requestBody.message || '';
    
    // Send email
    const data = await resend.emails.send({
      from: 'noreply@wenyiqing.email', // Replace with your sender email
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${name}!</h2>
          <p>Thank you for using our service.</p>
          ${customMessage ? `<p>${customMessage}</p>` : ''}
          <p>If you have any questions, please feel free to contact us.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `
    });
    if(data.error) {
      return new Response(JSON.stringify({ error: 'Email sending failed', details: data.error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Return success response
    return new Response(JSON.stringify({ success: true, messageId: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(JSON.stringify({ error: 'Email sending failed', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}