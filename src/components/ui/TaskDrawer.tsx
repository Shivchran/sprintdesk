import type { Comment, Task, User } from "../../types";

interface TaskDrawerProps {
  task: Task | null;
  users: User[];
  comments: Comment[];
  onClose: () => void;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onDelete: (taskId: number) => void;
  onAddComment: (taskId: number, message: string) => void;
}

const statuses: Task["status"][] = [
  "backlog",
  "in-progress",
  "review",
  "done",
];

function formatStatus(status: Task["status"]) {
  if (status === "in-progress") return "In Progress";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function TaskDrawer({
  task,
  users,
  comments,
  onClose,
  onStatusChange,
  onDelete,
  onAddComment,
}: TaskDrawerProps) {
  if (!task) return null;

  const assignee = users.find((user) => user.id === task.assigneeId);

  const taskComments = comments.filter(
    (comment) => comment.taskId === task.id
  );

  const handleAddComment = () => {
    const message = window.prompt("Enter your comment:");

    if (!message?.trim()) return;

    onAddComment(task.id, message.trim());
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (confirmed) {
      onDelete(task.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close task drawer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/30"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Task Details
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Description */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Description
            </h3>

            <p className="leading-6 text-slate-600">
              {task.description}
            </p>
          </section>

          {/* Status */}
          <section>
            <label
              htmlFor="task-status"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Status
            </label>

            <select
              id="task-status"
              value={task.status}
              onChange={(e) =>
                onStatusChange(
                  task.id,
                  e.target.value as Task["status"]
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </section>

          {/* Task information */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Priority</p>
              <p className="mt-1 font-semibold capitalize text-slate-900">
                {task.priority}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Due Date</p>
              <p className="mt-1 font-semibold text-slate-900">
                {task.dueDate}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Sprint</p>
              <p className="mt-1 font-semibold text-slate-900">
                Sprint {task.sprintId}
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Task ID</p>
              <p className="mt-1 font-semibold text-slate-900">
                #{task.id}
              </p>
            </div>
          </section>

          {/* Assignee */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Assignee
            </h3>

            {assignee ? (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="h-10 w-10 rounded-full"
                />

                <div>
                  <p className="font-medium text-slate-900">
                    {assignee.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {assignee.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No assignee
              </p>
            )}
          </section>

          {/* Comments */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Comments ({taskComments.length})
              </h3>

              <button
                type="button"
                onClick={handleAddComment}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
              >
                Add Comment
              </button>
            </div>

            <div className="space-y-3">
              {taskComments.length === 0 ? (
                <div className="rounded-lg border border-dashed p-5 text-center text-sm text-slate-400">
                  No comments yet
                </div>
              ) : (
                taskComments.map((comment) => {
                  const author = users.find(
                    (user) => user.id === comment.authorId
                  );

                  return (
                    <div
                      key={comment.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-2">
                        {author && (
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="h-7 w-7 rounded-full"
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium">
                            {author?.name ?? "Unknown user"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {new Date(
                              comment.createdAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-5 text-slate-600">
                        {comment.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Actions */}
          <section className="border-t pt-5">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Task
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default TaskDrawer;