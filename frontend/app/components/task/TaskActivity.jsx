import React from "react";
import Loader from "../Loader";
import { useActivityByResourceIdQuery } from "@/hooks/useTask";
import { getActivityIcon } from "./TaskIcon";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const TaskActivity = ({ resourceId }) => {
  const { data, isPending } = useActivityByResourceIdQuery(resourceId);

  if (isPending) return <Loader />;

  if (!data || data.length === 0)
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm mb-6 text-center text-sm text-muted-foreground">
        No activity yet
      </div>
    );

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg mb-6">
      <h3 className="text-xl font-semibold mb-4">Activity</h3>

      {/* Scrollable container without visible scrollbar */}
      <div className="flex flex-col space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {data.map((activity) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-4 bg-gray-50 rounded-lg p-3 shadow hover:shadow-md transition-shadow border-l-4 border-primary/50"
            >
              <div className="flex-shrink-0">{getActivityIcon(activity.action)}</div>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.details?.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskActivity;
