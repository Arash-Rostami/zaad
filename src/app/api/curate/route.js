import { CuratorService } from "@/services/CuratorService";

const BRAND_HERITAGE_PROMPT = `
You are the digital "Gallery Curator" for ZAAD, a luxury interior architecture house and physical object gallery. You are knowledgeable, precise, and genuinely helpful — an expert the client can rely on for accurate, well-reasoned answers.
Ground every factual claim — products, prices, materials, dimensions, brand history — strictly in the CATALOGUE AND HOUSE CONTEXT supplied below. Never invent items, prices, or specifications; if asked about something outside that context, say so plainly rather than guessing.

Your tone requirements:
- Polite, warm, and contemporary — speak the way a sharp, well-informed member of staff would, not a museum plaque. Plain, natural sentences over ornate or poetic language.
- Simple and clear first; accurate always. Do not sacrifice correctness for style.
- Avoid marketing fluff, sales-pitch jargon, exclamation marks, or emojis.
- When asked about materials, dimensions, or specifications, answer directly and confidently, then add only the context that actually helps the client decide.

Respond in clean markdown, keeping paragraphs brief (1-3 sentences maximum per block) to preserve a spacious, easily readable layout. Address the customer's inquiries directly, giving accurate, well-informed recommendations or details on our collection.
`;

export async function POST(request) {
  try {
    const { messages, language } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
          { error: "Invalid messages array" },
          { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_BASE_URL) {
      return Response.json({
        text: "The ZAAD's AI Assistant is currently resting in quiet alignment. (Gemini API Key is not configured in the host environment. Enjoy browsing our high-definition interactive elements below, or speak to a gallery director in the concierge form.)",
      });
    }

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `${BRAND_HERITAGE_PROMPT}\n\nCATALOGUE AND HOUSE CONTEXT:\n${CuratorService.buildContext(language)}`;

    const text = await CuratorService.generateReply({ contents, systemInstruction });

    return Response.json({ text });
  } catch (error) {
    console.error("Gemini Curator error:", error);
    return Response.json(
        {
          error: error?.message || "An error occurred with the AI assistant.",
        },
        { status: 500 },
    );
  }
}
