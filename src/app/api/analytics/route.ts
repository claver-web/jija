import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalVisits,
      visitsToday,
      visits7d,
      visits30d,
      rawUnique,
      topPagesRaw,
      topCountriesRaw,
      deviceBreakdownRaw,
      browserBreakdownRaw,
      recentVisitors,
    ] = await Promise.all([
      prisma.visitorLog.count(),
      prisma.visitorLog.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.visitorLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.visitorLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.visitorLog.groupBy({
        by: ["ipHash"],
        _count: { ipHash: true },
      }),
      prisma.visitorLog.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }),
      prisma.visitorLog.groupBy({
        by: ["country"],
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),
      prisma.visitorLog.groupBy({
        by: ["device"],
        _count: { device: true },
      }),
      prisma.visitorLog.groupBy({
        by: ["browser"],
        _count: { browser: true },
      }),
      prisma.visitorLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          path: true,
          country: true,
          city: true,
          device: true,
          browser: true,
          os: true,
          referrer: true,
          createdAt: true,
        },
      }),
    ]);

    const uniqueVisitors = rawUnique.length;

    const topPages = topPagesRaw.map((p) => ({
      path: p.path,
      count: p._count.path,
    }));

    const topCountries = topCountriesRaw.map((c) => ({
      country: c.country || "Unknown",
      count: c._count.country,
    }));

    const deviceBreakdown = deviceBreakdownRaw.map((d) => ({
      device: d.device || "Unknown",
      count: d._count.device,
    }));

    const browserBreakdown = browserBreakdownRaw.map((b) => ({
      browser: b.browser || "Unknown",
      count: b._count.browser,
    }));

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      visitsToday,
      visits7d,
      visits30d,
      topPages,
      topCountries,
      deviceBreakdown,
      browserBreakdown,
      recentVisitors,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
