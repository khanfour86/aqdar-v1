/**
 * Analytics Service — stub for future Firebase Analytics integration
 *
 * Future integrations:
 * - @react-native-firebase/analytics
 * - Amplitude
 * - Mixpanel
 */

type EventProperties = Record<string, string | number | boolean>;

export const analytics = {
  track(event: string, properties?: EventProperties): void {
    if (__DEV__) {
      console.log("[Analytics]", event, properties);
    }
    // TODO: analytics().logEvent(event, properties)
  },

  screen(screenName: string): void {
    if (__DEV__) {
      console.log("[Analytics] Screen:", screenName);
    }
    // TODO: analytics().logScreenView({ screen_name: screenName })
  },

  setUser(userId: string): void {
    // TODO: analytics().setUserId(userId)
  },
};
