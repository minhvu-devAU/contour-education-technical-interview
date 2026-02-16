import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreateStudentRequest } from "@/types/api";

export async function POST(request: Request): Promise<NextResponse> {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const {
    firstName,
    lastName,
    phone,
  }: CreateStudentRequest = await request.json();

  if (!firstName || !lastName || !phone) {
    return NextResponse.json(
      { error: 'First name, last name, and phone are required' },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('students').insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    phone,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
