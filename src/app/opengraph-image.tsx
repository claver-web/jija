import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Portfolio — Systems Engineer & Agentic AI Specialist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle background grid / glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            backgroundColor: "#27272a",
            opacity: 0.4,
            filter: "blur(120px)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            ⌘
          </div>
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            ENGINEERING & AI PORTFOLIO
          </span>
        </div>

        {/* Main Title & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "950px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-2px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Engineering Scalable Systems & Autonomous AI Agents
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#a1a1aa",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Deterministic architectures • Multi-agent cognitive pipelines • High-performance web
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: "32px",
            fontSize: "18px",
            fontFamily: "monospace",
            color: "#71717a",
          }}
        >
          <span>Next.js 14 • Prisma • TypeScript</span>
          <span style={{ color: "#ffffff" }}>portfolio.local</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
