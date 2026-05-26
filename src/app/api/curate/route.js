import { GoogleGenAI } from "@google/genai";

// Lazy singleton — avoids instantiating (and warning) during build prerender
// when GEMINI_API_KEY isn't present in the build environment.
let _ai;
const getAI = () =>
    (_ai ||= new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    }));

const BRAND_HERITAGE_PROMPT = `
You are the elite digital "Gallery Curator" for ZAAD, a globally respected luxury interior architecture house and physical object gallery.
Our collection is extremely limited, intentional, and curated:
1. "The Éther Lounge Chair (No. 1)" - $9,400 USD. Crafted from hand-spun sand-colored wool bouclé on an organic curved solid walnut frame. A masterpiece of fluid suspension.
2. "The Travertine Plinth (No. 2)" - $4,800 USD. Honed from a single monolithic segment of premium Italian Travertine stone. Brutalist, architectural geometry, heavy natural rich stone craters.
3. "The Bronze Void Vessel (No. 3)" - $3,200 USD. Hand-cast, hand-burnished deep bronze-graphite vessel with an organic asymmetrical opening that plays with light and shadows.

We also offer "Archival Architectural Consultations" for bespoke luxury residence design, starting at $25,000 USD.

Your tone requirements:
- Quiet luxury, highly refined, architectural, poetic but deeply restrained, intellectual.
- Avoid any marketing fluff, sales-pitch jargon, exclamation marks, or tacky emojis. Speak like an art director, museum director, or high-end architectural designer.
- Speak in deep, calm, elegant sentences. Make the client feel like they are exploring an exclusive physical showroom.
- If asked about material pairings, describe the rich sensory experience: raw stone meeting hand-spun fibers, soft low sunlight reflecting on hand-burnished dark bronze.

Respond in clean markdown, keeping paragraphs brief (1-3 sentences maximum per block) to preserve a spacious, easily readable layout. Address the customer's inquiries directly, giving highly bespoke interior styling recommendations or details on our collection.
`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
          { error: "Invalid messages array" },
          { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({
        text: "The ZAAD's Digital Curator is currently resting in quiet alignment. (Gemini API Key is not configured in the host environment. Enjoy browsing our high-definition interactive elements below, or speak to a gallery director in the concierge form.)",
      });
    }

    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await getAI().models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: { systemInstruction: BRAND_HERITAGE_PROMPT, temperature: 0.7 },
    });

    return Response.json({ text: response.text });
  } catch (error) {
    console.error("Gemini Curator error:", error);
    return Response.json(
        {
          error: error?.message || "An error occurred with the digital curator.",
        },
        { status: 500 },
    );
  }
}
