import { GoogleGenAI } from "@google/genai";

// The Gemini API key is automatically injected into the environment by AI Studio.
const apiKey = process.env.GEMINI_API_KEY;

export function getAI() {
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateInsight(prompt: string) {
  const ai = getAI();
  if (!ai) {
    throw new Error("Gemini API key is not configured in AI Studio Settings.");
  }
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "Tidak ada insight saat ini.";
}
