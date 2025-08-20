import Header from '@/components/Header'
import { Button } from '@/components/ui/button'


// Simulate data retrieval at build time, only executed once
async function getSSGData() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    buildTime: new Date().toISOString(),
    deployTime: new Date().toISOString(),
    staticValue: Math.floor(Math.random() * 1000),
    generatedAt: 'build-time'
  }
}

// This page demonstrates Static Site Generation
export default async function SSGPage() {
  // This function is only executed at build time and will not be executed at runtime
  const data = await getSSGData()

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - SSG
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Pre-generate all pages at build time, providing the fastest loading speed and best performance.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Suitable for corporate websites and static content, the advantage is extremely fast page loading and zero server computation cost, but the content will not change after deployment, suitable for marketing landing pages and documentation websites.
        </p>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg cursor-pointer">
          View Documentation
        </Button>
      </div>

      {/* Code example area */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="bg-gray-900 rounded p-6 text-left">
            <pre className="text-sm">
              {`// app/ssg/page.tsx
export default async function SSGPage() {
  // This fetch is only executed at build time and will be fully static
  const data = await fetch('https://api.example.com/static-data', {
    cache: 'force-cache' // Force cache, fetched once at build time
  })
  
  return (
    <div>
      <h2>SSG: Static Site Generation</h2>
      <p>This page is generated at build time, content is fully static.</p>
      <p>Build Time: {data.buildTime}</p>
      <p>Deploy Time: {data.deployTime}</p>
      <p>Static Data: {data.staticValue}</p>
    </div>
  )
}

// Optional: If dynamic routing is needed
export async function generateStaticParams() {
  return [] // Return the path parameters to be pre-generated
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Dynamic data display area */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-purple-600/20 border border-purple-600 rounded-lg p-4 mb-6">
            <p className="text-purple-400 text-sm">
              🏗️ This page uses the SSG strategy, generated at build time, content is fully static!
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            SSG: Static Site Generation
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            This page is generated at build time, content will not change after deployment.
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300 flex flex-row items-center justify-between">
              <span className="text-blue-400 w-40 inline-block">Build Time:</span> {data.buildTime}
            </p>
            <p className="text-gray-300 flex flex-row items-center justify-between">
              <span className="text-blue-400">Deploy Time:</span> {data.deployTime}
            </p>
            <p className="text-gray-300 flex flex-row items-center justify-between">
              <span className="text-blue-400 w-40 inline-block">Generated At:</span> {data.generatedAt}
            </p>
            <p className="text-gray-300 flex flex-row items-center justify-between">
              <span className="text-blue-400 w-40 inline-block">Static Data:</span> {data.staticValue}
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              These data are generated at build time and will not change no matter how many times you refresh
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 