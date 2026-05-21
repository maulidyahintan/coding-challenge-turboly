import { readRequestSession } from "@/lib/auth/request-session";
import { prisma } from "@/lib/prisma";
import { getFirstZodErrorMessage } from "@/lib/validations/error";
import { createTaskSchema } from "@/lib/validations/task";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await readRequestSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      priority: true,
      dueDate: true,
      completed: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  try {
    const session = await readRequestSession(request);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: getFirstZodErrorMessage(parsed.error, "Invalid task payload."),
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const dueDate = new Date(parsed.data.dueDate);

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        priority: parsed.data.priority,
        dueDate,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        dueDate: true,
        completed: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create task." }, { status: 500 });
  }
}
