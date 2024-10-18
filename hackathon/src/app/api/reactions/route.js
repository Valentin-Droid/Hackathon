import { NextResponse } from "next/server";

// In-memory storage for reactions (for simplicity)
const reactions = {};

// Function to handle POST requests for reactions
export async function POST(req) {
    try {
        const { cardId, reaction } = await req.json();

        if (!reactions[cardId]) {
            reactions[cardId] = { thumbsUp: 0, thumbsDown: 0 };
        }

        if (reaction === "thumbsUp") {
            reactions[cardId].thumbsUp += 1;
        } else if (reaction === "thumbsDown") {
            reactions[cardId].thumbsDown += 1;
        }

        return NextResponse.json({ success: true, reactions: reactions[cardId] });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}