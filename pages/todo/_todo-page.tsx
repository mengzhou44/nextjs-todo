"use client";

import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import type { Task } from "@/types/task";

const TASKS_QUERY = gql`
  query Tasks {
    tasks {
      id
      title
      completed
      createdAt
    }
  }
`;

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

export function TodoPage({ initialTasks }: { initialTasks: Task[] }) {
  const { data, loading } = useQuery<{ tasks: Task[] }>(TASKS_QUERY);
  const [createTask] = useMutation(CREATE_MUTATION, {
    refetchQueries: [{ query: TASKS_QUERY }],
  });
  const [updateTask] = useMutation(UPDATE_MUTATION, {
    refetchQueries: [{ query: TASKS_QUERY }],
  });
  const [deleteTask] = useMutation(DELETE_MUTATION, {
    refetchQueries: [{ query: TASKS_QUERY }],
  });

  const tasks = data?.tasks ?? initialTasks ?? [];

  async function addTask(title: string) {
    await createTask({ variables: { title } });
  }

  async function toggleTask(id: string, completed: boolean) {
    await updateTask({ variables: { id, completed } });
  }

  async function handleDelete(id: string) {
    await deleteTask({ variables: { id } });
  }

  return (
    <main>
      <div className="max-w-[480px] mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-accent">Tasks</h1>
        <AddTaskForm onAdd={addTask} />
        <ul className="list-none p-0 mt-6 flex flex-col gap-2">
          {loading && tasks.length === 0 ? (
            <li className="py-8 text-center text-text-muted bg-surface rounded-lg border border-dashed border-border">
              Loading…
            </li>
          ) : tasks.length === 0 ? (
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
      </div>
    </main>
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
