import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";
import { VisitorTracker } from "@/components/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Shubham Sharma — Engineer & AI Specialist",
    template: "%s | Shubham Sharma",
  },
  description:
    "Production-grade portfolio showcasing full-stack engineering, autonomous agentic AI systems, and modern software architecture.",
  keywords: ["Software Engineer", "Full Stack", "Agentic AI", "Next.js", "TypeScript", "Prisma"],
  authors: [{ name: "Shubham Sharma" }],
  creator: "Shubham Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio.local",
    title: "Shubham Sharma — Engineer & AI Specialist",
    description: "Production-grade portfolio showcasing full-stack engineering and autonomous AI systems.",
    siteName: "Shubham Sharma Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Sharma — Engineer & AI Specialist",
    description: "Production-grade portfolio showcasing full-stack engineering and autonomous AI systems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground bg-noise min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <VisitorTracker />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
