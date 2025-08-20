'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// This page demonstrates Node.js Functions
export default function NodeFunctionsPage() {
  const [data, setData] = useState('')
  const handleClick = async () => {
    const res = await fetch('/hello-node')
    const text = await res.text()
    setData(text)
  }


  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - Node Functions
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Run code in Node.js at runtime, no server management required, supporting the full Node.js API.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Suitable for complex backend logic and data processing, the advantage is the complete Node.js ecosystem and npm package support, suitable for API endpoints, database operations, and third-party service integrations.
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
              {`export default function onRequest(context) {
  const {geo} = context;

  return new Response(JSON.stringify({
    message: 'Hello Node!',
    geo: geo,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Dynamic data display area */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          <Button 
            onClick={handleClick}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 text-lg mb-6"
          >
            Execute API Call
          </Button>
          
          
          {data && <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-gray-300">
              <span className="text-blue-400">Function Return:</span> {data}
            </p>
           
          </div>}
        </div>
      </div>
    </main>
  )
} 