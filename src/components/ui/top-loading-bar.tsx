'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface TopLoadingBarProps {
  height?: number
  color?: string
  speed?: number
}

export function TopLoadingBar({ 
  height = 3, 
  color = '#3b82f6',
  speed = 200 
}: TopLoadingBarProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    // Start loading animation
    setLoading(true)
    setProgress(10)

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100)
    const timer2 = setTimeout(() => setProgress(70), 300)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
    }, 500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname])

  if (!loading && progress === 0) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] bg-gray-200/20"
      style={{ height: `${height}px` }}
    >
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
        }}
      />
    </div>
  )
}
