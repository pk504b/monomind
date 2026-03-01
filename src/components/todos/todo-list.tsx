"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/lib/types";
import { Badge } from "../ui/badge";
import TodoItem from "./todo-item";
import { cn } from "@/lib/utils";

interface Props {
  type: "today" | "later";
  storageKey: string;
  //   title: string;
  //   icon: any;
}
export default function TodoList({
  type,
  storageKey,
  //   title,
  //   icon: Icon,
}: Props) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        text: "",
        completed: false,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }, [todos, storageKey]);

  const handleToggle = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleUpdate = (id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  };

  const handleRemove = (id: string) => {
    if (todos.length === 1 && todos[0].text === "") return;
    setTodos((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      return filtered.length > 0
        ? filtered
        : [
            {
              id: Math.random().toString(36).substr(2, 9),
              text: "",
              completed: false,
            },
          ];
    });
  };

  const handleEnter = (currentId: string) => {
    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      completed: false,
    };
    const currentIndex = todos.findIndex((t) => t.id === currentId);
    const newTodos = [...todos];
    newTodos.splice(currentIndex + 1, 0, newTodo);
    setTodos(newTodos);

    // Smooth focus on the newly created element
    setTimeout(() => {
      const nextInput = document.getElementById(
        `input-${newTodo.id}`,
      ) as HTMLInputElement;
      nextInput?.focus();
    }, 10);
  };

  const handleBackspace = (currentId: string) => {
    if (todos.length === 1) return;
    const currentIndex = todos.findIndex((t) => t.id === currentId);
    if (currentIndex > 0) {
      const prevId = todos[currentIndex - 1].id;
      handleRemove(currentId);
      setTimeout(() => {
        const prevInput = document.getElementById(
          `input-${prevId}`,
        ) as HTMLInputElement;
        prevInput?.focus();
        // Place cursor at the end
        if (prevInput) {
          const val = prevInput.value;
          prevInput.value = "";
          prevInput.value = val;
        }
      }, 10);
    }
  };

  return (
    <div className={cn("relative", type === "today" ? "h-3/6" : "h-2/6")}>
      <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90">
        <Badge
          variant="ghost"
          className="uppercase opacity-20 tracking-[0.5em]"
        >
          {type === "today" ? (
            <span className="">Today</span>
          ) : (
            <span className="">Later</span>
          )}
        </Badge>
      </div>
      <div className="relative overflow-y-auto pl-4 h-full">
        <div className="flex flex-col">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
