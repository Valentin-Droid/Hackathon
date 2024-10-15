import { NextResponse } from "next/server"; // Use NextResponse for the response
import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

// Named export for POST method in Next.js 13+ API route
export async function POST(req) {
  try {
    const { question } = await req.json(); // Get the JSON body

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: question }, // Using the question sent in the request
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: modelName,
    });

    // Return the response using NextResponse in Next.js 13+
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error) {
    // Return error response
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
