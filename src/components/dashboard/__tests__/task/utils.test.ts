import type { TaskItem } from "@/components/dashboard/task/types";
import {
    filterTasksByQuery,
    isDueTodayDate,
    isOverdueDueDate,
    readTaskPayload,
    sortTasks,
    toDateInputValue,
    validateTaskPayload,
} from "@/components/dashboard/task/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTask(overrides: Partial<TaskItem> = {}): TaskItem {
  return {
    id: "t1",
    title: "default",
    description: null,
    priority: "MEDIUM",
    dueDate: "2026-05-21T00:00:00.000Z",
    completed: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function todayISO(): string {
  return new Date().toISOString();
}

function pastISO(): string {
  return "2000-01-01T00:00:00.000Z";
}

function futureISO(): string {
  return "2099-12-31T00:00:00.000Z";
}

// ---------------------------------------------------------------------------
// isOverdueDueDate
// ---------------------------------------------------------------------------

describe("isOverdueDueDate", () => {
  it("returns true for a past date", () => {
    expect(isOverdueDueDate(pastISO())).toBe(true);
  });

  it("returns false for a future date", () => {
    expect(isOverdueDueDate(futureISO())).toBe(false);
  });

  it("returns false for today", () => {
    expect(isOverdueDueDate(todayISO())).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isDueTodayDate
// ---------------------------------------------------------------------------

describe("isDueTodayDate", () => {
  it("returns true for today", () => {
    expect(isDueTodayDate(todayISO())).toBe(true);
  });

  it("returns false for a past date", () => {
    expect(isDueTodayDate(pastISO())).toBe(false);
  });

  it("returns false for a future date", () => {
    expect(isDueTodayDate(futureISO())).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// toDateInputValue
// ---------------------------------------------------------------------------

describe("toDateInputValue", () => {
  it("returns a YYYY-MM-DD string", () => {
    const result = toDateInputValue("2026-05-21T00:00:00.000Z");
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// readTaskPayload
// ---------------------------------------------------------------------------

describe("readTaskPayload", () => {
  it("reads fields from FormData", () => {
    const fd = new FormData();
    fd.append("title", "Buy milk");
    fd.append("description", "Full fat");
    fd.append("priority", "HIGH");
    fd.append("dueDate", "2026-12-01");

    const payload = readTaskPayload(fd);

    expect(payload.title).toBe("Buy milk");
    expect(payload.description).toBe("Full fat");
    expect(payload.priority).toBe("HIGH");
    expect(payload.dueDate).toBe("2026-12-01");
  });

  it("treats last completed checkbox value as truth", () => {
    const fd = new FormData();
    fd.append("title", "t");
    fd.append("dueDate", "2026-12-01");
    fd.append("completed", "false");
    fd.append("completed", "true");

    expect(readTaskPayload(fd).completed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// validateTaskPayload
// ---------------------------------------------------------------------------

describe("validateTaskPayload", () => {
  it("returns null for valid payload", () => {
    expect(
      validateTaskPayload({ title: "Task", description: "", priority: "LOW", dueDate: "2026-12-01" })
    ).toBeNull();
  });

  it("returns an error string when title is empty", () => {
    expect(
      validateTaskPayload({ title: "", description: "", priority: "MEDIUM", dueDate: "2026-12-01" })
    ).toBeTruthy();
  });

  it("returns an error string when dueDate is empty", () => {
    expect(
      validateTaskPayload({ title: "ok", description: "", priority: "MEDIUM", dueDate: "" })
    ).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// sortTasks
// ---------------------------------------------------------------------------

describe("sortTasks", () => {
  const a = makeTask({ id: "a", title: "alpha", dueDate: "2026-01-01T00:00:00.000Z", priority: "HIGH" });
  const b = makeTask({ id: "b", title: "beta", dueDate: "2026-06-01T00:00:00.000Z", priority: "LOW" });

  it("sorts by dueDate ascending", () => {
    const result = sortTasks([b, a], "dueDate");
    expect(result[0].id).toBe("a");
  });

  it("sorts by title alphabetically", () => {
    const result = sortTasks([b, a], "title");
    expect(result[0].id).toBe("a");
  });

  it("sorts by priority (HIGH first)", () => {
    const result = sortTasks([b, a], "priority");
    expect(result[0].id).toBe("a");
  });
});

// ---------------------------------------------------------------------------
// filterTasksByQuery
// ---------------------------------------------------------------------------

describe("filterTasksByQuery", () => {
  const tasks = [
    makeTask({ id: "1", title: "buy groceries" }),
    makeTask({ id: "2", title: "call dentist", description: "schedule appointment" }),
  ];

  it("returns all tasks for empty query", () => {
    expect(filterTasksByQuery(tasks, "")).toHaveLength(2);
  });

  it("filters by title", () => {
    expect(filterTasksByQuery(tasks, "grocer")).toHaveLength(1);
  });

  it("filters by description", () => {
    expect(filterTasksByQuery(tasks, "appointment")).toHaveLength(1);
  });

  it("is case-insensitive", () => {
    expect(filterTasksByQuery(tasks, "DENTIST")).toHaveLength(1);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterTasksByQuery(tasks, "xyz")).toHaveLength(0);
  });
});
