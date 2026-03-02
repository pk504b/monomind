import { format } from "date-fns";
import { useEffect, useState } from "react";

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
        <div className="text-2xl tracking-widest">
          {format(time, "EEE, dd MMM yyyy")}
        </div>
      </div>
    </div>
  );
}
