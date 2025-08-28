export default function SSRLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header placeholder */}
      <header className="w-full bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-600 animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
            </div>
            
            {/* Navigation skeleton */}
            <div className="flex space-x-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-16 h-10 bg-gray-600 rounded animate-pulse"></div>
              ))}
            </div>
            
            {/* GitHub icon skeleton */}
            <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-20 text-center">
        {/* Title skeleton */}
        <div className="w-3/4 h-16 bg-gray-800 rounded mx-auto mb-6 animate-pulse"></div>
        
        {/* Subtitle skeleton */}
        <div className="w-2/3 h-8 bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
        
        {/* Description skeleton */}
        <div className="w-1/2 h-6 bg-gray-700 rounded mx-auto mb-8 animate-pulse"></div>
        
        {/* Button skeleton */}
        <div className="w-48 h-12 bg-gray-700 rounded mx-auto animate-pulse"></div>
      </div>

      {/* Code example skeleton */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
          <div className="bg-gray-900 rounded p-6">
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex space-x-2">
                  <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className={`h-4 bg-gray-700 rounded animate-pulse ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data display skeleton */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8 text-center">
          {/* Status badge skeleton */}
          <div className="w-80 h-8 bg-gray-700 rounded-lg mx-auto mb-6 animate-pulse"></div>
          
          {/* Title skeleton */}
          <div className="w-64 h-8 bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
          
          {/* Description skeleton */}
          <div className="w-96 h-6 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          
          {/* Data items skeleton */}
          <div className="space-y-3 max-w-lg mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="w-32 h-5 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-48 h-5 bg-gray-600 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Features skeleton */}
          <div className="mt-6 p-4 bg-gray-700/20 border border-gray-600 rounded-lg">
            <div className="w-48 h-6 bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <div className="w-64 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="fixed bottom-8 right-8 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">SSR 渲染中...</span>
        </div>
      </div>
    </div>
  )
} 