import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          EdgeOne Pages Next.js Starter
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
          Build high-performance, scalable web applications using Next.js on EdgeOne Pages. Utilizing Node.js runtime, implement server rendering, incremental updates, and complex backend logic, while deploying with low latency using edge networks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg cursor-pointer">
            One-Click Deployment
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-3 text-lg cursor-pointer">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero 