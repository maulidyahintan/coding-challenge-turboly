import { readServerSession } from "@/lib/auth/server-session";
import { redirect } from "next/navigation";
import { DashboardPageClient } from "../../components/dashboard";

export default async function DashboardPage() {
  const session = await readServerSession();

  if (!session) {
    redirect("/unauthorized");
  }

  return <DashboardPageClient userEmail={session.user.email} />;
}
