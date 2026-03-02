import Dexie, { type Table } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { format } from "date-fns";

export interface Note {
  date: string;
  notes: any;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  type: "today" | "later";
  date: string; // YYYY-MM-DDz
  createdAt: number;
}

export interface Pomodoro {
  date: string;
  count: number;
}

export interface Settings {
  id: string; // 'global'
  theme: "light" | "dark" | "system";
  is12Hour: boolean;
}

export class ProductivityDatabase extends Dexie {
  notes!: Table<Note>;
  todos!: Table<Todo>;
  pomodoro!: Table<Pomodoro>;
  settings!: Table<Settings>;

  constructor() {
    super("ProductivityDBv2");
    this.version(3).stores({
      notes: "date",
      todos: "id, date, type, createdAt",
      pomodoro: "date",
      settings: "id",
    });
  }
}

export const db = new ProductivityDatabase();

// --- Abstract DB Methods ---

export const dbMethods = {
  // Notes
  async getNotes(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    return await db.notes.get(dateStr);
  },

  async saveNotes(date: Date, notes: any) {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = await db.notes.get(dateStr);
    if (existing) {
      return await db.notes.update(dateStr, { notes });
    } else {
      return await db.notes.add({ date: dateStr, notes });
    }
  },

  // Pomodoro
  async getPomoCount(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    return await db.pomodoro.get(dateStr);
  },

  async setPomoCount(date: Date, count: number) {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = await db.pomodoro.get(dateStr);
    if (existing) {
      return await db.pomodoro.update(dateStr, { count });
    } else {
      return await db.pomodoro.add({
        date: dateStr,
        count,
      });
    }
  },

  async incrementPomoCount(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = await db.pomodoro.get(dateStr);
    if (existing) {
      return await db.pomodoro.update(dateStr, {
        count: (existing.count || 0) + 1,
      });
    } else {
      return await db.pomodoro.add({
        date: dateStr,
        count: 1,
      });
    }
  },

  // Todos
  async getTodos(date: Date, type: "today" | "later") {
    if (type === "later") {
      return await db.todos.where({ type: "later" }).sortBy("createdAt");
    }
    const dateStr = format(date, "yyyy-MM-dd");
    return await db.todos.where({ date: dateStr, type }).sortBy("createdAt");
  },

  async addTodo(
    date: Date,
    type: "today" | "later",
    text: string = "",
    createdAt: number = Date.now(),
  ) {
    const dateStr = type === "later" ? "global" : format(date, "yyyy-MM-dd");
    const id = Math.random().toString(36).substring(2, 9);
    const newTodo: Todo = {
      id,
      date: dateStr,
      type,
      text,
      completed: false,
      createdAt,
    };
    await db.todos.add(newTodo);
    return newTodo;
  },

  async updateTodo(id: string, updates: Partial<Todo>) {
    return await db.todos.update(id, updates);
  },

  async deleteTodo(id: string) {
    return await db.todos.delete(id);
  },

  async reorderTodos(todos: Todo[]) {
    // Basic implementation: replace all for that date/type if needed
    // But put is enough for individual updates
    return await db.todos.bulkPut(todos);
  },

  // Settings
  seedSettings: {
    id: "global",
    theme: "system" as const,
    is12Hour: true,
  },

  async getSettings() {
    const s = await db.settings.get("global");
    return s || this.seedSettings;
  },

  async ensureSettings() {
    const settings = await db.settings.get("global");
    if (!settings) {
      await db.settings.put(this.seedSettings);
      return this.seedSettings;
    }
    return settings;
  },

  async updateSettings(updates: Partial<Settings>) {
    return await db.settings.update("global", updates);
  },
};

export { useLiveQuery };
