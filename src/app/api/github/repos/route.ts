import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    const allRepos = await fetchGitHubRepos();

    const startIndex = (page - 1) * limit;
    const paginatedRepos = allRepos.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < allRepos.length;

    return NextResponse.json({
      repos: paginatedRepos,
      total: allRepos.length,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error("Internal GitHub Repos API error:", error);
    return NextResponse.json({ error: "Failed to load repositories" }, { status: 500 });
  }
}
