import { prisma } from "@/lib/prisma";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import type { SessionPayload } from "@/types/auth";
import { compare, hash } from "bcryptjs";

export async function authenticateUser(input: LoginInput): Promise<SessionPayload | null> {
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

export async function authenticateGoogleUser(email: string): Promise<SessionPayload> {
  const normalizedEmail = email.trim().toLowerCase();

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await hash(crypto.randomUUID(), 12),
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function registerUser(input: RegisterInput): Promise<SessionPayload | null> {
  const email = input.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return null;
  }

  const hashedPassword = await hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
  };
}
