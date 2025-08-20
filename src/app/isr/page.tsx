import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

// Configure ISR to revalidate every 60 seconds
export const revalidate = 60

// Simulate external API call using real fetch to demonstrate ISR caching
async function getISRData() {
  // In real ISR, this fetch will be cached by Next.js
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    next: { revalidate: 10 } // This fetch result will be cached for 60 seconds
  })
  
  if (!response.ok) {
    // If API fails, use mock data
    return {
      buildTime: new Date().toISOString(),
      dataSource: 'fallback',
      cacheStatus: 'generated at build time',
      postId: 1,
      title: 'ISR Demo Post (Fallback)',
      body: 'This is a fallback post for ISR demonstration.'
    }
  }
  
  const post = await response.json()
  
  return {
    buildTime: new Date().toISOString(),
    dataSource: 'external API',
    cacheStatus: 'cached for 60 seconds',
    postId: post.id,
    title: post.title,
    body: post.body.substring(0, 100) + '...'
  }
}

// This page demonstrates Incremental Static Regeneration
export default async function ISRPage() {
  const data = await getISRData()

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - ISR
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Static generation with timed updates, balancing performance and freshness.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Suitable for news or blog websites, the advantage is fast loading and incremental updates, avoiding full site rebuilds, but the first request after expiration may be slightly slower.
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
              {`// app/isr/page.tsx
export const revalidate = 60 // page-level revalidation

export default async function ISRPage() {
  // This fetch result will be cached for 60 seconds
  const response = await fetch('https://api.example.com/posts/1', {
    next: { revalidate: 60 }
  })
  
  const data = await response.json()
  
  return (
    <div>
      <h2>ISR Demo</h2>
      <p>Build Time: {new Date().toISOString()}</p>
      <p>Cache Status: {data.cacheStatus}</p>
      <p>Data Source: {data.dataSource}</p>
    </div>
  )
}

// ISR workflow:
// 1. First visit → Generate static page and cache
// 2. Visit within 60 seconds → Return cached static page (very fast)
// 3. Visit after 60 seconds → Background regeneration, first return old version
// 4. Regeneration complete → Update cache to new version`}
            </pre>
          </div>
        </div>
      </div>

      {/* Dynamic data display area */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">
              ⏱️ True ISR：This page is generated at build time, cached for 60 seconds. In production, visits within 60 seconds will return the same cached page！
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            ISR: Incremental Static Regeneration
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This page demonstrates true ISR behavior: static generation + timed revalidation
          </p>
          
          <div className="space-y-2 text-left max-w-lg mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">Page Build Time:</span> {data.buildTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Cache Status:</span> {data.cacheStatus}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Data Source:</span> {data.dataSource}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Post Title:</span> {data.title}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Post Preview:</span> {data.body}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">ISR Feature Explanation</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• <strong>Development Mode:</strong> Re-generates every time (for development debugging)</p>
              <p>• <strong>Production Mode:</strong> True caching behavior, returns the same content within 60 seconds</p>
              <p>• <strong>Background Update:</strong> Returns old version first, then re-generates in the background</p>
              <p>• <strong>Zero Downtime:</strong> Users can always access the page during updates</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              In production, this page will truly demonstrate the caching effect of ISR
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 