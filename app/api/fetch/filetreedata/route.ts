import { NextRequest, NextResponse } from "next/server";
import { getFileTree } from "@/app/api/auth/filetree/clientFileTreeServices";

export async function GET(request: NextRequest) {

    const userId = request.nextUrl.searchParams.get("userId");
    const doc_name = request.nextUrl.searchParams.get("doc_name");
    const path = request.nextUrl.searchParams.get("path");

    if (!userId || !doc_name) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const fileTree = await getFileTree(userId, doc_name, path as string);

    if (fileTree === "Data not found") {
        return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    return NextResponse.json(fileTree);
}
