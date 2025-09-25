import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartLine } from "lucide-react";

const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}) => {
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
          <CardContent
            className={"w-full overflow-y-auto md:overflow-x-hidden"}
          >
            <div className="min-w-[350px]"></div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default StatisticsCharts;
