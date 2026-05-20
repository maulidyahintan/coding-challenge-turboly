import { registerUser } from "@/lib/auth/service";
import { registerSchema } from "@/lib/validations/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = registerSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json({ message: "Invalid registration request." }, { status: 400 });
  }

  const sessionPayload = await registerUser(parsedInput.data);

  if (!sessionPayload) {
    return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
  }

  return NextResponse.json({
    message: "Account created successfully.",
    user: sessionPayload.user,
  });
}
