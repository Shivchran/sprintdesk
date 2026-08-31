import ThemeToggle from "../components/ui/ThemeToggle";
import Navigation from "../components/ui/Navigation";

import { useBoardStore } from "../stores/boardStore";
import { getMockData } from "../services/api/mockApi";

import { useEffect, useMemo, useState } from "react";

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

import type { MockData } from "../types";

/* =========================================================
   COLUMNS
========================================================= */

const columns = [
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
] as const;

/* =========================================================
   PRIORITY COLORS
========================================================= */

const priorityColors = [
  "#ef4444",
  "#f59e0b",
  "#22c55e",
];

/* =========================================================
   ANALYTICS PAGE
========================================================= */

function AnalyticsPage() {
  /* =======================================================
     BOARD STORE
  ======================================================= */

  const tasks = useBoardStore(
    (state) => state.tasks
  );

  /* =======================================================
     MOCK DATA
  ======================================================= */

  const [data, setData] =
    useState<MockData | null>(null);

  /* =======================================================
     DARK MODE STATE
  ======================================================= */

  const [isDark, setIsDark] =
    useState(false);

  /* =========================================================
     LOAD MOCK DATA
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    getMockData().then((mockData) => {
      if (!mounted) {
        return;
      }

      setData(mockData);
    });

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     DETECT THEME
  ========================================================= */

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(
        document.documentElement.classList.contains(
          "dark"
        )
      );
    };

    checkTheme();

    const observer =
      new MutationObserver(checkTheme);

    observer.observe(
      document.documentElement,
      {
        attributes: true,
        attributeFilter: ["class"],
      }
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =========================================================
     CHART COLORS
  ========================================================= */

  const chartTextColor = isDark
    ? "#cbd5e1"
    : "#64748b";

  const chartGridColor = isDark
    ? "#334155"
    : "#e2e8f0";

  const tooltipBackground = isDark
    ? "#0f172a"
    : "#ffffff";

  const tooltipBorder = isDark
    ? "#334155"
    : "#e2e8f0";

  const tooltipText = isDark
    ? "#f8fafc"
    : "#0f172a";

  /* =========================================================
     STATUS DATA
  ========================================================= */

  const statusData = useMemo(() => {
    return columns.map((column) => ({
      name: column.label,

      value: tasks.filter(
        (task) =>
          task.status === column.id
      ).length,
    }));
  }, [tasks]);

  /* =========================================================
     PRIORITY DATA
  ========================================================= */

  const priorityData = useMemo(() => {
    const priorities = [
      "high",
      "medium",
      "low",
    ] as const;

    return priorities.map(
      (priority) => ({
        name:
          priority
            .charAt(0)
            .toUpperCase() +
          priority.slice(1),

        value: tasks.filter(
          (task) =>
            task.priority === priority
        ).length,
      })
    );
  }, [tasks]);

  /* =========================================================
     SPRINT DATA
  ========================================================= */

  const sprintData = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.sprints.map(
      (sprint) => {
        const sprintTasks =
          tasks.filter(
            (task) =>
              task.sprintId ===
              sprint.id
          );

        const completed =
          sprintTasks.filter(
            (task) =>
              task.status === "done"
          ).length;

        return {
          name: sprint.name,
          total: sprintTasks.length,
          completed,
        };
      }
    );
  }, [data, tasks]);

  /* =========================================================
     COMPLETION TREND
  ========================================================= */

  const completionTrendData =
    useMemo(() => {
      if (!data) {
        return [];
      }

      return data.sprints.map(
        (sprint) => {
          const sprintTasks =
            tasks.filter(
              (task) =>
                task.sprintId ===
                sprint.id
            );

          const completed =
            sprintTasks.filter(
              (task) =>
                task.status === "done"
            ).length;

          const percentage =
            sprintTasks.length > 0
              ? Math.round(
                  (completed /
                    sprintTasks.length) *
                    100
                )
              : 0;

          return {
            name: sprint.name,
            completion: percentage,
          };
        }
      );
    }, [data, tasks]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const completed =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const inProgress =
    tasks.filter(
      (task) =>
        task.status === "in-progress"
    ).length;

  const review =
    tasks.filter(
      (task) =>
        task.status === "review"
    ).length;

  const backlog =
    tasks.filter(
      (task) =>
        task.status === "backlog"
    ).length;

  const completionPercentage =
    tasks.length > 0
      ? Math.round(
          (completed /
            tasks.length) *
            100
        )
      : 0;

  /* =========================================================
     LOADING
  ========================================================= */

  if (!data) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-100
          text-slate-900

          dark:bg-slate-950
          dark:text-slate-100
        "
      >
        <p
          className="
            text-slate-500
            dark:text-slate-400
          "
        >
          Loading analytics...
        </p>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-slate-100
        text-slate-900
        transition-colors
        duration-200

        dark:bg-slate-950
        dark:text-slate-100
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          border-b
          border-slate-200
          bg-white
          px-4
          py-4

          dark:border-slate-800
          dark:bg-slate-900

          sm:px-6
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-4

            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          {/* =================================================
              TITLE
          ================================================== */}

          <div>
            <h1
              className="
                text-2xl
                font-bold
                text-slate-900

                dark:text-slate-100
              "
            >
              Sprint Analytics
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >
              Analyze sprint performance
              and task distribution
            </p>
          </div>

          {/* =================================================
              HEADER CONTROLS
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-3
            "
          >

            {/* Navigation */}

            <Navigation />

            {/* Theme */}

            <ThemeToggle />

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main
        className="
          mx-auto
          max-w-7xl
          space-y-6
          p-4

          sm:p-6
        "
      >

        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <section>
          <div
            className="
              grid
              gap-4

              sm:grid-cols-2
              lg:grid-cols-5
            "
          >

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

        {/* ===================================================
            OVERALL COMPLETION
        ==================================================== */}

        <section
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-slate-700
            dark:bg-slate-900

            sm:p-6
          "
        >

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >

            <div>
              <h2
                className="
                  font-semibold
                  text-slate-900

                  dark:text-slate-100
                "
              >
                Overall Completion
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500

                  dark:text-slate-400
                "
              >
                {completed} of{" "}
                {tasks.length} tasks
                completed
              </p>
            </div>

            <span
              className="
                text-xl
                font-bold
                text-blue-600

                dark:text-blue-400
              "
            >
              {completionPercentage}%
            </span>

          </div>

          <div
            className="
              h-4
              overflow-hidden
              rounded-full
              bg-slate-200

              dark:bg-slate-700
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-blue-600
                transition-all
                duration-500

                dark:bg-blue-500
              "
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

        </section>

        {/* ===================================================
            CHART 1 + CHART 2
        ==================================================== */}

        <section
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {/* =================================================
              TASK STATUS
          ================================================== */}

          <ChartCard
            title="Task Status"
            description="Distribution across board columns"
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={statusData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartGridColor}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      tooltipBackground,
                    borderColor:
                      tooltipBorder,
                    color:
                      tooltipText,
                    borderRadius:
                      "8px",
                  }}
                  labelStyle={{
                    color:
                      tooltipText,
                  }}
                  itemStyle={{
                    color:
                      tooltipText,
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Tasks"
                  fill="#2563eb"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  animationDuration={700}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

          {/* =================================================
              PRIORITY
          ================================================== */}

          <ChartCard
            title="Priority Breakdown"
            description="Tasks grouped by priority"
          >

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
                  label={{
                    fill: chartTextColor,
                  }}
                  animationDuration={700}
                >

                  {priorityData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          priorityColors[
                            index
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      tooltipBackground,
                    borderColor:
                      tooltipBorder,
                    color:
                      tooltipText,
                    borderRadius:
                      "8px",
                  }}
                  labelStyle={{
                    color:
                      tooltipText,
                  }}
                  itemStyle={{
                    color:
                      tooltipText,
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </ChartCard>

        </section>

        {/* ===================================================
            CHART 3 + CHART 4
        ==================================================== */}

        <section
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {/* =================================================
              TASKS BY SPRINT
          ================================================== */}

          <ChartCard
            title="Tasks by Sprint"
            description="Total and completed tasks for each sprint"
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={sprintData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartGridColor}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      tooltipBackground,
                    borderColor:
                      tooltipBorder,
                    color:
                      tooltipText,
                    borderRadius:
                      "8px",
                  }}
                  labelStyle={{
                    color:
                      tooltipText,
                  }}
                  itemStyle={{
                    color:
                      tooltipText,
                  }}
                />

                <Bar
                  dataKey="total"
                  name="Total Tasks"
                  fill="#64748b"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#22c55e"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

          {/* =================================================
              COMPLETION TREND
          ================================================== */}

          <ChartCard
            title="Completion Trend"
            description="Completion percentage by sprint"
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  completionTrendData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chartGridColor}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  tick={{
                    fill: chartTextColor,
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: chartGridColor,
                  }}
                  tickLine={{
                    stroke: chartGridColor,
                  }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Completion",
                  ]}
                  contentStyle={{
                    backgroundColor:
                      tooltipBackground,
                    borderColor:
                      tooltipBorder,
                    color:
                      tooltipText,
                    borderRadius:
                      "8px",
                  }}
                  labelStyle={{
                    color:
                      tooltipText,
                  }}
                  itemStyle={{
                    color:
                      tooltipText,
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="completion"
                  name="Completion"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#2563eb",
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#2563eb",
                  }}
                  animationDuration={700}
                />

              </LineChart>

            </ResponsiveContainer>

          </ChartCard>

        </section>

        {/* ===================================================
            STATUS SUMMARY TABLE
        ==================================================== */}

        <section
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm

            dark:border-slate-700
            dark:bg-slate-900
          "
        >

          <h2
            className="
              mb-4
              text-lg
              font-semibold
              text-slate-900

              dark:text-slate-100
            "
          >
            Status Summary
          </h2>

          <div className="overflow-x-auto">

            <table
              className="
                w-full
                min-w-[500px]
                text-left
                text-sm
              "
            >

              <thead>

                <tr
                  className="
                    border-b
                    border-slate-200
                    text-slate-500

                    dark:border-slate-700
                    dark:text-slate-400
                  "
                >

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

                {statusData.map(
                  (item) => {
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
                        className="
                          border-b
                          border-slate-200
                          last:border-0

                          dark:border-slate-700
                        "
                      >

                        <td
                          className="
                            px-4
                            py-3
                            font-medium
                            text-slate-900

                            dark:text-slate-100
                          "
                        >
                          {item.name}
                        </td>

                        <td
                          className="
                            px-4
                            py-3
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {item.value}
                        </td>

                        <td
                          className="
                            px-4
                            py-3
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {percentage}%
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>
    </div>
  );
}

/* ===========================================================
   CHART CARD
=========================================================== */

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-colors

        dark:border-slate-700
        dark:bg-slate-900
      "
    >

      <h2
        className="
          mb-1
          text-lg
          font-semibold
          text-slate-900

          dark:text-slate-100
        "
      >
        {title}
      </h2>

      <p
        className="
          mb-5
          text-sm
          text-slate-500

          dark:text-slate-400
        "
      >
        {description}
      </p>

      <div className="h-72 w-full">
        {children}
      </div>

    </div>
  );
}

/* ===========================================================
   METRIC CARD
=========================================================== */

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-colors

        dark:border-slate-700
        dark:bg-slate-900
      "
    >

      <p
        className="
          text-sm
          text-slate-500

          dark:text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-2
          text-3xl
          font-bold
          text-slate-900

          dark:text-slate-100
        "
      >
        {value}
      </p>

    </div>
  );
}

export default AnalyticsPage;