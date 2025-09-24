import Loader from "@/components/Loader";
import TaskAssigneesSelector from "@/components/task/TaskAssigneesSelector";
import TaskDescription from "@/components/task/TaskDescription";
import TaskPrioritySelector from "@/components/task/TaskPrioritySelector";
import TaskStatusSelector from "@/components/task/TaskStatusSelector";
import TaskTitle from "@/components/task/TaskTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskByIdQuery } from "@/hooks/useTask";
import { useAuth } from "@/lib/provider/authContext";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Task not found</h1>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watcher?.some(
    (watcher) => watcher._id.toString() === user._id.toString()
  );

  const members = task?.assignees || [];

  return (
    <div className="container mx-auto p-0 py-4 md:px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex flex-col md:flex-row md:items-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant={"outline"}
            size={"sm"}
            className={"p-4 me-4"}
          >
            ← Back
          </Button>
          <h1 className="font-bold text-xl md:text-2xl">{task.title}</h1>

          {task.isArchived && (
            <Badge className={"ml-2"} variant={"destructive"}>
              Archived
            </Badge>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant={isUserWatching ? "destructive" : "outline"}
            size={"sm"}
            onClick={() => {}}
            className={"w-fit"}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="size-4" /> UnWatch
              </>
            ) : (
              <>
                <Eye className="size-4" /> Watch
              </>
            )}
          </Button>

          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => {}}
            className={"w-fit"}
          >
            {task?.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between items-start mb-4">
              <div>
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                        ? "default"
                        : "outline"
                  }
                  className="mb-2 capitalize"
                >
                  {task.priority} Priority
                </Badge>

                <TaskTitle title={task.title} taskId={task._id} />

                <div className="text-sm text-muted-foreground">
                  Created at{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}{" "}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <TaskStatusSelector taskId={task._id} status={task.status} />
                <Button
                  className={"hidden md:block"}
                  size={"sm"}
                  onClick={() => {}}
                  variant={"destructive"}
                >
                  Delete Task
                </Button>
              </div>
            </div>

            <div className="mb-6 flex flex-row gap-1">
              <h3 className="text-sm font-bold mb-0">Description :</h3>

              <TaskDescription
                description={task.description || ""}
                taskId={task._id}
              />
            </div>

            <TaskAssigneesSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members}
            />

            <TaskPrioritySelector
              priority={task.priority}
              taskId={task._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
