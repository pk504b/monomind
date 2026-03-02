import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { useEffect, useRef } from "react";
import { dbMethods, useLiveQuery } from "@/lib/db";

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
    if (!editor || notes === undefined) return;

    const currentContent = editor.getJSON();
    const newContent = notes?.notes || { type: "doc", content: [] };
    const dateChanged = lastDateRef.current !== date;

    if (dateChanged || !editor.isFocused) {
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent, { emitUpdate: false });
      }
    }

    if (dateChanged) {
      lastDateRef.current = date;
    }
  }, [notes, editor, date]);

  return <EditorContent editor={editor} className="" />;
};

export default Tiptap;
