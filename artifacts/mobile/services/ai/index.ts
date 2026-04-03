import { ICoachClient, CoachMessage } from "@/services/contracts";

/**
 * AI Coach Service — stub implementing ICoachClient
 *
 * Future integration: OpenAI GPT-4 via backend proxy
 * Never expose the OpenAI key on the client — route through a backend proxy.
 */

const MOTIVATIONAL_MESSAGES: CoachMessage[] = [
  {
    text: "كل لحظة صمود هي انتصار حقيقي. أنت أقوى مما تظن.",
    type: "motivational",
  },
  {
    text: "جسمك يشكرك الآن. استمر في هذا الطريق الرائع.",
    type: "motivational",
  },
  {
    text: "الإرادة عضلة، وأنت تقويها كل يوم.",
    type: "motivational",
  },
  {
    text: "عندما تشعر بالرغبة، تذكر لماذا بدأت.",
    type: "motivational",
  },
  {
    text: "النجاح ليس التوقف عن السقوط، بل الاستمرار في النهوض.",
    type: "motivational",
  },
  {
    text: "أنت لا تتخلى عن شيء، أنت تختار الأفضل لنفسك.",
    type: "motivational",
  },
  {
    text: "كل يوم بدون عادة ضارة هو استثمار في صحتك ومستقبلك.",
    type: "motivational",
  },
  {
    text: "الجسم يبدأ بالتعافي منذ اللحظة الأولى. أنت على الطريق الصحيح.",
    type: "motivational",
  },
  {
    text: "القوة الحقيقية هي في مقاومة الإغراء حين يكون أصعب ما يكون.",
    type: "motivational",
  },
  {
    text: "صحتك هي أثمن ما تملك. اعتنِ بها اليوم.",
    type: "motivational",
  },
];

class StubCoachClient implements ICoachClient {
  async getMotivationalMessage(_daysSober?: number): Promise<CoachMessage> {
    // TODO: POST to /api/coach/message with user context (streakDays, habitType, etc.)
    const idx = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[idx];
  }

  async getChatResponse(
    _message: string,
    _context: Record<string, unknown>
  ): Promise<string> {
    // TODO: POST to /api/coach/chat
    return "أنت تسير بشكل رائع. استمر في هذا المسار!";
  }
}

export const aiService: ICoachClient = new StubCoachClient();
export type { CoachMessage };
