import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

const StatsCard = ({ data }) => {
  const stats = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      subtitle: `${data?.totalProjectsInProgress ?? 0} in progress`,
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      subtitle: `${data?.totalTaskCompleted ?? 0} completed`,
    },
    {
      title: "To Do",
      value: data.totalTaskToDo,
      subtitle: "Tasks waiting to be done",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      subtitle: "Tasks currently in progress",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCard;
