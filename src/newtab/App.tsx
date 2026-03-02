import { useState, useEffect } from "react";
import Clock from "@/components/clock";
import Tiptap from "@/components/tiptap/tiptap";
import { Pomodoro } from "@/components/pomodoro";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock10, NotebookPen, Undo } from "lucide-react";
import TodoList from "@/components/todos/todo-list";
import { DatePicker } from "@/components/date-picker";
import { isToday } from "date-fns";
import SettingsDialog from "@/components/settings-dialog";
import { useLiveQuery } from "dexie-react-hooks";
import { dbMethods } from "@/lib/db";

export default function App() {
  const [date, setDate] = useState<Date>(new Date());
  const settings = useLiveQuery(() => dbMethods.getSettings(), []);

  useEffect(() => {
    dbMethods.ensureSettings();
  }, []);

  const is12Hour = settings?.is12Hour ?? dbMethods.seedSettings.is12Hour;

  return (
    <div className="grid h-screen w-full overflow-hidden grid-cols-4 grid-rows-6 gap-4 p-2">
      {/* DAILY NOTES */}
      <Card className="col-span-2 row-span-6">
        <CardHeader className="select-none flex flex-row items-center justify-between gap-2 text-xs uppercase text-muted-foreground">
          <div className="flex flex-row items-center gap-2 ">
            <NotebookPen className="size-3" />
            <CardTitle>Daily Notes</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {!isToday(date) && (
              <Button
                size="xs"
                variant="secondary"
                onClick={() => setDate(new Date())}
                className="animate-in fade-in slide-in-from-right-1"
              >
                <Undo />
                Today
              </Button>
            )}
            <DatePicker date={date} setDate={setDate} />
          </div>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto mr-4">
          <Tiptap date={date} />
        </CardContent>
      </Card>

      {/* TASKS */}
      <Card className="col-span-1 row-span-4">
        <CardHeader className="select-none flex flex-row items-center gap-2 text-xs uppercase text-muted-foreground">
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
        <CardHeader className="select-none flex flex-row items-center gap-2 text-xs uppercase text-muted-foreground">
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
        <CardHeader className="select-none flex flex-row items-center gap-2 text-xs uppercase text-muted-foreground">
          <Clock10 className="size-3" />
          <CardTitle>Clock</CardTitle>
        </CardHeader>
        <CardContent>
          <Clock is12Hour={is12Hour} />
        </CardContent>
      </Card>

      {/* <SettingsMenu /> */}
      <SettingsDialog />
    </div>
  );
}
