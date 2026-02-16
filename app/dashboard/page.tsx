import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div
        className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Welcome, {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-12 text-center text-muted">
        <p>Your consultations will appear here.</p>
      </div>
    </main>
  )
}
