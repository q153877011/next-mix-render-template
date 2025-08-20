import FeatureCard from './FeatureCard'

const Features = () => {
  const features = [
    {
      title: "SSR (服务器端渲染)",
      description: "每次请求后通过服务器实时渲染",
      demoLink: "/ssr"
    },
    {
      title: "ISR (增量静态再生)",
      description: "静态生成 + 定时增量更新",
      demoLink: "/isr"
    },
    {
      title: "SSG (静态站点生成)",
      description: "在构建时预生成所有页面",
      demoLink: "/ssg"
    },
    {
      title: "Streaming (流式渲染)",
      description: "逐步渲染页面内容，提升用户体验",
      demoLink: "/streaming"
    },
    {
      title: "Node Functions",
      description: "在 Node Runtime 运行代码,无需管理服务器",
      demoLink: "/node-functions"
    },
    {
      title: "Edge Functions",
      description: "在 Edge Runtime 运行代码,无需管理服务器",
      demoLink: "/edge-functions"
    }
  ]

  return (
    <section className="w-full pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              demoLink={feature.demoLink}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features 