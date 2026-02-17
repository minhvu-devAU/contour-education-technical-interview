import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConsultationDashboard } from "@/components/consultationDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: student, error: studentDatabaseError } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  if (studentDatabaseError) {
    // Enable for debug/tracing in production if we were using observability sentry/newrelic
    //console.error("Failed to fetch student:", studentError);
    redirect("/error");
  }

  const { data: consultationsData, error: consultationsDatabaseError} = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", student.id);

  if (consultationsDatabaseError) {
    // Enable for debug/tracing in production if we were using observability sentry/newrelic
    // console.error("Failed to fetch consultations:", consultationsError);
    redirect("/error");
  }

  return (
    <ConsultationDashboard
      firstName={student.first_name}
      lastName={student.last_name}
      consultations={consultationsData ?? []}
    />
  )
}
