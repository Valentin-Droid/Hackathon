import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import PDFDocument from 'pdfkit';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is your premium OpenAI API key
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function generateContent(filePath, prompt) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const fileContent = pdfData.text;

    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: `${prompt}\n\n${fileContent}` },
                ],
                max_tokens: 1000,
            });
            return response.choices[0].message.content;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                // Rate limit exceeded, retry after delay
                retries++;
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
            } else if (error.response && error.response.status === 402) {
                // Insufficient quota
                throw new Error("Insufficient quota. Please check your plan and billing details.");
            } else {
                throw error;
            }
        }
    }
    throw new Error("Exceeded maximum retries");
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { filePath, prompt } = req.body;

        if (!filePath) {
            return res.status(400).json({ error: "filePath is required" });
        }

        try {
            const generatedText = await generateContent(filePath, prompt);

            const newPdfPath = path.join(process.cwd(), 'public/uploads', 'generated.pdf');
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(newPdfPath));
            doc.text(generatedText);
            doc.end();

            res.status(200).json({ generatedPdfPath: newPdfPath });
        } catch (error) {
            console.error("Error generating content:", error);
            res.status(500).json({ error: "Error generating content.", details: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}