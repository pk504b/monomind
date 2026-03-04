import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Coffee, Brain, Hash } from "lucide-react";
import { ProgressCircular } from "./progress-circular";
import { dbMethods, useLiveQuery } from "@/lib/db";
import { PomodoroMode, PomodoroState } from "@/lib/types";
import { playBeep, ssTommss } from "@/lib/utils";

const MODE_SETTINGS: Record<PomodoroMode, { time: number; label: string }> = {
  focus: { time: 10 * 1, label: "Focus" },
  "short-break": { time: 3 * 1, label: "Short Break" },
  "long-break": { time: 5 * 1, label: "Long Break" },
};

const DEFAULT_STATE: PomodoroState = {
  mode: "focus",
  isActive: false,
  endTime: null,
  timeLeft: MODE_SETTINGS.focus.time,
  cycleNum: 0,
};

export function Pomodoro({ date }: { date: Date }) {
  const log = useLiveQuery(() => dbMethods.getPomoCount(date), [date]);
  const sessionsCompleted = log?.count || 0;

  const [state, setState] = useState<PomodoroState>(DEFAULT_STATE);

  // Ref to track latest sessionsCompleted for switchMode without re-creating callback
  const sessionsRef = useRef(sessionsCompleted);
  useEffect(() => {
    sessionsRef.current = sessionsCompleted;
  }, [sessionsCompleted]);

  // Centralized state update helper (Storage + UI)
  const updateStore = useCallback((updates: Partial<PomodoroState>) => {
    chrome.storage.local.get(["pomodoroState"], (res) => {
      const current = (res.pomodoroState as PomodoroState) || DEFAULT_STATE;
      const newState = { ...current, ...updates };
      chrome.storage.local.set({ pomodoroState: newState });
      setState(newState);
    });
  }, []);

  const switchMode = useCallback(() => {
    playBeep();
    setState((prev) => {
      let { mode, cycleNum } = prev;
      let nextMode: PomodoroMode = mode;
      let nextCycle = cycleNum;

      if (mode === "focus") {
        nextMode = nextCycle >= 4 ? "long-break" : "short-break";
        if (nextCycle >= 4) nextCycle = 0;
        dbMethods.setPomoCount(date, sessionsRef.current + 1);
      } else {
        nextMode = "focus";
        mode === "short-break" ? nextCycle++ : null;
      }

      const nextTime = MODE_SETTINGS[nextMode].time;
      const newState: PomodoroState = {
        mode: nextMode,
        isActive: false,
        endTime: null,
        timeLeft: nextTime,
        cycleNum: nextCycle,
      };

      chrome.alarms.clear("pomodoro-end");
      chrome.storage.local.set({ pomodoroState: newState });
      return newState;
    });
  }, [date]);

  const toggleTimer = useCallback(() => {
    setState((prev) => {
      const newActive = !prev.isActive;
      let newEndTime = null;

      if (newActive) {
        newEndTime = Date.now() + prev.timeLeft * 1000;
        chrome.alarms.create("pomodoro-end", { when: newEndTime });
      } else {
        chrome.alarms.clear("pomodoro-end");
      }

      const newState = { ...prev, isActive: newActive, endTime: newEndTime };
      chrome.storage.local.set({ pomodoroState: newState });
      return newState;
    });
  }, []);

  const resetTimer = useCallback(() => {
    chrome.alarms.clear("pomodoro-end");
    updateStore(DEFAULT_STATE);
  }, [updateStore]);

  // Sync with storage on mount and when changed externally
  useEffect(() => {
    const loadState = () => {
      chrome.storage.local.get(["pomodoroState"], (res) => {
        const s = (res.pomodoroState as PomodoroState) || DEFAULT_STATE;
        if (s.isActive && s.endTime) {
          const remaining = Math.max(
            0,
            Math.ceil((s.endTime - Date.now()) / 1000),
          );
          setState({ ...s, timeLeft: remaining });
        } else {
          setState(s);
        }
      });
    };

    loadState();

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
    ) => {
      if (changes.pomodoroState) {
        const s = changes.pomodoroState.newValue as PomodoroState;
        if (!s.isActive) setState(s);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  // Main countdown effect
  useEffect(() => {
    if (!state.isActive || !state.endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((state.endTime! - Date.now()) / 1000),
      );

      if (remaining === 0) {
        clearInterval(interval);
        switchMode();
      } else {
        setState((prev) => ({ ...prev, timeLeft: remaining }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isActive, state.endTime, switchMode]);

  const progress =
    ((MODE_SETTINGS[state.mode].time - state.timeLeft) /
      MODE_SETTINGS[state.mode].time) *
    100;

  return (
    <div className="h-full flex flex-col justify-around">
      <div className="relative">
        <ProgressCircular
          value={progress}
          size={256}
          strokeWidth={8}
          className="mx-auto"
        >
          <div className="select-none flex flex-col items-center justify-center relative">
            <Badge variant="ghost" className="absolute -top-6">
              {state.mode === "focus" ? <Brain /> : <Coffee />}
              {MODE_SETTINGS[state.mode].label}
            </Badge>

            <div className="text-6xl font-bold">{ssTommss(state.timeLeft)}</div>

            <Button
              size="sm"
              variant={state.isActive ? "outline" : "default"}
              className="absolute -bottom-14"
              onClick={() => {
                if (state.mode === "focus" && state.cycleNum === 0) {
                  setState((prev) => ({ ...prev, cycleNum: 1 }));
                }
                toggleTimer();
              }}
            >
              {state.isActive ? <Pause /> : <Play />}
              {state.isActive ? "Pause" : "Start"}
            </Button>
          </div>
        </ProgressCircular>

        <div className="absolute -bottom-4 w-full flex justify-between items-center">
          <Button variant="secondary" size="xs">
            <Hash />
            {state.cycleNum}/4
          </Button>
          <Button size="xs" variant="secondary" onClick={resetTimer}>
            <RotateCcw />
            Reset
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 w-full text-xs text-muted-foreground uppercase tracking-widest font-semibold">
        <span>Total Today</span>
        <span className="text-primary">{sessionsCompleted}</span>
      </div>
    </div>
  );
}
