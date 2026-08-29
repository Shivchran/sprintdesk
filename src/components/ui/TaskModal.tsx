import { useEffect, useState } from "react";
import type { Task, TaskPriority, TaskStatus, User } from "../../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task | null;
  users: User[];
  sprintId: number;
}

const statuses: TaskStatus[] = [
  "backlog",
  "in-progress",
  "review",
  "done",
];

const priorities: TaskPriority[] = ["low", "medium", "high"];

function TaskModal({
  isOpen,
  onClose,
  onSave,
  task,
  users,
  sprintId,
}: TaskModalProps) {
  const isEditing = Boolean(task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState<number>(users[0]?.id ?? 1);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assigneeId);
      setDueDate(task.dueDate);
    } else {
      setTitle("");
      setDescription("");
      setStatus("backlog");
      setPriority("medium");
      setAssigneeId(users[0]?.id ?? 1);
      setDueDate("");
    }
  }, [task, isOpen, users]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const now = new Date().toISOString();

    const newTask: Task = {
      id: task?.id ?? Date.now(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      dueDate,
      sprintId: task?.sprintId ?? sprintId,
      order: task?.order ?? 1,
      createdAt: task?.createdAt ?? now,
      completedAt:
        status === "done"
          ? task?.completedAt ?? now
          : null,
      updatedAt: now,
    };

    onSave(newTask);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Task" : "Create Task"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update task information"
                : "Create a new sprint task"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Task title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TaskStatus)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item === "in-progress"
                      ? "In Progress"
                      : item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              >
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Assignee
              </label>

              <select
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Due date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;