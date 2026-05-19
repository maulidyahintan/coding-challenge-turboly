import { readRequestSession } from "@/lib/auth/request-session";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations/task";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type UpdateTaskPayload = {
  title?: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  completed?: boolean;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await readRequestSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  if (!taskId?.trim()) {
    return NextResponse.json({ message: "Task id is required" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateTaskSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid task payload", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ message: "No update payload provided" }, { status: 400 });
  }

  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  });

  if (!existingTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const { title, description, priority, completed, dueDate: dueDateInput } = parsed.data;

  let dueDate: Date | undefined;
  if (dueDateInput !== undefined) {
    dueDate = new Date(dueDateInput);

    if (Number.isNaN(dueDate.getTime())) {
      return NextResponse.json({ message: "Invalid due date" }, { status: 400 });
    }
  }

  const updatePayload: UpdateTaskPayload = {
    ...(title === undefined ? {} : { title }),
    ...(description === undefined ? {} : { description: description || null }),
    ...(priority === undefined ? {} : { priority }),
    ...(completed === undefined ? {} : { completed }),
    ...(dueDate === undefined ? {} : { dueDate }),
  };

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updatePayload,
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

  return NextResponse.json({ task });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const session = await readRequestSession(request);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;

  if (!taskId?.trim()) {
    return NextResponse.json({ message: "Task id is required" }, { status: 400 });
  }

  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId: session.user.id },
    select: { id: true },
  });

  if (!existingTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return NextResponse.json({ message: "Task deleted" });
}