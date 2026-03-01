import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Write something..",
      }),
    ],
    content: ``,
    autofocus: true,

    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
