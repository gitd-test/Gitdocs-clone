import { NextRequest, NextResponse } from "next/server";
import { optimizeAI } from "@/app/api/lib/ai/optimizeAI";

export async function POST(request: NextRequest) {
    const { userId, prompt } = await request.json();

    if (!userId || !prompt) {
        return NextResponse.json({ error: "Missing userId or prompt" }, { status: 400 });
    }

    const response = await optimizeAI(userId, prompt);
    return NextResponse.json(response);
}
