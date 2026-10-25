import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Award, ExternalLink, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Certifications & Credentials",
  description: "Verified certifications, professional achievements, and technical credentials.",
};

export const revalidate = 60;

function isImageFormat(url: string | null | undefined): boolean {
  if (!url) return false;
  if (/\.pdf($|\?)/i.test(url)) return false;
  return /\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url) || url.startsWith("data:image/");
}

export default async function CertificatesPage() {
  let certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    issueDate: Date;
    credentialUrl: string | null;
    imageUrl: string | null;
  }> = [];

  try {
    certificates = await prisma.certificate.findMany({
      orderBy: [{ issueDate: "desc" }, { order: "asc" }],
    });
  } catch (error) {
    console.error("Failed to load certificates:", error);
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-500 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
            Verified Credentials
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white mb-4">
            Certifications & Licenses
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg">
            Professional industry certifications validating cloud architecture, AI engineering, and software development standards.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50">
            <Award className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">
              No certificates listed yet. Add your certifications in the admin dashboard!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 dark:hover:border-neutral-100 hover:shadow-xl dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]"
              >
                <div>
                  {cert.imageUrl ? (
                    isImageFormat(cert.imageUrl) ? (
                      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800">
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 mb-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 font-semibold">
                          PDF Certificate
                        </span>
                        <a
                          href={cert.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-neutral-500 hover:text-black dark:hover:text-white underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          <span>Open Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-800 dark:text-neutral-200 mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                  )}

                  <h2 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white mb-1.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    {cert.title}
                  </h2>

                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">
                    {cert.issuer}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(cert.issueDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-mono text-neutral-900 dark:text-neutral-100 hover:underline underline-offset-4"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
