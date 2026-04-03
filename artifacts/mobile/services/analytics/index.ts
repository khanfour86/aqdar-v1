import { IAnalyticsClient } from "@/services/contracts";

/**
 * Analytics Service — stub implementing IAnalyticsClient
 *
 * Swap this adapter for:
 * - @react-native-firebase/analytics
 * - Amplitude
 * - Mixpanel
 */
class StubAnalyticsClient implements IAnalyticsClient {
  logEvent(name: string, params?: Record<string, unknown>): void {
    if (__DEV__) console.log("[Analytics] event:", name, params);
    // TODO: analytics().logEvent(name, params)
  }

  setUserId(id: string | null): void {
    if (__DEV__) console.log("[Analytics] setUserId:", id);
    // TODO: analytics().setUserId(id)
  }

  setUserProperty(key: string, value: string): void {
    if (__DEV__) console.log("[Analytics] setUserProperty:", key, value);
    // TODO: analytics().setUserProperties({ [key]: value })
  }

  logScreenView(screenName: string): void {
    if (__DEV__) console.log("[Analytics] screen:", screenName);
    // TODO: analytics().logScreenView({ screen_name: screenName })
  }
}

export const analyticsService: IAnalyticsClient = new StubAnalyticsClient();

// Legacy compat
export const analytics = {
  track: (event: string, props?: Record<string, unknown>) =>
    analyticsService.logEvent(event, props),
  screen: (name: string) => analyticsService.logScreenView(name),
  setUser: (id: string) => analyticsService.setUserId(id),
};
