import { getTasks } from "@/server/todo/todo.service";
import { TaskList } from "@/client/todo/task-list";

export default async function TodoPage() {
  let initialTasks: Awaited<ReturnType<typeof getTasks>> = [];
  try {
    initialTasks = await getTasks();
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
  return (
    <main>
      <div className="max-w-[480px] mx-auto py-12 px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-accent">Tasks</h1>
        </div>
        <TaskList initialTasks={initialTasks} />
      </div>
    </main>
  );
}
