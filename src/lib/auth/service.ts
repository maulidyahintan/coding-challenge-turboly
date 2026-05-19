import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { LoginInput } from "@/lib/validations/auth";
import type { SessionPayload } from "@/types/auth";

export async function authenticateUser(
  input: LoginInput
): Promise<SessionPayload | null> {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await compare(input.password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
