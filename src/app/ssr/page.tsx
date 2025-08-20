import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

// 模拟从 API 获取数据，每次请求都重新获取
async function getSSRData() {
  // 模拟网络延迟
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
  // 每次请求都会重新执行这个函数
  const data = await getSSRData()

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* 主标题区域 */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - SSR
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          每次请求后通过服务器实时渲染,确保内容始终是最新的。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合动态内容和个性化页面,优势是内容实时更新,但每次请求都需要服务器处理,适合用户仪表板和实时数据展示。
        </p>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg">
          查看文档
        </Button>
      </div>

      {/* 代码示例区域 */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="bg-gray-900 rounded p-6 text-left">
            <pre className="text-sm">
              {`export default async function SSRPage() {
  // 每次请求都会执行，禁用缓存
  const data = await fetch('https://api.example.com/real-time-data', {
    cache: 'no-store' // 禁用缓存，确保每次都获取最新数据
  })
  
  return (
    <div>
      <h2>SSR:服务器端渲染</h2>
      <p>这个页面每次请求都会重新渲染,数据如时间戳会实时更新。</p>
      <p>请求时间: {data.requestTime}</p>
      <p>服务器时间: {data.serverTime}</p>
      <p>实时数据: {data.realtimeValue}</p>
    </div>
  )
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 动态数据展示区域 */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-orange-600/20 border border-orange-600 rounded-lg p-4 mb-6">
            <p className="text-orange-400 text-sm">
              🔄 这个页面使用 SSR 策略，每次刷新页面都会在服务器端重新渲染！
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            SSR:服务器端渲染
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面每次请求都会重新渲染,数据如时间戳会实时更新。
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">请求时间:</span> {data.requestTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">服务器时间:</span> {data.serverTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">数据获取时间:</span> {data.dataFetchTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">实时数据:</span> {data.realtimeValue}
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              刷新页面查看服务器端实时生成的新数据
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 