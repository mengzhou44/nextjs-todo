import { GetServerSideProps } from "next";
import { Tasks } from "@/client/todo/tasks";
import { getTasks } from "@/pages/api/_todo/todo.service";
import type { Task } from "@/types/task";

export default function TodoRoute({ initialTasks }: { initialTasks: Task[] }) {
  return <Tasks initialTasks={initialTasks} />;
}

// Auth is enforced client-side (redirect when no token) and by GraphQL (JWT).
export const getServerSideProps: GetServerSideProps<{
  initialTasks: Task[];
}> = async () => {
  let initialTasks: Task[] = [];
  try {
    initialTasks = await getTasks();
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
  return { props: { initialTasks } };
};
