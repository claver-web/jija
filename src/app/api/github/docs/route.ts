import { NextRequest, NextResponse } from "next/server";
import { fetchRepoArchitectureDoc } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const repo = searchParams.get("repo");

    if (!repo) {
      return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
    }

    const docData = await fetchRepoArchitectureDoc(repo);
    return NextResponse.json(docData);
  } catch (error) {
    console.error("Error fetching repo docs:", error);
    return NextResponse.json({ error: "Failed to load architecture doc" }, { status: 500 });
  }
}
