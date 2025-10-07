import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  const [campaigns, videos, subscription, usage] = await Promise.all([
    prisma.campaign.count({
      where: { userId: session!.user!.id },
    }),
    prisma.video.findMany({
      where: {
        campaign: {
          userId: session!.user!.id,
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: {
          select: { name: true },
        },
      },
    }),
    prisma.subscription.findUnique({
      where: { userId: session!.user!.id },
    }),
    prisma.usage.findUnique({
      where: { userId: session!.user!.id },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Campaigns</div>
          <div className="text-3xl font-bold mt-2">{campaigns}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Videos Generated</div>
          <div className="text-3xl font-bold mt-2">{usage?.videosGenerated || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Videos Posted</div>
          <div className="text-3xl font-bold mt-2">{usage?.videosPosted || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Current Plan</div>
          <div className="text-3xl font-bold mt-2 capitalize">{subscription?.plan || 'Free'}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Videos</h2>
            <Link href="/dashboard/videos" className="text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {videos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No videos yet</p>
              <Link
                href="/dashboard/campaigns"
                className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Create Campaign
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video: any) => (
                <div key={video.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{video.title}</div>
                    <div className="text-sm text-gray-600">{video.campaign.name}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      video.status === 'completed' ? 'bg-green-100 text-green-800' :
                      video.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                      video.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
