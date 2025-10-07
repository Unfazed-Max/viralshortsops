import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    videosPerMonth: 5,
    storageGB: 1,
    features: ['5 videos/month', '1GB storage', 'Basic analytics'],
  },
  basic: {
    name: 'Basic',
    price: 29,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    videosPerMonth: 50,
    storageGB: 10,
    features: ['50 videos/month', '10GB storage', 'Advanced analytics', 'Priority support'],
  },
  pro: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    videosPerMonth: 200,
    storageGB: 50,
    features: ['200 videos/month', '50GB storage', 'Advanced analytics', 'Priority support', 'Custom branding'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    videosPerMonth: 1000,
    storageGB: 200,
    features: ['1000 videos/month', '200GB storage', 'Advanced analytics', 'Dedicated support', 'Custom branding', 'API access'],
  },
}

export async function createCheckoutSession(customerId: string, priceId: string) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
  })
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name: name || undefined,
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}
