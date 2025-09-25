import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const StatsCard = ({ data }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle className={"text-sm font-medium"}>
            Total Projects
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{data.totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            {data?.totalProjectInProgress} in progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle className={"text-sm font-medium"}>Total Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{data.totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {data?.totalTaskCompleted} completed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle className={"text-sm font-medium"}>To Do</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{data.totalTaskToDo}</div>
          <p className="text-xs text-muted-foreground">
            Tasks waiting to be done
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <CardTitle className={"text-sm font-medium"}>In Progress</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold">{data.totalTaskInProgress}</div>
          <p className="text-xs text-muted-foreground">
            Tasks currently in progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
