import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { authenticateUser } from "@/lib/auth/service";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validations/auth";
import { getFirstZodErrorMessage } from "@/lib/validations/error";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsedInput = loginSchema.safeParse(body);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          message: getFirstZodErrorMessage(parsedInput.error, "Invalid login request."),
          errors: parsedInput.error.flatten(),
        },
        { status: 400 }
      );
    }

    const sessionPayload = await authenticateUser(parsedInput.data);

    if (!sessionPayload) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(sessionPayload);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);

    return NextResponse.json({
      message: "Login successful.",
      user: sessionPayload.user,
    });
  } catch {
    return NextResponse.json({ message: "Failed to process login request." }, { status: 500 });
  }
}
