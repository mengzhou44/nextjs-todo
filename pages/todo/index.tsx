import { GetServerSideProps } from "next";
import { TodoPage } from "./_todo-page";
import { getTasks } from "@/pages/api/_todo/todo.service";
import type { Task } from "@/types/task";

export default function TodoRoute({ initialTasks }: { initialTasks: Task[] }) {
  return <TodoPage initialTasks={initialTasks} />;
}

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
