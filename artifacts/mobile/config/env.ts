// ─────────────────────────────────────────────────────────────────────────────
// Environment configuration
// Values come from Expo's EXPO_PUBLIC_ prefix (available in JS bundle).
// Sensitive server-side keys (Supabase service role, OpenAI) must stay in
// a backend proxy — never embed them in the client bundle.
// ─────────────────────────────────────────────────────────────────────────────

export const ENV = {
  // Supabase
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",

  // OpenAI (route through backend proxy — never expose secret key on client)
  OPENAI_PROXY_URL: process.env.EXPO_PUBLIC_OPENAI_PROXY_URL ?? "",

  // RevenueCat
  REVENUECAT_PUBLIC_KEY_IOS: process.env.EXPO_PUBLIC_RC_KEY_IOS ?? "",
  REVENUECAT_PUBLIC_KEY_ANDROID: process.env.EXPO_PUBLIC_RC_KEY_ANDROID ?? "",

  // Firebase
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",

  // App
  APP_ENV: (process.env.EXPO_PUBLIC_APP_ENV ?? "development") as
    | "development"
    | "staging"
    | "production",
} as const;

export const isDev = ENV.APP_ENV === "development";
export const isProd = ENV.APP_ENV === "production";
