import { IAuthClient, AuthUser } from "@/services/contracts";

/**
 * Auth Service — stub implementing IAuthClient
 *
 * Future integrations:
 * - Apple Sign In via expo-apple-authentication + Supabase
 * - Google Sign In via @react-native-google-signin
 * - Facebook via react-native-fbsdk-next
 */
class StubAuthClient implements IAuthClient {
  private _user: AuthUser | null = null;
  private _listeners: Array<(u: AuthUser | null) => void> = [];

  async signInWithApple(): Promise<AuthUser> {
    const user: AuthUser = {
      id: `apple_${Date.now()}`,
      provider: "apple",
    };
    // TODO: expo-apple-authentication + Supabase signInWithIdToken
    this._setUser(user);
    return user;
  }

  async signInWithGoogle(): Promise<AuthUser> {
    const user: AuthUser = {
      id: `google_${Date.now()}`,
      provider: "google",
    };
    // TODO: @react-native-google-signin + Supabase signInWithIdToken
    this._setUser(user);
    return user;
  }

  async signInWithFacebook(): Promise<AuthUser> {
    const user: AuthUser = {
      id: `fb_${Date.now()}`,
      provider: "facebook",
    };
    // TODO: react-native-fbsdk-next + Supabase signInWithIdToken
    this._setUser(user);
    return user;
  }

  async signOut(): Promise<void> {
    this._setUser(null);
    // TODO: supabase.auth.signOut()
  }

  getCurrentUser(): AuthUser | null {
    return this._user;
  }

  onAuthStateChanged(cb: (user: AuthUser | null) => void): () => void {
    this._listeners.push(cb);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== cb);
    };
  }

  private _setUser(user: AuthUser | null) {
    this._user = user;
    this._listeners.forEach((l) => l(user));
  }
}

export const authService: IAuthClient = new StubAuthClient();
export type { AuthUser };
