import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskStatus } from "../types";

interface BoardState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;

  updateTaskStatus: (
    taskId: number,
    status: TaskStatus
  ) => void;

  moveTask: (
    taskId: number,
    status: TaskStatus,
    order: number
  ) => void;

  deleteTask: (taskId: number) => void;

  addTask: (task: Task) => void;

  updateTask: (task: Task) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],

      setTasks: (tasks) => {
        set({
          tasks: tasks.map((task, index) => ({
            ...task,
            order: task.order ?? index,
          })),
        });
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  updatedAt: new Date().toISOString(),
                  completedAt:
                    status === "done"
                      ? task.completedAt ??
                        new Date().toISOString()
                      : null,
                }
              : task
          ),
        }));
      },

      moveTask: (taskId, status, order) => {
        set((state) => {
          const task = state.tasks.find(
            (item) => item.id === taskId
          );

          if (!task) {
            return state;
          }

          // Remove dragged task
          const withoutDraggedTask =
            state.tasks.filter(
              (item) => item.id !== taskId
            );

          // Tasks in destination column
          const destinationTasks =
            withoutDraggedTask
              .filter(
                (item) =>
                  item.status === status
              )
              .sort(
                (a, b) =>
                  a.order - b.order
              );

          // Keep order inside valid range
          const safeOrder = Math.max(
            0,
            Math.min(
              order,
              destinationTasks.length
            )
          );

          const movedTask: Task = {
            ...task,
            status,
            order: safeOrder,
            updatedAt:
              new Date().toISOString(),
            completedAt:
              status === "done"
                ? task.completedAt ??
                  new Date().toISOString()
                : null,
          };

          // Insert task at destination
          destinationTasks.splice(
            safeOrder,
            0,
            movedTask
          );

          // Recalculate destination order
          const reorderedDestination =
            destinationTasks.map(
              (item, index) => ({
                ...item,
                order: index,
              })
            );

          const destinationIds =
            new Set(
              reorderedDestination.map(
                (item) => item.id
              )
            );

          // Everything outside destination
          const otherTasks =
            withoutDraggedTask.filter(
              (item) =>
                !destinationIds.has(
                  item.id
                )
            );

          return {
            tasks: [
              ...otherTasks,
              ...reorderedDestination,
            ],
          };
        });
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(
            (task) => task.id !== taskId
          ),
        }));
      },

      addTask: (task) => {
        set((state) => {
          const sameColumn =
            state.tasks.filter(
              (item) =>
                item.status === task.status
            );

          return {
            tasks: [
              ...state.tasks,
              {
                ...task,
                order:
                  task.order ??
                  sameColumn.length,
              },
            ],
          };
        });
      },

      updateTask: (updatedTask) => {
        set((state) => ({
          tasks: state.tasks.map(
            (task) =>
              task.id === updatedTask.id
                ? updatedTask
                : task
          ),
        }));
      },
    }),
    {
      name: "sprintdesk-board",
    }
  )
);