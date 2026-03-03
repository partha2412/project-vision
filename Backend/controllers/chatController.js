import { GoogleGenAI } from "@google/genai";
import Product from "../models/Product.js";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash",
  "gemini-2.0-flash-lite-preview",
  "gemini-2.0-flash-preview",       
  "gemini-1.5-flash-preview",
];

// helper — sits right above generateEmbeddings
const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const generateEmbeddings = async (texts, chunkSize = 50) => {
  // single string — no chunking needed
  if (!Array.isArray(texts)) {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: texts,
    });
    return response.embeddings[0].values;
  }

  // array — chunk it
  const chunks = chunkArray(texts, chunkSize);
  const allEmbeddings = [];

  for (const chunk of chunks) {
    try {
      const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: chunk,
      });
      allEmbeddings.push(...response.embeddings.map(e => e.values));
    }
    catch (err) {
      console.error("Embedding error for chunk:", err.status, err.error.message);
    }
  }
  console.log("Bulk embeddings generated for", texts.length, "items.");
  return allEmbeddings;
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
      console.warn(`failed (${err.status}) trying next...`);
      // await new Promise(resolve => setTimeout(resolve, 800));
    }
    continue;
  }

  // all models failed — return friendly message instead of crashing
  return "Failed to generate. Please try again later.";
};

export const sendChatMessage = async (req, res) => {
  try {
    const messages = req.body.messages;
    const recentMessages = messages.slice(-6);

    const userQuery = messages[messages.length - 1]?.content || "";

    // 1. Embed the user's latest message
    const queryEmbedding = await generateEmbeddings(userQuery);

    // 2. Atlas Vector Search — no manual cosine, no loading all products
    const ranked = await Product.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",       // whatever name you give in Atlas
          path: "embedding",           // matches your field name
          queryVector: queryEmbedding, // must also be 3072 dimensions
          numCandidates: 50,           // scan 150, pick best 5 (rule: 10-20x of limit)
          limit: 5,                    // return top 5
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          discountPrice: 1,
          category: 1,
          brand: 1,
          productType: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);

    // 3. Build context from top matches
    const productContext = ranked
    .map(p => `- ${p.title} | ${p.category} | ${p.brand} | ${p.productType} | ₹${p.discountPrice || p.price}`)
    .join("\n");
    
    // 4. Build prompt with RAG context
    const prompt = `
    - You are an AI assistant for Vision (an e-commerce glasses store).
    - Answer the "query" based on the "context" and "products".
    - role: 'user' means question from user, 'assistant' means your previous reply.
    - The last message in query is the current question.
    - If answer not in context or products, say "I don't know".

    context: Vision sells sunglasses, prescription glasses, and blue light blocking glasses.
    
    products:
    ${productContext}
    
    query: ${JSON.stringify(recentMessages)}
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
