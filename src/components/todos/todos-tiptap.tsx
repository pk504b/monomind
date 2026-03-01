import TiptapTasksOnly from "../tiptap/tiptap-tasks-only";

export default function Todos2() {
  return (
    <div className="border flex flex-col">
      <p className="text-center">Tasks</p>
      <TiptapTasksOnly />

      <p className="text-center">Later</p>
      <TiptapTasksOnly />
    </div>
  );
}
