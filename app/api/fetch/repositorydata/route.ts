import { NextRequest, NextResponse } from "next/server";
import { getClientRepositories } from "@/app/api/auth/repository/clientRepositoryServices";
import connectMongoWithRetry from "../../lib/db/connectMongo";

export async function GET(request: NextRequest) {

    await connectMongoWithRetry();

    const id = request.headers.get("Authorization")?.split(" ")[1];

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const repositories = await getClientRepositories(id);

    return NextResponse.json(repositories);

}