import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Todo } from "@/lib/types";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onEnter: (id: string) => void;
  onBackspace: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onRemove,
  onEnter,
  onBackspace,
}: Props) {
  return (
    <div className="group flex items-center gap-2">
      <div className="">
        <Checkbox
          id={todo.id}
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className=""
        />
      </div>
      <input
        type="text"
        id={`input-${todo.id}`}
        value={todo.text}
        onChange={(e) => onUpdate(todo.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter(todo.id);
          } else if (e.key === "Backspace" && todo.text === "") {
            e.preventDefault();
            onBackspace(todo.id);
          }
        }}
        className={cn(
          "flex-1 bg-transparent border-none outline-none text-sm transition-all placeholder:text-muted-foreground/30 py-1",
          todo.completed && "line-through text-muted-foreground opacity-50",
        )}
        placeholder="New task..."
      />
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onRemove(todo.id)}
        className="hidden group-hover:inline-flex"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}
