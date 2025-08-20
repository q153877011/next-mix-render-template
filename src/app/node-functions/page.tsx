'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// This page demonstrates Node.js Functions
export default function NodeFunctionsPage() {
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
          EdgeOne Pages Next.js Starter - Node Functions
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          在 Node.js 运行时运行代码,无需管理服务器,支持完整的 Node.js API。
        </p>
        <p className="text-lg text-gray-400 mb-8">
          适合复杂后端逻辑和数据处理,优势是完整的 Node.js 生态系统和 npm 包支持,适合 API 端点、数据库操作和第三方服务集成。
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
              {`export default async function NodeFunctionsPage() {
  // 在 Node.js 运行时执行
  const data = await fetch('https://api.example.com/node-data', {
    cache: 'no-store'
  })
  
  return (
    <div>
      <h2>Node Functions:Node.js 运行时</h2>
      <p>这个页面在 Node.js 运行时执行,支持完整的 Node.js API。</p>
      <p>执行时间: {data.time}</p>
      <p>Node.js 时间: {data.time}</p>
      <p>数据获取时间: {data.time}</p>
      <p>Node.js 数据:{data.value}</p>
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
            Node Functions:Node.js 运行时
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            这个页面在 Node.js 运行时执行,支持完整的 Node.js API。
          </p>
          
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">执行时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Node.js 时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">数据获取时间:</span> {data.time}
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400">Node.js 数据:</span> {data.value}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
} 