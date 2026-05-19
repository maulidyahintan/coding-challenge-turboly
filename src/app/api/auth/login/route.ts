import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth/service";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = loginSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      { message: "Invalid login request." },
      { status: 400 }
    );
  }

  const sessionPayload = await authenticateUser(parsedInput.data);

  if (!sessionPayload) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(sessionPayload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);

  return NextResponse.json({
    message: "Login successful.",
    user: sessionPayload.user,
  });
}
