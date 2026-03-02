import { useState } from "react";
import Clock from "@/components/clock";
import Tiptap from "@/components/tiptap/tiptap";
import { Pomodoro } from "@/components/pomodoro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock10, NotebookPen } from "lucide-react";
import TodoList from "@/components/todos/todo-list";
import { DatePicker } from "@/components/date-picker";

export default function App() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="grid h-screen w-full grid-cols-4 grid-rows-6 gap-4 p-2">
      {/* DAILY NOTES */}
      <Card className="col-span-2 row-span-6">
        <CardHeader className="flex flex-row items-center justify-between gap-2 text-xs uppercase text-muted-foreground">
          <div className="flex flex-row items-center justify- gap-2 ">
            <NotebookPen className="size-3" />
            <CardTitle>Daily Notes</CardTitle>
          </div>
          <div>
            <DatePicker date={date} setDate={setDate} />
          </div>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto mr-4">
          <Tiptap date={date} />
        </CardContent>
      </Card>

      {/* TASKS */}
      <Card className="col-span-1 row-span-4">
        <CardHeader className="flex flex-row items-center justify- gap-2 text-xs uppercase text-muted-foreground">
          <CheckCircle className="size-3" />
          <CardTitle className="">Tasks</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col gap-3">
          <TodoList date={date} type="today" />
          <hr className="" />
          <TodoList date={date} type="later" />
        </CardContent>
      </Card>

      {/* POMODORO */}
      <Card className="col-span-1 row-span-4">
        <CardHeader className="flex flex-row items-center gap-2 text-xs uppercase text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-fruit-icon lucide-fruit size-3"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m10 10 4-3" />
            <path d="m10 7 4 3" />
          </svg>
          <CardTitle>Pomodoro</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Pomodoro date={date} />
        </CardContent>
      </Card>

      {/* CLOCK */}
      <Card className="col-span-2 row-span-2">
        <CardHeader className="flex flex-row items-center justify- gap-2 text-xs uppercase text-muted-foreground">
          <Clock10 className="size-3" />
          <CardTitle>Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <Clock is12Hour={true} />
        </CardContent>
      </Card>
    </div>
  );
}
