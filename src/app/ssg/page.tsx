import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

// 模拟在构建时获取数据，只在构建时执行一次
async function getSSGData() {
  // 模拟网络延迟
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
  // 这个函数只在构建时执行，不会在运行时执行
  const data = await getSSGData()

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* 主标题区域 */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - SSG
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          在构建时预生成所有页面,提供最快的加载速度和最佳的性能。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合企业官网和静态内容,优势是极快的页面加载和零服务器计算成本,但内容在部署后不会改变,适合营销落地页和文档网站。
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
              {`// app/ssg/page.tsx
export default async function SSGPage() {
  // 这个 fetch 只在构建时执行，会被完全静态化
  const data = await fetch('https://api.example.com/static-data', {
    cache: 'force-cache' // 强制缓存，构建时获取一次
  })
  
  return (
    <div>
      <h2>SSG:静态站点生成</h2>
      <p>这个页面在构建时生成，内容完全静态化。</p>
      <p>构建时间: {data.buildTime}</p>
      <p>部署时间: {data.deployTime}</p>
      <p>静态数据: {data.staticValue}</p>
    </div>
  )
}

// 可选：如果需要动态路由
export async function generateStaticParams() {
  return [] // 返回要预生成的路径参数
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 动态数据展示区域 */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-purple-600/20 border border-purple-600 rounded-lg p-4 mb-6">
            <p className="text-purple-400 text-sm">
              🏗️ 这个页面使用 SSG 策略，在构建时生成，内容完全静态化！
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            SSG:静态站点生成
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面在构建时生成,内容在部署后不会改变。
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">构建时间:</span> {data.buildTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">部署时间:</span> {data.deployTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">生成位置:</span> {data.generatedAt}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">静态数据:</span> {data.staticValue}
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              这些数据在构建时生成，无论刷新多少次都不会改变
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 