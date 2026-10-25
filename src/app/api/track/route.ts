import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function parseUserAgent(ua: string) {
  let device = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    device = "Mobile";
  }

  let browser = "Other";
  if (/edg([ea]|ios)?\//i.test(ua)) browser = "Edge";
  else if (/opr\/|opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let os = "Other";
  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer : null;

    // Ignore admin and internal API tracking
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ status: "ignored" });
    }

    // Read client IP from proxy headers
    const forwarded = req.headers.get("x-forwarded-for");
    const rawIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    // Hash IP with SHA-256 + salt (never store raw IP)
    const salt = process.env.NEXTAUTH_SECRET || "privacy_tracking_salt_123456";
    const ipHash = crypto.createHash("sha256").update(`${rawIp}:${salt}`).digest("hex");

    // Check rate limit: 1 log per IP per path per 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentEntry = await prisma.visitorLog.findFirst({
      where: {
        ipHash,
        path,
        createdAt: {
          gte: thirtyMinutesAgo,
        },
      },
      select: { id: true },
    });

    if (recentEntry) {
      return NextResponse.json({ status: "rate_limited" });
    }

    // Parse User-Agent
    const uaString = req.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(uaString);

    // Country and City from Vercel edge headers
    const country = req.headers.get("x-vercel-ip-country") || "Local/Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";

    await prisma.visitorLog.create({
      data: {
        ipHash,
        userAgent: uaString.slice(0, 300),
        country,
        city,
        path: path.slice(0, 200),
        referrer: referrer ? referrer.slice(0, 300) : null,
        device,
        browser,
        os,
      },
    });

    return NextResponse.json({ status: "tracked" });
  } catch (error: any) {
    // If database connection timed out during cold-start or pool wait, fail silently
    if (error?.code === "P2024" || error?.message?.includes("connection pool")) {
      console.warn("Visitor tracking deferred: Database connection pool warming up.");
      return NextResponse.json({ status: "deferred" });
    }
    console.error("Tracking error:", error?.message || error);
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
