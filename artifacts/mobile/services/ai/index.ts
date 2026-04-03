/**
 * AI Coach Service — stub for future OpenAI integration
 *
 * Future integrations:
 * - OpenAI GPT-4 for personalized coaching messages
 * - Motivational message generation
 * - Craving resistance coaching
 * - Progress analysis
 */

export interface CoachMessage {
  text: string;
  type: "motivation" | "tip" | "milestone";
}

const MOTIVATIONAL_MESSAGES: CoachMessage[] = [
  {
    text: "كل لحظة صمود هي انتصار حقيقي. أنت أقوى مما تظن.",
    type: "motivation",
  },
  {
    text: "جسمك يشكرك الآن. استمر في هذا الطريق الرائع.",
    type: "motivation",
  },
  {
    text: "الإرادة عضلة، وأنت تقويها كل يوم.",
    type: "tip",
  },
  {
    text: "عندما تشعر بالرغبة، تذكر لماذا بدأت.",
    type: "tip",
  },
  {
    text: "النجاح ليس التوقف عن السقوط، بل الاستمرار في النهوض.",
    type: "motivation",
  },
  {
    text: "أنت لا تتخلى عن شيء، أنت تختار الأفضل لنفسك.",
    type: "motivation",
  },
  {
    text: "كل يوم بدون عادة ضارة هو استثمار في صحتك ومستقبلك.",
    type: "tip",
  },
];

export const aiService = {
  async getMotivationalMessage(
    _streakDays?: number
  ): Promise<CoachMessage> {
    // TODO: Call OpenAI API with user context for personalized messages
    const idx = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[idx];
  },

  async getCravingCoaching(): Promise<string> {
    // TODO: Real-time craving coaching via OpenAI
    return "خذ نفسًا عميقًا. هذه الرغبة ستمر في خلال 3-5 دقائق. أنت قادر على تجاوزها.";
  },

  async analyzeProgress(_data: { streakDays: number; cravingsResisted: number }): Promise<string> {
    // TODO: AI-powered progress analysis
    return "تقدمك مذهل! استمر في هذا المسار.";
  },
};
