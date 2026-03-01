import { useEditor, EditorContent } from "@tiptap/react";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";

// 1. Force the document to only allow the TaskList
const CustomDocument = Document.extend({
  content: "taskList",
});

// 2. Force TaskItem to hold TEXT directly, not Paragraphs
const CustomTaskItem = TaskItem.extend({
  content: "inline*",
  //   addKeyboardShortcuts() {
  //     return {
  //       Enter: () => this.editor.commands.splitListItem(this.name),
  //       Tab: () => this.editor.commands.sinkListItem(this.name),
  //       "Shift-Tab": () => this.editor.commands.liftListItem(this.name),
  //     };
  //   },
}).configure({
  nested: true,
});

export default function TiptapTasksOnly() {
  const editor = useEditor({
    extensions: [CustomDocument, TaskList, CustomTaskItem, Text],
    content: `<ul data-type="taskList">
        <li data-type="taskItem" data-checked="false"></li>
      </ul>`,
    autofocus: true,
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} className="tiptap-tasks-only" />;
}
