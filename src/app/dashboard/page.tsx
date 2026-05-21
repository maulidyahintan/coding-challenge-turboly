import { readServerSession } from "@/lib/auth/server-session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardPageClient } from "../../components/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage and track your tasks in the Turboly dashboard.",
};

export default async function DashboardPage() {
  const session = await readServerSession();

  if (!session) {
    redirect("/unauthorized");
  }

  return <DashboardPageClient userEmail={session.user.email} />;
}
