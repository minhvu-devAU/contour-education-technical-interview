"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(email: string, password: string) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Something went wrong. Please try again later." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { error: "Something went wrong. Please try again later." };
  }

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  const { error: studentDatabaseError } = await supabase
    .from("students")
    .insert({ first_name: firstName, last_name: lastName, phone });

  if (studentDatabaseError) {
    console.error(studentDatabaseError);
    return { error: "Failed to create student record" };
  }

  redirect("/dashboard");
}

export async function logout() {
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    redirect("/login");
  }
  await supabase.auth.signOut();
  redirect("/login");
}

