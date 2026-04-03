import { GoogleGenAI } from "@google/genai";

// The API key is injected by the environment
const apiKey = process.env.GEMINI_API_KEY || "";

export const ai = new GoogleGenAI({ apiKey });

export const MODELS = {
  TEXT: "gemini-3-flash-preview",
  VISION: "gemini-2.5-flash-image",
  AUDIO: "gemini-2.5-flash-preview-tts",
  ANALYTICS: "gemini-3.1-pro-preview",
};
