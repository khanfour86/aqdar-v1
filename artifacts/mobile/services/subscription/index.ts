import { ISubscriptionClient, ProductId } from "@/services/contracts";

/**
 * Subscription Service — stub implementing ISubscriptionClient
 *
 * Future integration: RevenueCat (react-native-purchases)
 * Swap this adapter without touching UI code.
 */
class StubSubscriptionClient implements ISubscriptionClient {
  async getOfferings(): Promise<unknown[]> {
    // TODO: Purchases.getOfferings()
    return [];
  }

  async purchaseProduct(_productId: ProductId): Promise<{ success: boolean }> {
    // TODO: Purchases.purchasePackage(package)
    return { success: false };
  }

  async restorePurchases(): Promise<{ tier: "free" | "premium" }> {
    // TODO: Purchases.restorePurchases()
    return { tier: "free" };
  }

  async getCustomerInfo(): Promise<{
    tier: "free" | "premium";
    expiresAt?: string;
  }> {
    // TODO: Purchases.getCustomerInfo()
    return { tier: "free" };
  }
}

export const subscriptionService: ISubscriptionClient =
  new StubSubscriptionClient();

// ─── Legacy exports (used by settings screen) ────────────────────────────────
export type SubscriptionTier = "free" | "premium";
