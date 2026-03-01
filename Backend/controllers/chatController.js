import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const sendChatMessage = async (req, res) => {
  try {
    console.log(req.body.messages);

    const context = `
    Vision is an e-commerce website that specializes in selling a wide variety of glasses, 
    including sunglasses, prescription glasses, and blue light blocking glasses. The website 
    offers filtering by style, color, and price, detailed product descriptions, a virtual 
    try-on feature using AR technology, and customer support for products, shipping, and returns.
    `;

    const prompt = `
    - You are an AI assistant for a website - Vision.
    - Answer the "query" based on the "context".
    - In the "query" the whole conversation is passed. which context role: 'user' means the question is asked by the user, 'assistant' means the question is asked by you. And the 'content' is the message for both roles.the last message in the "query" is the current question asked by the user.
    - If the answer not present in context, just say "I don't know".
    context: ${context}
    query: ${JSON.stringify(req.body.messages)}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    res.status(200).json({ message: response.text });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: err.message || "Chat failed" });
  }
};