'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// This page demonstrates Edge Functions
export default function EdgeFunctionsPage() {
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
          EdgeOne Pages Next.js Starter - Edge Functions
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          在边缘运行时运行代码,无需管理服务器,提供最低延迟的全球部署。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合实时数据处理和地理位置服务,优势是全球边缘部署和超低延迟响应,适合轻量级 API、实时通知和内容个性化。
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
              {`export default async function EdgeFunctionsPage() {
  // 在边缘运行时执行
  const data = await fetch('https://api.example.com/edge-data', {
    cache: 'no-store'
  })
  
  return (
    <div>
      <h2>Edge Functions:边缘运行时</h2>
      <p>这个页面在边缘运行时执行,提供超低延迟响应。</p>
      <p>边缘时间: {data.time}</p>
      <p>响应时间: {data.time}</p>
      <p>数据获取时间: {data.time}</p>
      <p>边缘数据:{data.value}</p>
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
          <Button 
            onClick={refreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg mb-6"
          >
            点击刷新数据
          </Button>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            Edge Functions:边缘运行时
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面在边缘运行时执行,提供超低延迟响应。
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">边缘时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">响应时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">数据获取时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">边缘数据:</span> {data.value}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 