import { NextRequest, NextResponse } from "next/server";
import { fetchRepositoryMetadata, getClientRepositories, updateRepositoryMetadata } from "@/app/api/auth/repository/clientRepositoryServices";
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

export async function PATCH(request: NextRequest) {

    await connectMongoWithRetry();

    const id = request.headers.get("Authorization")?.split(" ")[1];

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const { doc_name } = await request.json();

    const repository = await fetchRepositoryMetadata(doc_name);

    return NextResponse.json(repository);
    
}

export async function PUT(request: NextRequest) {

    await connectMongoWithRetry();

    const { doc_name, metadata } = await request.json();

    await updateRepositoryMetadata(doc_name, metadata);

    return NextResponse.json({ message: "Repository metadata updated successfully" }, { status: 200 });

}
