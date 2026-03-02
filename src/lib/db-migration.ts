import { exportDB, importDB } from "dexie-export-import";
import { db } from "./db";

// 1. Export Function
export async function exportToJson() {
  try {
    const blob = await exportDB(db);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `monomind-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export failed:", error);
  }
}

// 2. Import Function
export async function importFromJson(file: File) {
  try {
    await db.delete(); // Clear existing DB to avoid primary key conflicts
    await importDB(file);
    window.location.reload(); // Refresh to re-initialize the app with new data
  } catch (error) {
    console.error("Import failed:", error);
  }
}
