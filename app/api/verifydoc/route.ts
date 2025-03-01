import { NextResponse, NextRequest } from "next/server";
import User from "@/app/api/lib/models/User";
import Repository from "@/app/api/lib/models/Repository";


const verifyUserWithDoc = async (userId: string, doc_name: string) => {

  const user = await User.findOne({ clerkUid: userId }, { githubUid: 1 });
  if (!user) return false;

  const repository = await Repository.findOne({ owner: user.githubUid, name: doc_name });
  const valid = !!repository;

  return valid;
};

export async function POST(req: NextRequest) {
  try {
    const { userId, doc_name } = await req.json();

    console.log(userId, doc_name);

    if (!userId || !doc_name) {
      console.log("Invalid input");
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const validDoc = await verifyUserWithDoc(userId, doc_name);
    console.log("validDoc", validDoc);

    if (!validDoc) {
      console.log("Repository not found");
      return NextResponse.json({ error: `Repository ${doc_name} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
