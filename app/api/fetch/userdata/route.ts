import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser } from "@/app/api/auth/user/clientUserServicies";

export async function GET(request: NextRequest) {
  const id = request.headers.get("Authorization")?.split(" ")[1];

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await getUser(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const id = request.headers.get("Authorization")?.split(" ")[1];

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const user = await updateUser(id, data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
