import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircularProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}

const ProgressCircular = React.forwardRef<
  HTMLDivElement,
  ProgressCircularProps
>(
  (
    { value, size = 100, strokeWidth = 10, className, children, ...props },
    ref,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center", className)}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Circle (Track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-secondary"
          />
          {/* Progress Circle (Indicator) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.5s ease",
            }}
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
        {/* Optional: Center Label */}
        <div className="absolute">{children}</div>
      </div>
    );
  },
);
ProgressCircular.displayName = "ProgressCircular";

export { ProgressCircular };
