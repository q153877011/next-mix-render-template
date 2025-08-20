import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { headers } from 'next/headers'

// Force dynamic rendering - disable static optimization
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Simulate fetching data from API, re-fetching every time
async function getSSRData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Get request headers to prove this runs on server
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || 'Unknown'
  const timestamp = Date.now()
  
  return {
    requestTime: new Date().toISOString(),
    serverTime: new Date().toISOString(),
    dataFetchTime: new Date().toISOString(),
    realtimeValue: Math.floor(Math.random() * 1000),
    userAgent: userAgent.substring(0, 50) + '...',
    timestamp: timestamp,
    serverHash: Math.random().toString(36).substring(7)
  }
}

// This page demonstrates Server-Side Rendering
export default async function SSRPage() {
  // This function is executed every time a request is made
  const data = await getSSRData()

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - SSR
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Each request is rendered in real-time on the server, ensuring content is always up-to-date.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Suitable for dynamic content and personalized pages, the advantage is that content is updated in real-time, but each request requires server processing, suitable for user dashboards and real-time data display.
        </p>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg">
          View Documentation
        </Button>
      </div>

      {/* Code example area */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="bg-gray-900 rounded p-6 text-left">
            <pre className="text-sm text-green-400">
              {`// app/ssr/page.tsx
// Force dynamic rendering - disable static optimization
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SSRPage() {
  // This function runs on the server for EVERY request
  const data = await fetch('https://api.example.com/real-time-data', {
    cache: 'no-store' // Disable cache - ensures fresh data every time
  })
  
  const jsonData = await data.json()
  
  return (
    <div>
      <h2>SSR: Server-Side Rendering</h2>
      <p>This page is rendered on the server for every request.</p>
      <p>Request Time: {new Date().toISOString()}</p>
      <p>Server Time: {new Date().toISOString()}</p>
      <p>Real-time Data: {jsonData.value}</p>
    </div>
  )
}

// Key SSR characteristics:
// 1. export const dynamic = 'force-dynamic' - forces server rendering
// 2. export const revalidate = 0 - disables caching
// 3. Server Component (no 'use client' directive)
// 4. async function that runs on server
// 5. cache: 'no-store' for fresh data every time`}
            </pre>
          </div>
        </div>
      </div>

      {/* Dynamic data display area */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-orange-600/20 border border-orange-600 rounded-lg p-4 mb-6">
            <p className="text-orange-400 text-sm">
              🔄 This page uses the SSR strategy, re-rendering on the server every time the page is refreshed!
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            SSR: Server-Side Rendering
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This page is re-rendered every time a request is made, and data such as timestamps are updated in real-time.
          </p>
          
          <div className="space-y-2 text-left max-w-lg mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">Request Time:</span> {data.requestTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Server Time:</span> {data.serverTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Data Fetch Time:</span> {data.dataFetchTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Real-time Data:</span> {data.realtimeValue}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">User Agent:</span> {data.userAgent}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Server Hash:</span> {data.serverHash}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">SSR Implementation Details</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• <strong>Force Dynamic:</strong> export const dynamic = 'force-dynamic'</p>
              <p>• <strong>No Revalidation:</strong> export const revalidate = 0</p>
              <p>• <strong>Server Component:</strong> No 'use client' directive - runs on server</p>
              <p>• <strong>Async Function:</strong> Uses async/await for server-side data fetching</p>
              <p>• <strong>No Cache:</strong> cache: 'no-store' ensures fresh data every request</p>
              <p>• <strong>Server Rendering:</strong> HTML generated on server for each request</p>
              <p>• <strong>Real-time Data:</strong> Each page refresh shows new server-generated data</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Refresh the page to view new data generated in real-time on the server
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 