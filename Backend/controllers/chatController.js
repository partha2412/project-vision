import { GoogleGenAI } from "@google/genai";
import Product from "../models/Product.js";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

export const generateEmbeddings = async (texts) => {
  try {
    const isSingle = !Array.isArray(texts);
    const inputs = isSingle ? [texts] : texts;

    const allEmbeddings = [];

    for (let i = 0; i < inputs.length; i += 100) {
      const chunk = inputs.slice(i, i + 100);
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: chunk,
      });
      allEmbeddings.push(...response.embeddings.map(e => e.values));
      console.log(`Embedded ${Math.min(i + 100, inputs.length)} / ${inputs.length}`);
    }

    if (isSingle) {
      return allEmbeddings[0]?.length ? JSON.stringify(allEmbeddings[0]) : JSON.stringify([]);
    }

    return allEmbeddings;

  } catch (err) {
    console.error("Embedding failed:", err.message);
    return Array.isArray(texts) ? texts.map(() => []) : JSON.stringify([]);
  }
};

const generateWithFallback = async (prompt) => {
  for (const model of MODELS) {
    try {
      console.log(`Trying: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      return response.text;
    } catch (err) {
      console.warn(`${model} failed (${"\n" + err.status}), trying next...`);
    }
    continue;
  }

  // all models failed — return friendly message instead of crashing
  return "I'm currently unavailable. Please try again later.";
};

// Cosine similarity helper
const cosineSimilarity = (a, b) =>
  a.reduce((sum, v, i) => sum + v * b[i], 0) /
  (Math.sqrt(a.reduce((s, v) => s + v * v, 0)) *
    Math.sqrt(b.reduce((s, v) => s + v * v, 0)));

export const sendChatMessage = async (req, res) => {
  try {
    const messages = req.body.messages;
    const userQuery = messages[messages.length - 1]?.content || "";

    // 1. Embed the user's latest message
    const queryEmbedding = JSON.parse(await generateEmbeddings(userQuery));

    // 2. Fetch all products that have embeddings
    const products = await Product.find(
      { isDeleted: false, embedding: { $exists: true, $ne: [] } },
      { title: 1, description: 1, price: 1, discountPrice: 1, category: 1, brand: 1, productType: 1, embedding: 1 }
    );

    // 3. Score + rank → top 5
    const TOP_N = 5;
    const ranked = products
      .map(p => ({
        ...p._doc,
        score: cosineSimilarity(queryEmbedding, p.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_N);

    // 4. Build context from top matches
    const productContext = ranked
      .map(p => `- ${p.title} | ${p.category} | ${p.brand} | ${p.productType} | ₹${p.discountPrice || p.price} | ${p.description}`)
      .join("\n");

    // 5. Build prompt with RAG context
    const prompt = `
    - You are an AI assistant for Vision (an e-commerce glasses store).
    - Answer the "query" based on the "context" and "products".
    - role: 'user' means question from user, 'assistant' means your previous reply.
    - The last message in query is the current question.
    - If answer not in context or products, say "I don't know".

    context: Vision sells sunglasses, prescription glasses, and blue light blocking glasses.
    
    products:
    ${productContext}
    
    query: ${JSON.stringify(messages)}
    `;

    const reply = await generateWithFallback(prompt);
    console.log("Response sent.");
    res.status(200).json({ message: reply });

  } catch (err) {
    console.error("Chat error:", err);
    res.status(200).json({
      message: "I'm currently unavailable. Please try again later."
    });
  }
};
