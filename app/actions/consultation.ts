"use server"

import { createClient } from "@/lib/supabase/server";
import { consultationSchema, toggleConsultationSchema } from "@/lib/validations/consultationSchema";

export async function createConsultation(firstName: string, lastName: string, reason: string, datetime: string) {
  try {
    await consultationSchema.validate({ firstName, lastName, reason, datetime });
  } catch {
    return { error: "Invalid input." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Something went wrong. Please try again later." };
  }

  // Only logged-in user can continue
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return { error: "Unauthorized. Failed to get user."};
  }

  // Insert consultation into database and return the consultation object to update frontend consultation list
  const { data: consultation, error } = await supabase.from("consultations").insert({
    user_id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    reason: reason,
    datetime: datetime,
  }).select().single();

  if (error) {
    return { error: error.message };
  }

  return { data: consultation };
}

export async function toggleConsultationComplete(id: string, isComplete: boolean) {
  try {
    await toggleConsultationSchema.validate({ id, isComplete });
  } catch {
    return { error: "Invalid input." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Something went wrong. Please try again later." };
  }

  // Only logged-in user can continue
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return { error: "Unauthorized. Failed to get user."};
  }

  const { error } = await supabase.from("consultations")
    .update({ is_complete: !isComplete })
    .eq("id", id)
    .eq("user_id", data.user.id);

  if (error) {
    return { error: error.message };
  }
}
