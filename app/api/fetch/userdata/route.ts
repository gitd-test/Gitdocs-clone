import { NextRequest, NextResponse } from "next/server";
import { getUser, updateUser } from "@/app/api/auth/user/clientUserServicies";

// GET User Data
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
    console.error("Error fetching user:", error); // Log detailed error for debugging
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}


// PATCH User Data
export async function PATCH(request: NextRequest) {
  const id = request.headers.get("Authorization")?.split(" ")[1];

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();

    // Specify updatable fields
    const allowedFields = ["subscriptionType", "stepsCompleted"];

    // Filter incoming data to include only allowed fields
    const updateData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce<Record<string, any>>((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updatedUser = await updateUser(id, updateData);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // Log detailed error for debugging
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}