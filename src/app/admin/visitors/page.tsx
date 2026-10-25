import React from "react";
import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminVisitorsPage() {
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
    last30DaysLogs,
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
    }),
    prisma.visitorLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Group last 30 days by date for timeline chart
  const dateMap: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap[dateStr] = 0;
  }

  for (const log of last30DaysLogs) {
    const dateStr = new Date(log.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap[dateStr] !== undefined) {
      dateMap[dateStr]++;
    }
  }

  const dailyTimeline = Object.entries(dateMap).map(([date, visits]) => ({
    date,
    visits,
  }));

  const initialData = {
    totalVisits,
    uniqueVisitors: rawUnique.length,
    visitsToday,
    visits7d,
    visits30d,
    topPages: topPagesRaw.map((p) => ({ path: p.path, count: p._count.path })),
    topCountries: topCountriesRaw.map((c) => ({
      country: c.country || "Unknown",
      count: c._count.country,
    })),
    deviceBreakdown: deviceBreakdownRaw.map((d) => ({
      device: d.device || "Desktop",
      count: d._count.device,
    })),
    browserBreakdown: browserBreakdownRaw.map((b) => ({
      browser: b.browser || "Unknown",
      count: b._count.browser,
    })),
    recentVisitors: recentVisitors.map((v) => ({
      id: v.id,
      path: v.path,
      country: v.country,
      city: v.city,
      device: v.device,
      browser: v.browser,
      os: v.os,
      referrer: v.referrer,
      createdAt: v.createdAt.toISOString(),
    })),
    dailyTimeline,
  };

  return <AnalyticsDashboard initialData={initialData} />;
}
