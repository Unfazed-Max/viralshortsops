import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AnalyticsPage() {
  const session = await auth()

  const analytics = await prisma.videoAnalytics.findMany({
    where: {
      video: {
        campaign: {
          userId: session!.user!.id,
        },
      },
    },
    include: {
      video: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 10,
  })

  const totalViews = analytics.reduce((sum: number, a: any) => sum + a.views, 0)
  const totalLikes = analytics.reduce((sum: number, a: any) => sum + a.likes, 0)
  const totalShares = analytics.reduce((sum: number, a: any) => sum + a.shares, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Views</div>
          <div className="text-3xl font-bold mt-2">{totalViews.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Likes</div>
          <div className="text-3xl font-bold mt-2">{totalLikes.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Shares</div>
          <div className="text-3xl font-bold mt-2">{totalShares.toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Performance</h2>
        </div>
        <div className="p-6">
          {analytics.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No analytics data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Video</th>
                    <th className="text-left py-3 px-4">Platform</th>
                    <th className="text-right py-3 px-4">Views</th>
                    <th className="text-right py-3 px-4">Likes</th>
                    <th className="text-right py-3 px-4">Shares</th>
                    <th className="text-right py-3 px-4">Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.video.title}</td>
                      <td className="py-3 px-4 capitalize">{item.platform}</td>
                      <td className="py-3 px-4 text-right">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{item.likes.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{item.shares.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{item.comments.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
