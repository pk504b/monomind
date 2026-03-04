export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type PomodoroMode = "focus" | "short-break" | "long-break";

export interface PomodoroState {
  mode: PomodoroMode;
  isActive: boolean;
  endTime: number | null;
  timeLeft: number;
  cycleNum: number;
}
