import { GoogleGenAI } from "@google/genai";
import Product from "../models/Product.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function generateEmbeddings(input) {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: [input],
        })
        return response.embeddings
    }
    catch (err) {
        return null;
    }
}

async function vectorSearch(query) {
    try {
        const query_vector = await generateEmbeddings(query);
        const result = await Product.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: query_vector[0].values,
                    numCandidates: 3072,
                    limit: 5,
                }
            },
            {
                $project: {
                    title: 1,
                    discountPrice: 1,
                    stock: 1,
                }
            }
        ]);
        return result;
    }
    catch (err) {
        return JSON.stringify({ message: "failed to generate" })
    }
}

export async function testChat(req, res) {
    try {
        const query = req.body.query;
        const result = await productsEmbeding();
        res.status(200).json({ message: "sucessful", data: result })
    }
    catch (err) {
        res.status(500).json({ message: "failed to generate" })
    }
}

export async function productsEmbeding(req, res) {
    try {
        const products = await Product.find({ embedding: { $size: 0 } });
        const batchSize = 50;
        const delay = 1000;
        let totalDone = 0;
        let totalFailed = 0;

        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);

            const embeddings = await Promise.all(
                batch.map(async (p) => {
                    const text =
                        `title ${p.title} category ${p.category} brand ${p.brand} type ${p.productType} price ${p.discountPrice} stock ${p.stock}`;
                    const vector = await generateEmbeddings(text);
                    if (!vector) return null;
                    return { id: p._id, embedding: vector[0].values };
                })
            );

            const batchFailed = embeddings.filter(item => item === null).length;
            const batchDone = embeddings.length - batchFailed;
            totalDone += batchDone;
            totalFailed += batchFailed;

            console.log(`[Batch ${i}–${Math.min(i + batchSize, products.length)}] ✅ Done: ${batchDone} | ❌ Failed: ${batchFailed}`);

            for (const item of embeddings) {
                if (!item) continue;
                await Product.updateOne(
                    { _id: item.id },
                    { $set: { embedding: item.embedding } }
                );
            }

            await new Promise(res => setTimeout(res, delay));
        }

        console.log(`\n===== FINAL =====`);
        console.log(`✅ Total Done:   ${totalDone}`);
        console.log(`❌ Total Failed: ${totalFailed}`);
        res.status(200).send({
            message:"Embeddings done.",data:{
                sucess: totalDone,
                failed: totalFailed,
            }
        });
    }
    catch (err) {
        res.status(500).send({message:"failed to embed all products"})
    }
}