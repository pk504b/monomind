import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>(new Date());

  return (
    <div className="flex items-center gap-2">
      {/* PREV BUTTON */}
      <Button
        size="xs"
        variant="ghost"
        onClick={() => setDate(addDays(date, -1))}
      >
        <ChevronLeft />
      </Button>

      {/* DATE PICKER */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="xs"
            id="date-picker-simple"
            className="justify-start font-normal"
          >
            {date ? format(date, "dd MMM yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            defaultMonth={date}
            required
            className="shadow-xl"
          />
        </PopoverContent>
      </Popover>

      {/* NEXT BUTTON */}
      <Button
        size="xs"
        variant="ghost"
        onClick={() => setDate(addDays(date, 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
