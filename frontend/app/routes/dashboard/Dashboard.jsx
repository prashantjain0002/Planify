import StatisticsCharts from "@/components/dashboard/StatisticsCharts";
import StatsCard from "@/components/dashboard/StatsCard";
import Loader from "@/components/Loader";
import { useGetWorkspaceStatusQuery } from "@/hooks/useWorkspace";
import React from "react";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatusQuery(workspaceId);

  if (isPending) return <Loader />;

  console.log(data);

  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />
    </div>
  );
};

export default Dashboard;
