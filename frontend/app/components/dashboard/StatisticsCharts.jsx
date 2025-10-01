import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/lib/provider/ThemeContext";

const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-8">
      <Card className={"lg:col-span-2"}>
        <CardHeader
          className={"flex flex-row items-center justify-between pb-2"}
        >
          <div className="space-y-1">
            <CardTitle className={"text-base font-medium"}>
              Task Trends
            </CardTitle>
            <CardDescription>Daily task status changes</CardDescription>
          </div>
          <ChartLine className="size-8 text-muted-foreground" />
        </CardHeader>

        <CardContent className={"w-full overflow-y-auto md:overflow-x-hidden"}>
          <div className="min-w-[350px] flex flex-col items-center">
            <ChartContainer
              className={"h-[300px] flex justify-center"}
              config={{
                completed: { color: "#10b981" },
                todo: { color: "#3b82f6" },
                inProgress: { color: "#f59e0b" },
              }}
            >
              <LineChart data={taskTrendsData}>
                <XAxis
                  dataKey={"name"}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid strokeDasharray={"3 3"} vertical={false} />
                <ChartTooltip />

                <Line
                  type={"monotone"}
                  dataKey={"completed"}
                  stroke={"#10b981"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

                <Line
                  type={"monotone"}
                  dataKey={"inProgress"}
                  stroke={"#f59e0b"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

                <Line
                  type={"monotone"}
                  dataKey={"todo"}
                  stroke={"#3b82f6"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          className={"flex flex-row items-center justify-between pb-2"}
        >
          <div className="space-y-1">
            <CardTitle className={"text-base font-medium"}>
              Project Status
            </CardTitle>
            <CardDescription>Project status breakdown</CardDescription>
          </div>
          <ChartPie className="size-6 text-muted-foreground" />
        </CardHeader>

        <CardContent className={"w-full overflow-x-auto md:overflow-x-hidden"}>
          <div className="min-w-[350px] flex flex-col items-center">
            <ChartContainer
              className={"h-[300px] flex justify-center"}
              config={{
                Completed: { color: "#10b981" },
                "In Progress": { color: "#f59e0b" },
                Planning: { color: "#3b82f6" },
              }}
            >
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx={"50%"}
                  cy={"50%"}
                  dataKey={"value"}
                  nameKey={"name"}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          className={"flex flex-row items-center justify-between pb-2"}
        >
          <div className="space-y-1">
            <CardTitle className={"text-base font-medium"}>
              Task Priority
            </CardTitle>
            <CardDescription>Task priority breakdown</CardDescription>
          </div>
          <ChartPie className="size-6 text-muted-foreground" />
        </CardHeader>

        <CardContent className={"w-full overflow-x-auto md:overflow-x-hidden"}>
          <div className="min-w-[350px] flex flex-col items-center">
            <ChartContainer
              className={"h-[300px] flex justify-center"}
              config={{
                High: { color: "#ef4444" },
                Medium: { color: "#f59e0b" },
                Low: { color: "#6b7280" },
              }}
            >
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  cx={"50%"}
                  cy={"50%"}
                  dataKey={"value"}
                  nameKey={"name"}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={"lg:col-span-2"}>
        <CardHeader
          className={"flex flex-row items-center justify-between pb-2"}
        >
          <div className="space-y-1">
            <CardTitle className={"text-base font-medium"}>
              Workspace Productivity
            </CardTitle>
            <CardDescription>Task completion by project</CardDescription>
          </div>
          <ChartBarBig className="size-6 text-muted-foreground" />
        </CardHeader>

        <CardContent className={"w-full overflow-x-auto md:overflow-x-hidden"}>
          <div className="min-w-[350px] flex flex-col items-center">
            <ChartContainer
              className="h-[300px] flex justify-center"
              config={{
                completed: { color: "#3b82f6" },
                total: { color: theme === "dark" ? "#f3f4f6" : "#000000" },
              }}
            >
              <BarChart
                data={workspaceProductivityData}
                barGap={0}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  stroke={theme === "dark" ? "#d1d5db" : "#888888"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={theme === "dark" ? "#d1d5db" : "#888888"}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                />
                <ChartTooltip content={<ChartTooltipContent />} />

                <Bar
                  dataKey="total"
                  fill={theme === "dark" ? "#f3f4f6" : "#000"}
                  radius={[4, 4, 0, 0]}
                  name="Total Tasks"
                />

                <Bar
                  dataKey="completed"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCharts;
