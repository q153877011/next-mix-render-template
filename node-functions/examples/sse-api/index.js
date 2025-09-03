/**
 * Server-Sent Events (SSE) API Example
 * Implementing real-time data push functionality
 */

// Store all connected clients
const clients = new Set();

// Simulate message queue
const messageQueue = {
  subscribers: {},
  publish: function(channel, message) {
    if (!this.subscribers[channel]) {
      return;
    }
    
    this.subscribers[channel].forEach(callback => {
      callback(message);
    });
  },
  subscribe: function(channel, callback) {
    if (!this.subscribers[channel]) {
      this.subscribers[channel] = new Set();
    }
    
    this.subscribers[channel].add(callback);
    return () => {
      this.subscribers[channel].delete(callback);
      if (this.subscribers[channel].size === 0) {
        delete this.subscribers[channel];
      }
    };
  }
};

// Simulate stock data generator
function generateStockData() {
  const stocks = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA'];
  const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
  const price = (Math.random() * 1000).toFixed(2);
  const change = (Math.random() * 10 - 5).toFixed(2);
  
  return {
    symbol: randomStock,
    price: parseFloat(price),
    change: parseFloat(change),
    timestamp: new Date().toISOString()
  };
}

// Start simulated data publishing
let stockDataInterval;
function startStockDataSimulation() {
  if (stockDataInterval) {
    return;
  }
  
  stockDataInterval = setInterval(() => {
    const stockData = generateStockData();
    messageQueue.publish('stocks', stockData);
  }, 2000); // Send data every 2 seconds
}

// Stop simulated data publishing
function stopStockDataSimulation() {
  if (stockDataInterval && clients.size === 0) {
    clearInterval(stockDataInterval);
    stockDataInterval = null;
  }
}

/**
 * Handle SSE requests
 */
export async function onRequest(context) {
  const { request, env } = context;
  
  // Only process GET requests
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  
  // Parse request parameters
  const url = new URL(request.url, 'http://www.example.com');
  const channel = url.searchParams.get('channel') || 'stocks';
  
  // Create SSE response
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  
  // Set SSE response headers
  const response = new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    }
  });
  
  // Create client object
  const clientId = Date.now().toString();
  const client = {
    id: clientId,
    writer
  };
  
  // Add client to connection collection
  clients.add(client);
  console.log(`Client ${clientId} connected, current connections: ${clients.size}`);
  
  // If this is the first client, start data simulation
  if (clients.size === 1) {
    startStockDataSimulation();
  }
  
  // Send connection success message
  const connectMessage = `event: connected\ndata: {"clientId":"${clientId}","message":"Connection successful"}\n\n`;
  await writer.write(new TextEncoder().encode(connectMessage));
  
  // Subscribe to message queue
  const unsubscribe = messageQueue.subscribe(channel, async (data) => {
    try {
      const eventData = `event: message\ndata: ${JSON.stringify(data)}\n\n`;
      await writer.write(new TextEncoder().encode(eventData));
    } catch (error) {
      console.error(`Failed to send message to client ${clientId}:`, error);
      // Sending failed, client may have disconnected, remove client
      clients.delete(client);
      unsubscribe();
    }
  });
  
  // Listen for connection close
  context.waitUntil(
    (async () => {
      try {
        // Wait for request to be interrupted (client disconnects)
        await request.signal.aborted;
      } catch (error) {
        // Ignore errors
      } finally {
        // Clean up resources
        clients.delete(client);
        unsubscribe();
        console.log(`Client ${clientId} disconnected, current connections: ${clients.size}`);
        
        // If no clients are connected, stop data simulation
        if (clients.size === 0) {
          stopStockDataSimulation();
        }
        
        try {
          await writer.close();
        } catch (error) {
          // Ignore close errors
        }
      }
    })()
  );
  
  return response;
}

/**
 * Client usage example:
 * 
 * // Create SSE connection
 * const eventSource = new EventSource('/api/sse?channel=stocks');
 * 
 * // Listen for connection success event
 * eventSource.addEventListener('connected', (event) => {
 *   const data = JSON.parse(event.data);
 *   console.log('SSE connection successful:', data);
 * });
 * 
 * // Listen for message events
 * eventSource.addEventListener('message', (event) => {
 *   const stockData = JSON.parse(event.data);
 *   console.log('Received stock data:', stockData);
 *   // Update UI here
 * });
 * 
 * // Listen for errors
 * eventSource.onerror = (error) => {
 *   console.error('SSE connection error:', error);
 *   eventSource.close();
 * };
 */
