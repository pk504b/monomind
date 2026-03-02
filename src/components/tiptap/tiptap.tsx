import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { useEffect } from "react";
import { dbMethods, useLiveQuery } from "@/lib/db";

const Tiptap = ({ date }: { date: Date }) => {
  const notes = useLiveQuery(() => dbMethods.getNotes(date), [date]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Write something..",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      dbMethods.saveNotes(date, editor.getJSON());
    },
    immediatelyRender: false,
  });

  // Update editor content when date changes or DB entry is loaded
  useEffect(() => {
    if (editor && notes !== undefined) {
      const currentContent = editor.getJSON();
      const newContent = notes?.notes || "";
      if (currentContent !== newContent) {
        editor.commands.setContent(newContent, { emitUpdate: false });
      }
    }
  }, [notes, editor, date]);

  return (
    <EditorContent
      editor={editor}
      className="h-full px-8 py-4 prose prose-zinc dark:prose-invert max-w-none"
    />
  );
};

export default Tiptap;
