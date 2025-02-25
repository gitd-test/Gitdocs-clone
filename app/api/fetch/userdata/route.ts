import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser } from "@/app/api/auth/user/clientUserServicies";

export async function GET(request: NextRequest) {

    const id = request.headers.get("Authorization")?.split(" ")[1];

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await getUser(id);

    return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
    const id = request.headers.get("Authorization")?.split(" ")[1];

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const user = await updateUser(id, data);
    return NextResponse.json(user);
}

