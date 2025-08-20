import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          在 EdgeOne Pages 上使用 Next.js 来构建高性能、可扩展的Web应用。利用 Node.js 运行时,实现服务器渲染、增量更新和复杂后端逻辑,同时结合边缘网络进行低延迟部署。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            一键部署
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
            查看文档
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero 