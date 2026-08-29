interface TaskFilterProps {
  search: string;
  priority: string;
  status: string;
  assigneeId: string;

  onSearchChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;

  users: {
    id: number;
    name: string;
    avatar: string;
  }[];
}

function TaskFilter({
  search,
  priority,
  status,
  assigneeId,
  onSearchChange,
  onPriorityChange,
  onStatusChange,
  onAssigneeChange,
  users,
}: TaskFilterProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Filter Tasks
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search and filter tasks
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Search */}
        <div>
          <label
            htmlFor="task-search"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Search
          </label>

          <input
            id="task-search"
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search tasks..."
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-sm
              text-slate-900
              outline-none
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-100
              dark:placeholder:text-slate-500
              dark:focus:border-blue-400
              dark:focus:ring-blue-400/20
            "
          />
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="task-priority"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Priority
          </label>

          <select
            id="task-priority"
            value={priority}
            onChange={(event) =>
              onPriorityChange(event.target.value)
            }
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-sm
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-100
              dark:focus:border-blue-400
              dark:focus:ring-blue-400/20
            "
          >
            <option value="all">
              All Priorities
            </option>

            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="task-status"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Status
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-sm
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-100
              dark:focus:border-blue-400
              dark:focus:ring-blue-400/20
            "
          >
            <option value="all">
              All Statuses
            </option>

            <option value="backlog">
              Backlog
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="review">
              Review
            </option>

            <option value="done">
              Done
            </option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label
            htmlFor="task-assignee"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Assignee
          </label>

          <select
            id="task-assignee"
            value={assigneeId}
            onChange={(event) =>
              onAssigneeChange(event.target.value)
            }
            className="
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-sm
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20

              dark:border-slate-600
              dark:bg-slate-800
              dark:text-slate-100
              dark:focus:border-blue-400
              dark:focus:ring-blue-400/20
            "
          >
            <option value="all">
              All Assignees
            </option>

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

      </div>
    </div>
  );
}

export default TaskFilter;