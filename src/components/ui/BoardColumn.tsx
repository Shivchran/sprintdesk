import {
  useDroppable,
} from "@dnd-kit/core";

import type {
  Task,
  TaskStatus,
} from "../../types";

interface BoardColumnProps {
  id: TaskStatus;
  label: string;
  tasks: Task[];
  children: React.ReactNode;
}

function BoardColumn({
  id,
  label,
  tasks,
  children,
}: BoardColumnProps) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[220px] rounded-xl p-3 transition-all ${
        isOver
          ? "bg-blue-100 ring-2 ring-blue-400"
          : "bg-slate-200/70"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          {label}
        </h3>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
          {tasks.length}
        </span>
      </div>

      <div className="min-h-[150px] space-y-3">
        {children}

        {tasks.length === 0 && (
          <div
            className={`flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed text-sm transition ${
              isOver
                ? "border-blue-400 bg-blue-50 text-blue-600"
                : "border-slate-300 text-slate-400"
            }`}
          >
            Drop task here
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardColumn;