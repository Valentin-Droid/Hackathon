import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
    try {
        const { cardId, frontContent, backContent } = await req.json();

        await db.query(
            "INSERT INTO pdf_files (file_id, file_name, uploaded_file, file_content, question, answer, thumbUp, thumbDown) VALUES (?, ?, ?, ? ,?, ?, ?, ?)",
            [file_id, file_name, uploaded_file, file_content, question, answer, thumbUp, thumbDown]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to store flashcard" }, { status: 500 });
    }
}