/**
 * Auth Service — stub for future Supabase/Firebase Auth integration
 *
 * Future integrations:
 * - Apple Sign In via expo-apple-authentication
 * - Google Sign In via @react-native-google-signin/google-signin
 * - Facebook Login via react-native-fbsdk-next
 * - Supabase Auth
 */

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  provider: "apple" | "google" | "facebook" | "guest";
}

export const authService = {
  async signInWithApple(): Promise<AuthUser> {
    // TODO: Integrate expo-apple-authentication + Supabase
    return {
      id: "guest_" + Date.now(),
      provider: "apple",
    };
  },

  async signInWithGoogle(): Promise<AuthUser> {
    // TODO: Integrate @react-native-google-signin + Supabase
    return {
      id: "guest_" + Date.now(),
      provider: "google",
    };
  },

  async signInWithFacebook(): Promise<AuthUser> {
    // TODO: Integrate react-native-fbsdk-next + Supabase
    return {
      id: "guest_" + Date.now(),
      provider: "facebook",
    };
  },

  async signInAsGuest(): Promise<AuthUser> {
    return {
      id: "guest_" + Date.now(),
      displayName: "ضيف",
      provider: "guest",
    };
  },

  async signOut(): Promise<void> {
    // TODO: Clear session tokens
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // TODO: Check active session from Supabase/Firebase
    return null;
  },
};
