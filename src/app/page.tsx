import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">ViralShortsOps</h1>
            <div className="space-x-4">
              <Link 
                href="/auth/signin" 
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Auto-Generate Viral Short Videos
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create and schedule engaging short-form videos for YouTube, TikTok, and Instagram. 
            Powered by AI with automated posting and analytics.
          </p>
          <Link 
            href="/auth/signup" 
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700"
          >
            Start Free Trial
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Generation</h3>
            <p className="text-gray-600">
              Automatically generate videos using InVideo API and FFmpeg with custom captions and voiceovers
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Multi-Platform Posting</h3>
            <p className="text-gray-600">
              Schedule and auto-post to YouTube, TikTok, and Instagram from one dashboard
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
            <p className="text-gray-600">
              Track performance metrics and optimize your content strategy with detailed analytics
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
