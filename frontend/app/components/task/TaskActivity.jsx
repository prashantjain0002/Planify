import React from "react";
import Loader from "../Loader";
import { useActivityByResourceIdQuery } from "@/hooks/useTask";
import { getActivityIcon } from "./TaskIcon";
import { formatDistanceToNow } from "date-fns";

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
    <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-lg font-medium mb-6">Activity</h3>

      <div className="flex flex-col space-y-4">
        {data.map((activity) => (
          <div key={activity._id} className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.action)}
            </div>

            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                {activity.details?.description}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskActivity;
