'use client'

import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

// This page demonstrates Edge Functions
export default function EdgeFunctionsPage() {
  const [data, setData] = useState('')
  const handleClick = async () => {
    const res = await fetch('/hello-edge')
    const text = await res.text()
    setData(text)
  }


  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      {/* Main title area */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter - Edge Functions
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Run code at the edge, no server management required, providing the lowest latency global deployment.
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Suitable for real-time data processing and geolocation services, the advantage is global edge deployment and ultra-low latency response, suitable for lightweight API, real-time notifications, and content personalization.
        </p>
        <Button size="lg" variant="outline" className="hover:bg-gray-700 text-white px-8 py-3 text-lg cursor-pointer">
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
    message: 'Hello Edge!',
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
            className="hover:bg-gray-700 text-white px-8 py-3 text-lg mb-6 cursor-pointer"
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