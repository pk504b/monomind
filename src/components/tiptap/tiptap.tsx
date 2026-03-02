import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { useEffect, useRef } from "react";
import { dbMethods, useLiveQuery } from "@/lib/db";
import { format } from "date-fns";

const Tiptap = ({ date }: { date: Date }) => {
  const notes = useLiveQuery(() => dbMethods.getNotes(date), [date]);
  const timeoutRef = useRef<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Start writing..",
      }),
    ],
    onUpdate: ({ editor }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        dbMethods.saveNotes(date, editor.getJSON());
      }, 500);
    },
    immediatelyRender: false,
  });

  const lastDateRef = useRef(date);

  // Update editor content when date changes or DB entry is loaded
  useEffect(() => {
    if (!editor) return;

    const dateStr = format(date, "yyyy-MM-dd");
    const dateChanged = lastDateRef.current.getTime() !== date.getTime();
    const currentContent = editor.getJSON();

    // Explicitly check for stale notes from previous queries
    const isStale = notes && notes.date !== dateStr;
    const newContent = (!isStale && notes?.notes) || {
      type: "doc",
      content: [],
    };

    if (dateChanged) {
      // Immediate clear on date change to avoid ghosting prev day's content
      editor.commands.setContent(
        { type: "doc", content: [] },
        { emitUpdate: false },
      );
      lastDateRef.current = date;
    } else if (!editor.isFocused && notes !== undefined && !isStale) {
      // Sync from DB only when not focused and notes belong to current date
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent, { emitUpdate: false });
      }
    }
  }, [notes, editor, date]);

  return <EditorContent editor={editor} className="" />;
};

export default Tiptap;
