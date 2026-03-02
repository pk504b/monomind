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
        placeholder: "Write something..",
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

  // Update editor content when date changes or DB entry is loaded
  useEffect(() => {
    if (editor) {
      const currentContent = editor.getJSON();
      const newContent = notes?.notes || "";
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent, { emitUpdate: false });
      }
    }
  }, [notes, editor, date]);

  return <EditorContent editor={editor} className="" />;
};

export default Tiptap;
