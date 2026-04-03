/**
 * Subscription Service — stub for future RevenueCat integration
 *
 * Future integrations:
 * - react-native-purchases (RevenueCat)
 * - Apple In-App Purchases
 * - Google Play Billing
 *
 * Entitlements:
 * - free: 1 habit, basic stats, community read-only
 * - premium: multiple habits, AI coach, community posting, advanced analytics
 */

export type SubscriptionTier = "free" | "premium";

export interface Entitlement {
  multipleHabits: boolean;
  aiCoach: boolean;
  communityPosting: boolean;
  advancedAnalytics: boolean;
  premiumTrophies: boolean;
}

export const ENTITLEMENTS: Record<SubscriptionTier, Entitlement> = {
  free: {
    multipleHabits: false,
    aiCoach: false,
    communityPosting: false,
    advancedAnalytics: false,
    premiumTrophies: false,
  },
  premium: {
    multipleHabits: true,
    aiCoach: true,
    communityPosting: true,
    advancedAnalytics: true,
    premiumTrophies: true,
  },
};

export const subscriptionService = {
  async initialize(): Promise<void> {
    // TODO: Purchases.configure({ apiKey: REVENUECAT_API_KEY })
  },

  async getSubscriptionTier(): Promise<SubscriptionTier> {
    // TODO: Check RevenueCat customer info
    return "free";
  },

  async purchasePremium(): Promise<boolean> {
    // TODO: Purchases.purchasePackage(package)
    return false;
  },

  async restorePurchases(): Promise<SubscriptionTier> {
    // TODO: Purchases.restorePurchases()
    return "free";
  },

  getEntitlements(tier: SubscriptionTier): Entitlement {
    return ENTITLEMENTS[tier];
  },
};
