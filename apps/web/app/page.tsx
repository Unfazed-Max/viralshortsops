export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ViralShortsOps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automated multi-niche, multilingual short-form video generation and posting platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold mb-2">Auto-Generate Videos</h3>
            <p className="text-gray-600">
              AI-powered script generation, voiceover, and video rendering with captions
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold mb-2">Multi-Platform</h3>
            <p className="text-gray-600">
              Post to YouTube Shorts, TikTok, Instagram Reels, and Facebook automatically
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Scheduling</h3>
            <p className="text-gray-600">
              Schedule posts, track performance, and manage multiple campaigns
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Production-grade SaaS • TypeScript • Next.js 14 • Prisma • BullMQ</p>
        </div>
      </div>
    </div>
  );
}
