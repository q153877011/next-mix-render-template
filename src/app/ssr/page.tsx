import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

// Simulate fetching data from API, re-fetching every time
async function getSSRData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    requestTime: new Date().toISOString(),
    serverTime: new Date().toISOString(),
    dataFetchTime: new Date().toISOString(),
    realtimeValue: Math.floor(Math.random() * 1000)
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
            <pre className="text-sm">
              {`export default async function SSRPage() {
  // This function is executed every time a request is made, disabling cache
  const data = await fetch('https://api.example.com/real-time-data', {
    cache: 'no-store' // Disable cache to ensure the latest data is fetched every time
  })
  
  return (
    <div>
      <h2>SSR: Server-Side Rendering</h2>
      <p>This page is re-rendered every time a request is made, and data such as timestamps are updated in real-time.</p>
      <p>Request Time: {data.requestTime}</p>
      <p>Server Time: {data.serverTime}</p>
      <p>Real-time Data: {data.realtimeValue}</p>
    </div>
  )
}`}
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
          
          <div className="space-y-2 text-left max-w-md mx-auto">
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