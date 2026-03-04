"use client";

import { useEffect, useRef } from "react";
import { Badge } from "../ui/badge";
import TodoItem from "./todo-item";
import { cn } from "@/lib/utils";
import { dbMethods, useLiveQuery, type Todo } from "@/lib/db";

interface Props {
  type: "today" | "later";
  date: Date;
}
export default function TodoList({ type, date }: Props) {
  const rawTodos = useLiveQuery(
    () => dbMethods.getTodos(date, type),
    [date, type],
  );
  const todos = rawTodos || [];
  const isInitializing = useRef(false);

  // Reset initialization flag when date or type changes
  const dateDep = type === "today" ? date : "global";

  useEffect(() => {
    isInitializing.current = false;
  }, [dateDep, type]);

  // Initialize with an empty task if none exist for this date/type
  useEffect(() => {
    if (
      rawTodos !== undefined &&
      rawTodos.length === 0 &&
      !isInitializing.current
    ) {
      isInitializing.current = true;
      dbMethods.addTodo(date, type);
    }
  }, [rawTodos, dateDep, type, date]);

  const handleToggle = (id: string, completed: boolean) => {
    dbMethods.updateTodo(id, { completed });
  };

  const handleUpdate = (id: string, text: string) => {
    dbMethods.updateTodo(id, { text });
  };

  const handleRemove = async (id: string) => {
    if (todos.length === 1 && todos[0].text === "") return;
    await dbMethods.deleteTodo(id);
  };

  const handleEnter = async (currentId: string) => {
    const currentIndex = todos.findIndex((t: Todo) => t.id === currentId);
    let targetCreatedAt = Date.now();
    if (currentIndex !== -1 && currentIndex < todos.length - 1) {
      // Insert between current and next
      targetCreatedAt =
        (todos[currentIndex].createdAt + todos[currentIndex + 1].createdAt) / 2;
    } else {
      // Add to the end
      targetCreatedAt = Date.now();
    }
    const newTodo = await dbMethods.addTodo(date, type, "", targetCreatedAt);
    // Smooth focus on the newly created element
    setTimeout(() => {
      const nextInput = document.getElementById(
        `input-${newTodo.id}`,
      ) as HTMLInputElement;
      nextInput?.focus();
    }, 50);
  };

  const handleBackspace = async (currentId: string) => {
    if (todos.length === 1) return;
    const currentIndex = todos.findIndex((t: Todo) => t.id === currentId);
    if (currentIndex > 0) {
      const prevId = todos[currentIndex - 1].id;
      await dbMethods.deleteTodo(currentId);
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
      }, 50);
    }
  };

  return (
    <div
      className={cn("relative min-h-40", type === "today" ? "h-3/7" : "h-3/7")}
    >
      <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90">
        <Badge
          variant="ghost"
          className="uppercase opacity tracking-[0.4em] text-[10px] font-semibold text-white/20 select-none"
        >
          {type === "today" ? "Today" : "Later"}
        </Badge>
      </div>
      <div className="relative overflow-y-auto pl-4 h-full">
        <div className="flex flex-col">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id, !todo.completed)}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
            />
          ))}
        </div>
      </div>

      {type === "today" && (
        <Badge variant="default" className="absolute -top-10 right-0">
          {todos.filter((t) => t.completed).length}/{todos.length}
        </Badge>
      )}
    </div>
  );
}
