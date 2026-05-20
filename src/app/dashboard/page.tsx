import { DashboardPanels } from "@/features/task/dashboard-panels";
import { LogoutButton } from "@/components/shared/logout-button";
import { readServerSession } from "@/lib/auth/server-session";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await readServerSession();

  if (!session) {
    redirect("/unauthorized");
  }

  return (
    <main className="flex h-screen flex-col gap-4 bg-linear-to-b from-sky-700 via-sky-600 to-sky-500 px-3 py-4 sm:px-5 sm:py-6">
      <nav className="mx-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-sky-300/30 bg-sky-900/35 px-4 py-3 backdrop-blur-sm sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">
            Turboly Challenge
          </p>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">Adaptive Task Manager</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            id="open-create-task-modal"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200/40 bg-sky-100/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-100/20"
          >
            <Plus size={16} />
            Add Task
          </button>
          <LogoutButton />
        </div>
      </nav>

      <DashboardPanels />
    </main>
  );
}
