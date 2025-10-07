import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function SettingsPage() {
  const session = await auth()

  const [user, subscription, usage, socialAccounts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user!.id },
    }),
    prisma.subscription.findUnique({
      where: { userId: session!.user!.id },
    }),
    prisma.usage.findUnique({
      where: { userId: session!.user!.id },
    }),
    prisma.socialAccount.findMany({
      where: { userId: session!.user!.id },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Profile Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Subscription</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-2xl font-bold capitalize mt-1">{subscription?.plan || 'Free'}</p>
            </div>
            <Link
              href="/pricing"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Upgrade Plan
            </Link>
          </div>
          {subscription?.currentPeriodEnd && (
            <p className="text-sm text-gray-600 mt-4">
              Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Usage & Quotas</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Videos Generated</span>
              <span>{usage?.videosGenerated || 0} / {subscription?.plan === 'free' ? 5 : subscription?.plan === 'basic' ? 50 : subscription?.plan === 'pro' ? 200 : 1000}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{
                  width: `${((usage?.videosGenerated || 0) / (subscription?.plan === 'free' ? 5 : subscription?.plan === 'basic' ? 50 : subscription?.plan === 'pro' ? 200 : 1000)) * 100}%`,
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Storage Used</span>
              <span>{((usage?.storageUsed || BigInt(0)) / BigInt(1024 * 1024 * 1024)).toString()} GB / {subscription?.plan === 'free' ? 1 : subscription?.plan === 'basic' ? 10 : subscription?.plan === 'pro' ? 50 : 200} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{
                  width: `${(Number(usage?.storageUsed || 0) / (subscription?.plan === 'free' ? 1 : subscription?.plan === 'basic' ? 10 : subscription?.plan === 'pro' ? 50 : 200) / 1024 / 1024 / 1024) * 100}%`,
                }}
              />
            </div>
          </div>
          {usage?.resetAt && (
            <p className="text-sm text-gray-600">
              Quota resets: {new Date(usage.resetAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Connected Accounts</h2>
        </div>
        <div className="p-6">
          {socialAccounts.length === 0 ? (
            <p className="text-gray-600">No social accounts connected yet</p>
          ) : (
            <div className="space-y-3">
              {socialAccounts.map((account: any) => (
                <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold uppercase">
                        {account.platform[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium capitalize">{account.platform}</p>
                      <p className="text-sm text-gray-600">{account.username || 'Connected'}</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Disconnect
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium">
            + Connect New Account
          </button>
        </div>
      </div>
    </div>
  )
}
