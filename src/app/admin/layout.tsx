import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Dashboard | Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If unauthenticated (e.g. login route handled by middleware), render plain children
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <AdminShell userEmail={session.user.email || undefined}>
      {children}
    </AdminShell>
  );
}
