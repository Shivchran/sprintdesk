import { useState } from "react";
import type { Task, User } from "../../types";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  sprintId: number;
  onAddTask: (task: Task) => void;
}

function AddTaskModal({
  open,
  onClose,
  users,
  sprintId,
  onAddTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<Task["priority"]>("medium");
  const [assigneeId, setAssigneeId] = useState(
    users[0]?.id ?? 0
  );
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] =
    useState<Task["status"]>("backlog");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId,
      dueDate,
      sprintId,
      order: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    };

    onAddTask(newTask);

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeId(users[0]?.id ?? 0);
    setDueDate("");
    setStatus("backlog");

    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeId(users[0]?.id ?? 0);
    setDueDate("");
    setStatus("backlog");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close add task modal"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new task for this sprint
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter task title"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Describe the task"
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Priority */}
            <div>
              <label
                htmlFor="task-priority"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as Task["priority"]
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">High</option>
                <option value="medium">
                  Medium
                </option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="task-status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="task-status"
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as Task["status"]
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="backlog">
                  Backlog
                </option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="review">
                  Review
                </option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label
              htmlFor="task-assignee"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Assignee
            </label>

            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(e) =>
                setAssigneeId(Number(e.target.value))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Due Date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sprint */}
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Sprint
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              Sprint {sprintId}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;