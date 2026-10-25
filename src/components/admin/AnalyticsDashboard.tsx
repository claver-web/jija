"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Users,
  Eye,
  Calendar,
  Globe2,
  Smartphone,
  Compass,
  ArrowUpRight,
  Clock,
} from "lucide-react";

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  visitsToday: number;
  visits7d: number;
  visits30d: number;
  topPages: { path: string; count: number }[];
  topCountries: { country: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  browserBreakdown: { browser: string; count: number }[];
  recentVisitors: Array<{
    id: string;
    path: string;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    referrer: string | null;
    createdAt: Date | string;
  }>;
  dailyTimeline: { date: string; visits: number }[];
}

const MONO_PIE_COLORS = ["#000000", "#52525b", "#a1a1aa", "#d4d4d8", "#71717a"];

export function AnalyticsDashboard({ initialData }: { initialData: AnalyticsData }) {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "all">("30d");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter daily timeline based on date range
  const filteredTimeline =
    dateRange === "7d"
      ? data.dailyTimeline.slice(-7)
      : dateRange === "30d"
      ? data.dailyTimeline.slice(-30)
      : data.dailyTimeline;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Visitor Telemetry & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Privacy-first insights, real-time traffic volume, and edge geographic distribution.
          </p>
        </div>

        {/* Date Filter */}
        <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-800 p-0.5 bg-neutral-100 dark:bg-neutral-900 text-xs font-medium">
          <button
            onClick={() => setDateRange("7d")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === "7d"
                ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange("30d")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === "30d"
                ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange("all")}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === "all"
                ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm font-semibold"
                : "text-neutral-500 hover:text-black dark:hover:text-white"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase mb-2">
            <span>Total Visits</span>
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950 dark:text-white">
            {data.totalVisits.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">All recorded events</p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase mb-2">
            <span>Unique Visitors</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950 dark:text-white">
            {data.uniqueVisitors.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Distinct hashed IPs</p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase mb-2">
            <span>Today</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950 dark:text-white">
            {data.visitsToday.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Last 24 hours</p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase mb-2">
            <span>This Week</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950 dark:text-white">
            {data.visits7d.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Trailing 7 days</p>
        </div>

        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase mb-2">
            <span>This Month</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950 dark:text-white">
            {data.visits30d.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Trailing 30 days</p>
        </div>
      </div>

      {/* Main Timeline Chart */}
      <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
              Traffic Volume Trend
            </h3>
            <p className="text-xs text-neutral-400">Daily visit telemetry</p>
          </div>
        </div>

        {mounted ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimeline}>
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000000",
                    borderColor: "#3f3f46",
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#ffffff" }}
                  activeDot={{ r: 6, fill: "#ffffff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-xs text-neutral-400">
            Loading chart telemetry...
          </div>
        )}
      </div>

      {/* Two Column Section: Top Pages & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Pages */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
            Top Visited Pages
          </h3>

          {data.topPages.length === 0 ? (
            <p className="text-xs text-neutral-400 py-8 text-center">No page traffic recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topPages.map((page, idx) => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                      {page.path}
                    </span>
                    <span className="font-mono text-neutral-500 font-semibold">{page.count} visits</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full"
                      style={{
                        width: `${Math.max(
                          6,
                          (page.count / Math.max(1, data.topPages[0]?.count || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device & Browser Breakdown */}
        <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider mb-4">
              Device Breakdown
            </h3>
            {data.deviceBreakdown.length === 0 ? (
              <p className="text-xs text-neutral-400">No device data.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {data.deviceBreakdown.map((dev) => (
                  <div
                    key={dev.device}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-center"
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white">{dev.device}</p>
                    <p className="text-xs font-mono text-neutral-500">{dev.count}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider mb-4">
              Top Geographic Origins
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.topCountries.map((c) => (
                <div
                  key={c.country}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs"
                >
                  <Globe2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{c.country}</span>
                  <span className="font-mono text-neutral-500">({c.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase font-mono tracking-wider">
            Recent 50 Visitors
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            IP addresses are salted and hashed (never stored in plain text).
          </p>
        </div>

        {data.recentVisitors.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No visitor logs recorded yet. Visit public pages to see logs appear.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 text-neutral-500 font-mono uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Page Path</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Device & OS</th>
                  <th className="px-6 py-3">Browser</th>
                  <th className="px-6 py-3">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-sans">
                {data.recentVisitors.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-mono text-neutral-400 whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}{" "}
                      {new Date(v.createdAt).toLocaleDateString([], {
                        month: "numeric",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                      {v.path}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600 dark:text-neutral-400">
                      {v.city && v.city !== "Unknown" ? `${v.city}, ` : ""}
                      {v.country || "Unknown"}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600 dark:text-neutral-400">
                      {v.device || "Desktop"} • {v.os || "Other"}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-600 dark:text-neutral-400">
                      {v.browser || "Other"}
                    </td>
                    <td className="px-6 py-3.5 text-neutral-400 truncate max-w-xs font-mono">
                      {v.referrer || "Direct"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
