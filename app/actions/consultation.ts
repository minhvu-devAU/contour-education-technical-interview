"use server"

import { createClient } from "@/lib/supabase/server";
export async function createConsultation(firstName: string, lastName: string, reason: string, datetime: string) {
    let supabase;
    try {
        supabase = await createClient();
    } catch {
        return { error: "Something went wrong. Please try again later." };
    }

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
        return { error: "Failed to get user."};
    }

    const { error } = await supabase.from("consultations").insert({
        user_id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        reason: reason,
        datetime: datetime,
    })

    if (error) {
        return { error: error.message };
    }
}