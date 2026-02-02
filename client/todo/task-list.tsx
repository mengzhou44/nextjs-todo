"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { getAccessToken } from "@/lib/apollo-client";
import type { Task } from "@/types/task";

const CREATE_MUTATION = gql`
  mutation CreateTask($title: String!) {
    createTask(title: $title) {
      id
      title
      completed
      createdAt
    }
  }
`;

const UPDATE_MUTATION = gql`
  mutation UpdateTask($id: ID!, $title: String, $completed: Boolean) {
    updateTask(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
      createdAt
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
    }
  }, [router]);

  const [createTaskMutation] = useMutation<{ createTask: Task }>(CREATE_MUTATION, {
    onError: (err) => setError(err.message),
  });
  const [updateTaskMutation] = useMutation<{ updateTask: Task | null }>(UPDATE_MUTATION, {
    onError: (err) => setError(err.message),
  });
  const [deleteTaskMutation] = useMutation<{ deleteTask: boolean }>(DELETE_MUTATION, {
    onError: (err) => setError(err.message),
  });

  async function addTask(title: string) {
    setError(null);
    const result = await createTaskMutation({ variables: { title } });
    const newTask = result.data?.createTask;
    if (newTask) setTasks((prev) => [...prev, newTask]);
  }

  async function toggleTask(id: string, completed: boolean) {
    setError(null);
    const result = await updateTaskMutation({ variables: { id, completed } });
    const updated = result.data?.updateTask;
    if (updated) setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id: string) {
    setError(null);
    const result = await deleteTaskMutation({ variables: { id } });
    if (result.data?.deleteTask) setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <>
      {error && (
        <p className="mb-4 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      <AddTaskForm onAdd={addTask} />
      <ul className="list-none p-0 mt-6 flex flex-col gap-2">
        {tasks.length === 0 ? (
          <li className="py-8 text-center text-text-muted bg-surface rounded-lg border border-dashed border-border">
            No tasks yet. Add one above.
          </li>
        ) : (
          tasks.map((task: Task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>
    </>
  );
}

function AddTaskForm({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setTitle("");
    onAdd(t);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-text text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="px-5 py-3 bg-accent text-bg border-0 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}

function TodoItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <li className="flex items-center justify-between py-3 px-4 bg-surface border border-border rounded-lg">
      <label className="flex items-center gap-3 flex-1 cursor-pointer">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          className="w-[18px] h-[18px] accent-accent"
        />
        <span
          className={`text-[0.95rem] ${
            task.completed ? "line-through text-text-muted" : ""
          }`}
        >
          {task.title}
        </span>
      </label>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete"
        className="bg-transparent border-0 text-text-muted text-2xl cursor-pointer py-1 px-2 rounded hover:text-text"
      >
        ×
      </button>
    </li>
  );
}
