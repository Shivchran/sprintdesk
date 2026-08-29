import ThemeToggle from "../components/ui/ThemeToggle";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import NotificationBell from "../components/ui/NotificationBell";
import AddTaskModal from "../components/ui/AddTaskModal";
import TaskDrawer from "../components/ui/TaskDrawer";
import TaskFilter from "../components/ui/TaskFilter";

import { useNotifications } from "../hooks/useNotifications";

import { useBoardStore } from "../stores/boardStore";
import { useAuthStore } from "../stores/authStore";

import { getMockData } from "../services/api/mockApi";

import type {
  MockData,
  Task,
  TaskStatus,
} from "../types";

/* =========================================================
   COLUMNS
========================================================= */

const columns: {
  id: TaskStatus;
  label: string;
}[] = [
  {
    id: "backlog",
    label: "Backlog",
  },
  {
    id: "in-progress",
    label: "In Progress",
  },
  {
    id: "review",
    label: "Review",
  },
  {
    id: "done",
    label: "Done",
  },
];

/* =========================================================
   DASHBOARD PAGE
========================================================= */

function DashboardPage() {
  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  useNotifications();

  /* =======================================================
     BOARD STORE
  ======================================================= */

  const tasks = useBoardStore(
    (state) => state.tasks
  );

  const setTasks = useBoardStore(
    (state) => state.setTasks
  );

  const moveTask = useBoardStore(
    (state) => state.moveTask
  );

  const deleteTask = useBoardStore(
    (state) => state.deleteTask
  );

  const addTask = useBoardStore(
    (state) => state.addTask
  );

  /* =======================================================
     AUTH
  ======================================================= */

  const authUser = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  /* =======================================================
     SERVER / MOCK DATA
  ======================================================= */

  const [data, setData] =
    useState<MockData | null>(null);

  /* =======================================================
     LOCAL UI STATE
  ======================================================= */

  const [selectedSprint, setSelectedSprint] =
    useState(3);

  const [selectedTaskId, setSelectedTaskId] =
    useState<number | null>(null);

  const [isAddTaskOpen, setIsAddTaskOpen] =
    useState(false);

  const [activeTaskId, setActiveTaskId] =
    useState<number | null>(null);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [assigneeFilter, setAssigneeFilter] =
    useState("all");

  /* =======================================================
     DND SENSORS
  ======================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  /* =======================================================
     LOAD MOCK DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    getMockData().then((mockData) => {
      if (!mounted) {
        return;
      }

      setData(mockData);

      if (tasks.length === 0) {
        setTasks(mockData.tasks);
      }
    });

    return () => {
      mounted = false;
    };
  }, [setTasks, tasks.length]);

  /* =======================================================
     SPRINT TASKS
  ======================================================= */

  const sprintTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.sprintId === selectedSprint
    );
  }, [tasks, selectedSprint]);

  /* =======================================================
     FILTERED TASKS
  ======================================================= */

  const filteredTasks = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return sprintTasks.filter((task) => {
      const matchesSearch =
        searchText === "" ||
        task.title
          .toLowerCase()
          .includes(searchText) ||
        task.description
          .toLowerCase()
          .includes(searchText);

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesAssignee =
        assigneeFilter === "all" ||
        task.assigneeId ===
          Number(assigneeFilter);

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesAssignee
      );
    });
  }, [
    sprintTasks,
    search,
    priorityFilter,
    statusFilter,
    assigneeFilter,
  ]);

  /* =======================================================
     SELECTED TASK
  ======================================================= */

  const selectedTask = useMemo(() => {
    if (selectedTaskId === null) {
      return null;
    }

    return (
      tasks.find(
        (task) =>
          task.id === selectedTaskId
      ) ?? null
    );
  }, [tasks, selectedTaskId]);

  /* =======================================================
     ACTIVE DRAG TASK
  ======================================================= */

  const activeTask = useMemo(() => {
    if (activeTaskId === null) {
      return null;
    }

    return (
      tasks.find(
        (task) =>
          task.id === activeTaskId
      ) ?? null
    );
  }, [tasks, activeTaskId]);

  /* =======================================================
     DRAG START
  ======================================================= */

  const handleDragStart = (
    event: DragStartEvent
  ) => {
    setActiveTaskId(
      Number(event.active.id)
    );
  };

  /* =======================================================
     DRAG CANCEL
  ======================================================= */

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  /* =======================================================
     DRAG END
  ======================================================= */

  const handleDragEnd = (
    event: DragEndEvent
  ) => {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) {
      return;
    }

    const activeId = Number(active.id);
    const overId = String(over.id);

    const activeTask = tasks.find(
      (task) => task.id === activeId
    );

    if (!activeTask) {
      return;
    }

    /* -----------------------------------------------------
       DROP DIRECTLY ON COLUMN
    ----------------------------------------------------- */

    const targetColumn = columns.find(
      (column) => column.id === overId
    );

    if (targetColumn) {
      const destinationTasks = tasks
        .filter(
          (task) =>
            task.status ===
              targetColumn.id &&
            task.id !== activeId
        )
        .sort(
          (a, b) =>
            a.order - b.order
        );

      moveTask(
        activeId,
        targetColumn.id,
        destinationTasks.length
      );

      return;
    }

    /* -----------------------------------------------------
       DROP ON ANOTHER TASK
    ----------------------------------------------------- */

    const overTask = tasks.find(
      (task) =>
        task.id === Number(overId)
    );

    if (!overTask) {
      return;
    }

    if (activeId === overTask.id) {
      return;
    }

    const destinationStatus =
      overTask.status;

    const destinationTasks = tasks
      .filter(
        (task) =>
          task.status ===
            destinationStatus &&
          task.id !== activeId
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );

    const targetIndex =
      destinationTasks.findIndex(
        (task) =>
          task.id === overTask.id
      );

    moveTask(
      activeId,
      destinationStatus,
      targetIndex >= 0
        ? targetIndex
        : destinationTasks.length
    );
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = (
    taskId: number
  ) => {
    deleteTask(taskId);
    setSelectedTaskId(null);
  };

  /* =======================================================
     ADD COMMENT
  ======================================================= */

  const handleAddComment = (
    taskId: number,
    message: string
  ) => {
    setData((currentData) => {
      if (!currentData) {
        return currentData;
      }

      const newComment = {
        id:
          Math.max(
            0,
            ...currentData.comments.map(
              (comment) =>
                comment.id
            )
          ) + 1,

        taskId,

        authorId: 1,

        message,

        createdAt:
          new Date().toISOString(),
      };

      return {
        ...currentData,

        comments: [
          ...currentData.comments,
          newComment,
        ],
      };
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <p className="text-slate-500 dark:text-slate-400">
          Loading SprintDesk...
        </p>
      </div>
    );
  }

  /* =======================================================
     STATISTICS
  ======================================================= */

  const completed =
    sprintTasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const inProgress =
    sprintTasks.filter(
      (task) =>
        task.status === "in-progress"
    ).length;

  const review =
    sprintTasks.filter(
      (task) =>
        task.status === "review"
    ).length;

  const progress =
    sprintTasks.length > 0
      ? Math.round(
          (completed /
            sprintTasks.length) *
            100
        )
      : 0;

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-200 bg-white px-4 py-4 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:px-6">

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          {/* Logo */}

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              SprintDesk
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Agile project management dashboard
            </p>
          </div>

          {/* Header Controls */}

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            {/* Sprint */}

            <select
              value={selectedSprint}
              onChange={(event) =>
                setSelectedSprint(
                  Number(
                    event.target.value
                  )
                )
              }
              aria-label="Select sprint"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {data.sprints.map(
                (sprint) => (
                  <option
                    key={sprint.id}
                    value={sprint.id}
                  >
                    {sprint.name}
                  </option>
                )
              )}
            </select>

            {/* Analytics */}

            <Link
              to="/analytics"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Analytics
            </Link>

            {/* Theme */}

            <ThemeToggle />

            {/* Notifications */}

            <NotificationBell />

            {/* User */}

            {authUser && (
              <div className="flex items-center gap-2 sm:gap-3">

                {authUser.image ? (
                  <img
                    src={authUser.image}
                    alt={`${authUser.firstName} ${authUser.lastName}`}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {authUser.firstName.charAt(
                      0
                    )}
                  </div>
                )}

                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {authUser.firstName}{" "}
                    {authUser.lastName}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {authUser.username}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">

        {/* ===================================================
            SPRINT OVERVIEW
        ==================================================== */}

        <section>

          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            Sprint Overview
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              label="Total Tasks"
              value={sprintTasks.length}
            />

            <StatCard
              label="Completed"
              value={completed}
            />

            <StatCard
              label="In Progress"
              value={inProgress}
            />

            <StatCard
              label="In Review"
              value={review}
            />

          </div>
        </section>

        {/* ===================================================
            PROGRESS
        ==================================================== */}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5">

          <div className="mb-3 flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-slate-900 dark:text-white">
                Sprint Progress
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {completed} of{" "}
                {sprintTasks.length}{" "}
                tasks completed
              </p>

            </div>

            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {progress}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>
        </section>

        {/* ===================================================
            FILTER
        ==================================================== */}

        <section>
          <TaskFilter
            search={search}
            priority={priorityFilter}
            status={statusFilter}
            assigneeId={assigneeFilter}
            onSearchChange={setSearch}
            onPriorityChange={
              setPriorityFilter
            }
            onStatusChange={
              setStatusFilter
            }
            onAssigneeChange={
              setAssigneeFilter
            }
            users={data.users}
          />
        </section>

        {/* ===================================================
            BOARD
        ==================================================== */}

        <section>

          <div className="mb-4 flex items-center justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Sprint Board
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drag tasks between columns or reorder them.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setIsAddTaskOpen(true)
              }
              className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              + Add Task
            </button>

          </div>

          {/* =================================================
              DND CONTEXT
          ================================================== */}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
          >

            {/* BOARD */}

            <div className="grid gap-4 overflow-x-auto pb-4 xl:grid-cols-4">

              {columns.map((column) => {

                const columnTasks =
                  filteredTasks
                    .filter(
                      (task) =>
                        task.status ===
                        column.id
                    )
                    .sort(
                      (a, b) =>
                        a.order - b.order
                    );

                return (
                  <DroppableColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    users={data.users}
                    onTaskClick={
                      setSelectedTaskId
                    }
                  />
                );
              })}

            </div>

            {/* =================================================
                DRAG OVERLAY
            ================================================== */}

            <DragOverlay>
              {activeTask ? (
                <DragPreview
                  task={activeTask}
                  user={data.users.find(
                    (user) =>
                      user.id ===
                      activeTask.assigneeId
                  )}
                />
              ) : null}
            </DragOverlay>

          </DndContext>
        </section>
      </main>

      {/* =====================================================
          TASK DRAWER
      ===================================================== */}

      <TaskDrawer
        task={selectedTask}
        users={data.users}
        comments={data.comments}
        onClose={() =>
          setSelectedTaskId(null)
        }
        onStatusChange={(
          taskId,
          status
        ) => {

          const destinationTasks =
            tasks
              .filter(
                (task) =>
                  task.status === status &&
                  task.id !== taskId
              )
              .sort(
                (a, b) =>
                  a.order - b.order
              );

          moveTask(
            taskId,
            status,
            destinationTasks.length
          );
        }}
        onDelete={handleDelete}
        onAddComment={handleAddComment}
      />

      {/* =====================================================
          ADD TASK MODAL
      ===================================================== */}

      <AddTaskModal
        open={isAddTaskOpen}
        onClose={() =>
          setIsAddTaskOpen(false)
        }
        users={data.users}
        sprintId={selectedSprint}
        onAddTask={addTask}
      />

    </div>
  );
}

/* ===========================================================
   DROPPABLE COLUMN
=========================================================== */

function DroppableColumn({
  column,
  tasks,
  users,
  onTaskClick,
}: {
  column: {
    id: TaskStatus;
    label: string;
  };

  tasks: Task[];

  users: {
    id: number;
    name: string;
    avatar: string;
  }[];

  onTaskClick: (
    taskId: number
  ) => void;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[240px]
        min-w-[280px]
        rounded-xl
        p-3
        transition-all
        duration-200

        ${
          isOver
            ? "bg-blue-100 ring-2 ring-blue-400 shadow-lg dark:bg-blue-950/60 dark:ring-blue-500"
            : "bg-slate-200/70 dark:bg-slate-800/70"
        }
      `}
    >

      {/* Column Header */}

      <div className="mb-3 flex items-center justify-between">

        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
          {column.label}
        </h3>

        <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-200">
          {tasks.length}
        </span>

      </div>

      {/* Sortable Tasks */}

      <SortableContext
        items={tasks.map(
          (task) => task.id
        )}
        strategy={
          verticalListSortingStrategy
        }
      >

        <div className="min-h-[170px] space-y-3">

          {tasks.map((task) => {

            const user =
              users.find(
                (item) =>
                  item.id ===
                  task.assigneeId
              );

            return (
              <SortableTaskCard
                key={task.id}
                task={task}
                user={user}
                onClick={() =>
                  onTaskClick(task.id)
                }
              />
            );
          })}

          {/* Empty Column */}

          {tasks.length === 0 && (
            <div
              className={`
                flex
                min-h-[140px]
                items-center
                justify-center
                rounded-lg
                border-2
                border-dashed
                text-sm
                transition

                ${
                  isOver
                    ? "border-blue-400 bg-blue-50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                    : "border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500"
                }
              `}
            >
              {isOver
                ? "Drop task here"
                : "No tasks"}
            </div>
          )}

        </div>

      </SortableContext>
    </div>
  );
}

/* ===========================================================
   SORTABLE TASK CARD
=========================================================== */

function SortableTaskCard({
  task,
  user,
  onClick,
}: {
  task: Task;

  user?: {
    id: number;
    name: string;
    avatar: string;
  };

  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Open task ${task.title}`}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      className="
        cursor-grab
        rounded-lg
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition

        hover:-translate-y-0.5
        hover:shadow-md

        active:cursor-grabbing

        focus:outline-none
        focus:ring-2
        focus:ring-blue-500

        dark:border-slate-700
        dark:bg-slate-900
        dark:hover:bg-slate-800
      "
    >

      {/* Title + Priority */}

      <div className="mb-2 flex items-start justify-between gap-2">

        <h4 className="font-medium text-slate-900 dark:text-slate-100">
          {task.title}
        </h4>

        <span
          className={`
            shrink-0
            rounded
            px-2
            py-1
            text-xs
            font-medium

            ${
              task.priority === "high"
                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300"
                : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
            }
          `}
        >
          {task.priority}
        </span>

      </div>

      {/* Description */}

      <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      {/* Assignee + Date */}

      <div className="flex items-center justify-between gap-2">

        <div className="flex min-w-0 items-center gap-2">

          {user && (
            <>
              <img
                src={user.avatar}
                alt={user.name}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />

              <span className="truncate text-xs text-slate-600 dark:text-slate-300">
                {user.name.split(" ")[0]}
              </span>
            </>
          )}

        </div>

        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
          Due {task.dueDate}
        </span>

      </div>
    </article>
  );
}

/* ===========================================================
   DRAG PREVIEW
=========================================================== */

function DragPreview({
  task,
  user,
}: {
  task: Task;

  user?: {
    id: number;
    name: string;
    avatar: string;
  };
}) {
  return (
    <div className="w-[280px] rotate-2 rounded-lg border-2 border-blue-400 bg-white p-4 shadow-2xl dark:border-blue-500 dark:bg-slate-900">

      {/* Title */}

      <div className="mb-2 flex items-start justify-between gap-2">

        <h4 className="font-medium text-slate-900 dark:text-slate-100">
          {task.title}
        </h4>

        <span
          className={`
            shrink-0
            rounded
            px-2
            py-1
            text-xs
            font-medium

            ${
              task.priority === "high"
                ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300"
                : "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
            }
          `}
        >
          {task.priority}
        </span>

      </div>

      {/* Description */}

      <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
        {task.description}
      </p>

      {/* User */}

      {user && (
        <div className="mt-3 flex items-center gap-2">

          <img
            src={user.avatar}
            alt={user.name}
            className="h-6 w-6 rounded-full object-cover"
          />

          <span className="text-xs text-slate-600 dark:text-slate-300">
            {user.name}
          </span>

        </div>
      )}

    </div>
  );
}

/* ===========================================================
   STAT CARD
=========================================================== */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}

export default DashboardPage;