import { NextResponse } from "next/server";
import OpenAI from "openai";

const API_TOKEN = process.env["GITHUB_TOKEN"];
const ENDPOINT = "https://models.inference.ai.azure.com";
const MODEL_NAME = "gpt-4o-mini";

// Fonction pour traiter la requête POST
export async function POST(req) {
  try {
    const { question } = await req.json();
    const client = createOpenAIClient();

    const openAIResponse = await fetchChatCompletion(client, question);

    return NextResponse.json({ result: openAIResponse });
  } catch (error) {
    return handleError();
  }
}

// Fonction pour créer une instance du client OpenAI
const createOpenAIClient = () => {
  return new OpenAI({
    baseURL: ENDPOINT,
    apiKey: API_TOKEN,
  });
};

// Fonction pour générer une réponse via OpenAI
const fetchChatCompletion = async (client, question) => {
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Je vais te fournir un extrait de texte ci-dessous. À partir de cet extrait, crée une question pertinente liée au contenu et donne une réponse concise. 
        La longueur de la réponse doit être similaire à celle de la question. 
        Retourne la question et la réponse dans le format JSON suivant :
        {
          "question": "La question générée à partir du texte",
          "answer": "La réponse à cette question"
        }`,
      },
      { role: "user", content: question },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 500, // Réduction du nombre maximal de tokens pour limiter la longueur de la réponse
    model: MODEL_NAME,
  });

  return response.choices[0].message.content;
};

// Fonction pour gérer les erreurs
const handleError = () => {
  return NextResponse.json(
    { error: "Failed to process request" },
    { status: 500 }
  );
};
