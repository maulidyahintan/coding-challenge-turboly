import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { readRequestSession } from "@/lib/auth/request-session";
import { createTaskSchema } from "@/lib/validations/task";

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
  const session = await readRequestSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid task payload", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const dueDate = new Date(parsed.data.dueDate);

  if (Number.isNaN(dueDate.getTime())) {
    return NextResponse.json({ message: "Invalid due date" }, { status: 400 });
  }

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
}
