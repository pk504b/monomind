import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Coffee, Brain, Hash } from "lucide-react";
import { ProgressCircular } from "./progress-circular";
import { dbMethods, useLiveQuery } from "@/lib/db";

type Mode = "focus" | "short-break" | "long-break";

export function Pomodoro({ date }: { date: Date }) {
  const log = useLiveQuery(() => dbMethods.getPomoCount(date), [date]);
  const sessionsCompleted = log?.count || 0;

  const getModeSettings = useCallback((m: Mode) => {
    switch (m) {
      case "focus":
        return { time: 25 * 60, label: "Focus" };
      case "short-break":
        return { time: 5 * 60, label: "Short Break" };
      case "long-break":
        return { time: 15 * 60, label: "Long Break" };
    }
  }, []);

  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(getModeSettings("focus").time);
  const [isActive, setIsActive] = useState(false);
  const [focusSessionsInCycle, setFocusSessionsInCycle] = useState(0);

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.1,
      );

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio beep failed", e);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMode("focus");
    setFocusSessionsInCycle(0);
    setTimeLeft(getModeSettings("focus").time);
  }, [getModeSettings]);

  const switchMode = useCallback(() => {
    playBeep();

    if (mode === "focus") {
      if (focusSessionsInCycle >= 4) {
        setMode("long-break");
        setTimeLeft(getModeSettings("long-break").time);
        setFocusSessionsInCycle(0);
      } else {
        setMode("short-break");
        setTimeLeft(getModeSettings("short-break").time);
      }

      dbMethods.setPomoCount(date, sessionsCompleted + 1);
    } else {
      setMode("focus");
      setTimeLeft(getModeSettings("focus").time);
      setFocusSessionsInCycle((prev) => prev + 1);
    }
    setIsActive(false);
  }, [
    mode,
    focusSessionsInCycle,
    playBeep,
    getModeSettings,
    date,
    sessionsCompleted,
  ]);

  useEffect(() => {
    let interval: number = 0;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      switchMode();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, switchMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    ((getModeSettings(mode).time - timeLeft) / getModeSettings(mode).time) *
    100;

  return (
    <div className="h-full flex flex-col justify-around min-h-96">
      <div className="relative">
        <ProgressCircular
          value={progress}
          size={256}
          strokeWidth={8}
          className="mx-auto"
        >
          <div className="select-none flex flex-col items-center justify-center relative">
            <Badge variant="ghost" className="absolute -top-6">
              {mode === "focus" ? <Brain /> : <Coffee />}
              {getModeSettings(mode).label}
            </Badge>

            <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>

            <Button
              size="sm"
              variant={isActive ? "outline" : "default"}
              className="absolute -bottom-14"
              onClick={() => {
                if (mode === "focus" && focusSessionsInCycle === 0) {
                  setFocusSessionsInCycle(1);
                }
                setIsActive(!isActive);
              }}
            >
              {isActive ? <Pause /> : <Play />}
              {isActive ? "Pause" : "Start"}
            </Button>
          </div>
        </ProgressCircular>

        <div className="absolute -bottom-4 w-full flex justify-between items-center">
          <Button variant="secondary" size="xs" className="text-xs">
            <Hash />
            {focusSessionsInCycle}/4
          </Button>
          <Button
            size="xs"
            variant="secondary"
            className=""
            onClick={resetTimer}
          >
            <RotateCcw />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 w-full text-xs">
        <span>Total Sessions</span>
        <span>{sessionsCompleted}</span>
      </div>
    </div>
  );
}
