import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite", 
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const generateWithFallback = async (prompt) => {
  
    try {
      console.log(`Trying: ${model}`);
      const response = await ai.models.generateContent({
        model:'gemini-2.0-flash',
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      console.warn(`${model} failed (${err.status}), trying next...`);
      continue;
    }
  
  // all models failed — return friendly message instead of crashing
  return "I'm currently unavailable. Please try again later.";
};

export const sendChatMessage = async (req, res) => {
  try {
    const context = `
    Vision is an e-commerce website that specializes in selling a wide variety of glasses, 
    including sunglasses, prescription glasses, and blue light blocking glasses. The website 
    offers filtering by style, color, and price, detailed product descriptions, a virtual 
    try-on feature using AR technology, and customer support for products, shipping, and returns.
    `;

    const prompt = `
    - You are an AI assistant for Vision (an e-commerce glass selling site).
    - Answer the "query" based on the "context".
    - role: 'user' means question from user, 'assistant' means your previous reply.
    - The last message in query is the current question.
    - If answer not in context, say "I don't know".
    context: ${context}
    query: ${JSON.stringify(req.body.messages)}
    `;

    const reply = await generateWithFallback(prompt);
    res.status(200).json({ message: reply });

  } catch (err) {
    // backend will NEVER crash — always sends a response
    console.error("Chat error:", err);
    res.status(200).json({ 
      message: "I'm currently unavailable. Please try again later." 
    });
  }
};
