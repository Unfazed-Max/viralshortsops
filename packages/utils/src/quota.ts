import { BillingPlan } from '@viralshortsops/db';

export interface PlanQuotas {
  maxRendersPerMonth: number;
  maxConnectedAccounts: number;
  maxScheduledPostsPerDay: number;
}

export const PLAN_QUOTAS: Record<BillingPlan, PlanQuotas> = {
  FREE: {
    maxRendersPerMonth: 10,
    maxConnectedAccounts: 1,
    maxScheduledPostsPerDay: 10,
  },
  PRO: {
    maxRendersPerMonth: 200,
    maxConnectedAccounts: 5,
    maxScheduledPostsPerDay: 200,
  },
  TEAM: {
    maxRendersPerMonth: 1000,
    maxConnectedAccounts: 20,
    maxScheduledPostsPerDay: 1000,
  },
};

export function getQuotasForPlan(plan: BillingPlan): PlanQuotas {
  return PLAN_QUOTAS[plan];
}

export interface QuotaUsage {
  rendersThisMonth: number;
  connectedAccounts: number;
  scheduledPostsToday: number;
}

export function checkQuotaExceeded(
  plan: BillingPlan,
  usage: QuotaUsage,
  action: 'render' | 'connect' | 'schedule'
): { exceeded: boolean; limit: number; current: number } {
  const quotas = getQuotasForPlan(plan);

  switch (action) {
    case 'render':
      return {
        exceeded: usage.rendersThisMonth >= quotas.maxRendersPerMonth,
        limit: quotas.maxRendersPerMonth,
        current: usage.rendersThisMonth,
      };
    case 'connect':
      return {
        exceeded: usage.connectedAccounts >= quotas.maxConnectedAccounts,
        limit: quotas.maxConnectedAccounts,
        current: usage.connectedAccounts,
      };
    case 'schedule':
      return {
        exceeded: usage.scheduledPostsToday >= quotas.maxScheduledPostsPerDay,
        limit: quotas.maxScheduledPostsPerDay,
        current: usage.scheduledPostsToday,
      };
  }
}
