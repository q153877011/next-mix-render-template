'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// This page demonstrates Streaming
export default function StreamingPage() {
  const [data, setData] = useState({
    time: new Date().toISOString(),
    value: Math.floor(Math.random() * 1000)
  })
  
  const refreshData = () => {
    setData({
      time: new Date().toISOString(),
      value: Math.floor(Math.random() * 1000)
    })
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* 主标题区域 */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - Streaming
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          逐步渲染页面内容,提升用户体验和感知性能。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合数据密集型页面和复杂内容,优势是更快的首屏显示和渐进式内容加载,支持大型页面和复杂仪表板。
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
              {`export default function StreamingPage() {
  return (
    <div>
      <h1>页面标题</h1>
      
      <Suspense fallback={<LoadingSpinner />}>
        <SlowDataComponent />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <AnotherSlowComponent />
      </Suspense>
    </div>
  )
}

async function SlowDataComponent() {
  const data = await fetch('https://api.example.com/streaming-data')
  return <div>流式数据: {data.value}</div>
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 动态数据展示区域 */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <Button 
            onClick={refreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg mb-6"
          >
            点击刷新数据
          </Button>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            Streaming:流式渲染
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面使用流式渲染,内容逐步加载提升用户体验。
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">渲染时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">流式时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">数据加载时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">流式数据:</span> {data.value}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 