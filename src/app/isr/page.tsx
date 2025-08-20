import Header from '@/components/Header'
import { Button } from '@/components/ui/button'

// 配置 ISR，每60秒重新验证一次
export const revalidate = 60

// 模拟外部 API 调用，使用真正的 fetch 来演示 ISR 缓存
async function getISRData() {
  // 在真实的 ISR 中，这个 fetch 会被 Next.js 缓存
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    next: { revalidate: 60 } // 这个 fetch 结果会被缓存60秒
  })
  
  if (!response.ok) {
    // 如果 API 失败，使用模拟数据
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
      
      {/* 主标题区域 */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - ISR
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          静态生成加定时更新,平衡性能与新鲜度。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合新闻或博客网站,优势是快速加载并增量更新,避免全站重建,但过期后首次请求可能稍慢。
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
              {`// app/isr/page.tsx
export const revalidate = 60 // 页面级重新验证

export default async function ISRPage() {
  // 这个 fetch 的结果会被缓存60秒
  const response = await fetch('https://api.example.com/posts/1', {
    next: { revalidate: 60 }
  })
  
  const data = await response.json()
  
  return (
    <div>
      <h2>ISR 演示</h2>
      <p>生成时间: {new Date().toISOString()}</p>
      <p>缓存状态: {data.cacheStatus}</p>
      <p>数据来源: {data.dataSource}</p>
    </div>
  )
}

// ISR 工作流程:
// 1. 第一次访问 → 生成静态页面并缓存
// 2. 60秒内访问 → 返回缓存的静态页面 (极快)
// 3. 60秒后访问 → 后台重新生成,先返回旧版本
// 4. 重新生成完成 → 更新缓存为新版本`}
            </pre>
          </div>
        </div>
      </div>

      {/* 动态数据展示区域 */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <div className="bg-green-600/20 border border-green-600 rounded-lg p-4 mb-6">
            <p className="text-green-400 text-sm">
              ⏱️ 真正的 ISR：这个页面在构建时生成，缓存60秒。在生产环境中，60秒内的访问会返回相同的缓存页面！
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            ISR:增量静态再生
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面展示真正的 ISR 行为：静态生成 + 定时重新验证
          </p>
          
          <div className="space-y-2 text-left max-w-lg mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">页面生成时间:</span> {data.buildTime}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">缓存状态:</span> {data.cacheStatus}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">数据来源:</span> {data.dataSource}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">内容标题:</span> {data.title}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">内容预览:</span> {data.body}
            </p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">ISR 特性说明</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>• <strong>开发模式:</strong> 每次都重新生成（用于开发调试）</p>
              <p>• <strong>生产模式:</strong> 真正的缓存行为，60秒内返回相同内容</p>
              <p>• <strong>后台更新:</strong> 缓存过期后，先返回旧版本，后台重新生成</p>
              <p>• <strong>零停机:</strong> 更新过程中用户始终能访问页面</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              在生产环境中，这个页面会真正展示 ISR 的缓存效果
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 