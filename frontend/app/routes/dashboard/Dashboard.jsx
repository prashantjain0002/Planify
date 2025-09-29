import React from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";

import RecentProjects from "@/components/dashboard/RecentProjects";
import StatisticsCharts from "@/components/dashboard/StatisticsCharts";
import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingTasks from "@/components/dashboard/UpcomingTasks";
import Loader from "@/components/Loader";
import { useGetWorkspaceStatusQuery } from "@/hooks/useWorkspace";
import { useWorkspace } from "@/lib/provider/workspaceContext";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  // const workspaceId = searchParams.get("workspaceId");
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?._id || searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatusQuery(workspaceId);

  if (isPending) return <Loader />;

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="space-y-8 2xl:space-y-12 px-6"
      style={{ scrollbarWidth: "none" }} // Firefox
    >
      {/* Dashboard Header */}
      <motion.div
        className="flex items-center justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <StatsCard data={data.stats} />
      </motion.div>

      {/* Statistics Charts */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      </motion.div>

      {/* Recent Projects & Upcoming Tasks */}
      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div className="flex-1" variants={sectionVariants}>
          <RecentProjects data={data.recentProjects} />
        </motion.div>
        <motion.div className="flex-1" variants={sectionVariants}>
          <UpcomingTasks data={data.upcomingTasks} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
