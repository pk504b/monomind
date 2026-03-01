import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import TodoList from "./todo-list";

export default function Todos() {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify- gap-2 text-xs uppercase text-muted-foreground">
        <CheckCircle className="size-3" />
        <CardTitle className="">Tasks</CardTitle>
      </CardHeader>

      <CardContent className="">
        <TodoList storageKey="todos-today-v2" type="today" />
        <hr className="my-3" />
        <TodoList storageKey="todos-later-v2" type="later" />
      </CardContent>
    </Card>
  );
}
