import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Clock({ is12Hour }: { is12Hour: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <div className="">
        <span className="text-8xl font-bold">
          {format(time, is12Hour ? "h:mm" : "HH:mm")}
        </span>
        {is12Hour && (
          <span className="text-xl font-semibold"> {format(time, "aaa")}</span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center gap-8">
        <Button variant="ghost" size="icon">
          <ChevronLeft />
        </Button>

        <div className="text-3xl">{format(time, "EEE, dd MMM yyyy")}</div>

        <Button variant="ghost" size="icon">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
