// ─────────────────────────────────────────────────────────────────────────────
// Service contracts (interfaces)
// All UI code must depend on these interfaces, never on concrete adapters.
// Swap adapters here without touching any screen or component.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface IAnalyticsClient {
  logEvent(name: string, params?: Record<string, unknown>): void;
  setUserId(id: string | null): void;
  setUserProperty(key: string, value: string): void;
  logScreenView(screenName: string): void;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  provider: "apple" | "google" | "facebook" | "anonymous";
}

export interface IAuthClient {
  signInWithApple(): Promise<AuthUser>;
  signInWithGoogle(): Promise<AuthUser>;
  signInWithFacebook(): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  onAuthStateChanged(cb: (user: AuthUser | null) => void): () => void;
}

// ─── Database / persistence ──────────────────────────────────────────────────

export interface IDatabaseClient {
  getProfile(userId: string): Promise<unknown>;
  saveProfile(userId: string, data: unknown): Promise<void>;
  getHabits(userId: string): Promise<unknown[]>;
  saveHabit(userId: string, habit: unknown): Promise<void>;
  deleteHabit(userId: string, habitId: string): Promise<void>;
  getCravings(userId: string, habitId: string): Promise<unknown[]>;
  saveCraving(userId: string, craving: unknown): Promise<void>;
}

// ─── AI Coach ────────────────────────────────────────────────────────────────

export interface CoachMessage {
  text: string;
  type: "motivational" | "warning" | "milestone";
}

export interface ICoachClient {
  getMotivationalMessage(daysSober: number): Promise<CoachMessage>;
  getChatResponse(
    message: string,
    context: Record<string, unknown>
  ): Promise<string>;
}

// ─── Subscription ────────────────────────────────────────────────────────────

export type ProductId = "premium_monthly" | "premium_yearly" | "premium_lifetime";

export interface ISubscriptionClient {
  getOfferings(): Promise<unknown[]>;
  purchaseProduct(productId: ProductId): Promise<{ success: boolean }>;
  restorePurchases(): Promise<{ tier: "free" | "premium" }>;
  getCustomerInfo(): Promise<{ tier: "free" | "premium"; expiresAt?: string }>;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface INotificationClient {
  requestPermission(): Promise<boolean>;
  scheduleDaily(hour: number, minute: number, title: string, body: string): Promise<void>;
  cancelAll(): Promise<void>;
  getToken(): Promise<string | null>;
}
