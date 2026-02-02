import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "./todo.dto";

const DATA_DIR = join(process.cwd(), "data");
const FILE_PATH = join(DATA_DIR, "tasks.json");

async function loadTasks(): Promise<Task[]> {
  try {
    const data = await readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveTasks(tasks: Task[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}

export async function getTasks(): Promise<Task[]> {
  const tasks = await loadTasks();
  return [...tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getTask(id: string): Promise<Task | null> {
  const tasks = await loadTasks();
  return tasks.find((t) => t.id === id) ?? null;
}

export async function createTask(title: string): Promise<Task> {
  const tasks = await loadTasks();
  const task: Task = {
    id: uuidv4(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  await saveTasks(tasks);
  return task;
}

export async function updateTask(
  id: string,
  input: { title?: string; completed?: boolean }
): Promise<Task | null> {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = {
    ...tasks[index],
    ...(input.title !== undefined && { title: input.title }),
    ...(input.completed !== undefined && { completed: input.completed }),
  };
  await saveTasks(tasks);
  return tasks[index];
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await loadTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  await saveTasks(tasks);
  return true;
}
