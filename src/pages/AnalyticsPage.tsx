import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Navigation from "../components/ui/Navigation";
import { useBoardStore } from "../stores/boardStore";
import { getMockData } from "../services/api/mockApi";
import { useEffect, useState } from "react";
import type { MockData } from "../types";

const columns = [
  { id: "backlog", label: "Backlog" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
] as const;

const priorityColors = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
];

function AnalyticsPage() {
  const tasks = useBoardStore((state) => state.tasks);

  const [data, setData] = useState<MockData | null>(null);

  // =========================================================
  // LOAD MOCK DATA
  // =========================================================

  useEffect(() => {
    getMockData().then((mockData) => {
      setData(mockData);
    });
  }, []);

  // =========================================================
  // STATUS DATA - CHART 1
  // =========================================================

  const statusData = useMemo(() => {
    return columns.map((column) => ({
      name: column.label,
      value: tasks.filter(
        (task) => task.status === column.id
      ).length,
    }));
  }, [tasks]);

  // =========================================================
  // PRIORITY DATA - CHART 2
  // =========================================================

  const priorityData = useMemo(() => {
    const priorities = ["high", "medium", "low"] as const;

    return priorities.map((priority) => ({
      name:
        priority.charAt(0).toUpperCase() +
        priority.slice(1),
      value: tasks.filter(
        (task) => task.priority === priority
      ).length,
    }));
  }, [tasks]);

  // =========================================================
  // SPRINT DATA - CHART 3
  // =========================================================

  const sprintData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.sprints.map((sprint) => {
      const sprintTasks = tasks.filter(
        (task) => task.sprintId === sprint.id
      );

      const completed = sprintTasks.filter(
        (task) => task.status === "done"
      ).length;

      return {
        name: sprint.name,
        total: sprintTasks.length,
        completed,
      };
    });
  }, [data, tasks]);

  // =========================================================
  // COMPLETION TREND - CHART 4
  // =========================================================

  const completionTrendData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.sprints.map((sprint) => {
      const sprintTasks = tasks.filter(
        (task) => task.sprintId === sprint.id
      );

      const completed = sprintTasks.filter(
        (task) => task.status === "done"
      ).length;

      const percentage =
        sprintTasks.length > 0
          ? Math.round(
              (completed / sprintTasks.length) * 100
            )
          : 0;

      return {
        name: sprint.name,
        completion: percentage,
      };
    });
  }, [data, tasks]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const completed = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const review = tasks.filter(
    (task) => task.status === "review"
  ).length;

  const backlog = tasks.filter(
    (task) => task.status === "backlog"
  ).length;

  const completionPercentage =
    tasks.length > 0
      ? Math.round(
          (completed / tasks.length) * 100
        )
      : 0;

  // =========================================================
  // LOADING
  // =========================================================

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">

      {/* HEADER */}

      <header className="border-b bg-white px-6 py-4">
  <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">

    {/* Page Title */}
    <div>
      <h1 className="text-2xl font-bold">
        Sprint Analytics
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Analyze sprint performance and task distribution
      </p>
    </div>

    {/* Navigation */}
    <Navigation />

  </div>
</header>
      <main className="mx-auto max-w-7xl space-y-6 p-6">

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            <MetricCard
              label="Total Tasks"
              value={tasks.length}
            />

            <MetricCard
              label="Completed"
              value={completed}
            />

            <MetricCard
              label="In Progress"
              value={inProgress}
            />

            <MetricCard
              label="Review"
              value={review}
            />

            <MetricCard
              label="Backlog"
              value={backlog}
            />

          </div>
        </section>

        {/* =================================================
            OVERALL COMPLETION
        ================================================= */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-3 flex items-center justify-between">

            <div>
              <h2 className="font-semibold">
                Overall Completion
              </h2>

              <p className="text-sm text-slate-500">
                {completed} of {tasks.length} tasks completed
              </p>
            </div>

            <span className="text-xl font-bold text-blue-600">
              {completionPercentage}%
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />

          </div>

        </section>

        {/* =================================================
            CHART 1 + CHART 2
        ================================================= */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* CHART 1 - TASK STATUS */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-1 text-lg font-semibold">
              Task Status
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Distribution across board columns
            </p>

            <div className="h-72 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={statusData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    name="Tasks"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    animationDuration={700}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* CHART 2 - PRIORITY */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-1 text-lg font-semibold">
              Priority Breakdown
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Tasks grouped by priority
            </p>

            <div className="h-72 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                    animationDuration={700}
                  >

                    {priorityData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            priorityColors[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>

        {/* =================================================
            CHART 3 + CHART 4
        ================================================= */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* CHART 3 - TASKS BY SPRINT */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-1 text-lg font-semibold">
              Tasks by Sprint
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Total and completed tasks for each sprint
            </p>

            <div className="h-72 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={sprintData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    name="Total Tasks"
                    fill="#64748b"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#22c55e"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* CHART 4 - COMPLETION TREND */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <h2 className="mb-1 text-lg font-semibold">
              Completion Trend
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Completion percentage by sprint
            </p>

            <div className="h-72 w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart data={completionTrendData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis
                    domain={[0, 100]}
                    unit="%"
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Completion",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="completion"
                    name="Completion"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={700}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </section>

        {/* =================================================
            STATUS SUMMARY TABLE
        ================================================= */}

        <section className="rounded-xl border bg-white p-5 shadow-sm">

          <h2 className="mb-4 text-lg font-semibold">
            Status Summary
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[500px] text-left text-sm">

              <thead>

                <tr className="border-b text-slate-500">

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Tasks
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Percentage
                  </th>

                </tr>

              </thead>

              <tbody>

                {statusData.map((item) => {

                  const percentage =
                    tasks.length > 0
                      ? Math.round(
                          (item.value /
                            tasks.length) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={item.name}
                      className="border-b last:border-0"
                    >

                      <td className="px-4 py-3 font-medium">
                        {item.name}
                      </td>

                      <td className="px-4 py-3">
                        {item.value}
                      </td>

                      <td className="px-4 py-3">
                        {percentage}%
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

// ===========================================================
// METRIC CARD
// ===========================================================

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

export default AnalyticsPage;