import React from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
import SubTaskDetails from "@/components/task/SubTaskDetails";
import TaskActivity from "@/components/task/TaskActivity";
import TaskAssigneesSelector from "@/components/task/TaskAssigneesSelector";
import TaskDescription from "@/components/task/TaskDescription";
import TaskPrioritySelector from "@/components/task/TaskPrioritySelector";
import TaskStatusSelector from "@/components/task/TaskStatusSelector";
import TaskTitle from "@/components/task/TaskTitle";
import Watchers from "@/components/task/Watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTaskByIdQuery } from "@/hooks/useTask";
import { useAuth } from "@/lib/provider/authContext";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import CommentSection from "@/components/task/CommentSection";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useTaskByIdQuery(taskId);

  if (isLoading) return <Loader />;
  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Task not found</h1>
      </div>
    );

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (w) => w._id.toString() === user._id.toString()
  );

  return (
    <motion.div
      className="container mx-auto p-0 py-4 md:px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6"
      >
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

          <Button variant={"outline"} size={"sm"}>
            {task?.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row gap-4"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2 w-[70%]">
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-lg p-6 shadow-sm mb-6"
          >
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
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <TaskStatusSelector taskId={task._id} status={task.status} />
                <Button
                  className={"hidden md:block"}
                  size={"sm"}
                  variant={"destructive"}
                >
                  Delete Task
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-bold mb-2">Description</h3>
              <div className="p-3 rounded-lg border bg-blue-200/30">
                <TaskDescription
                  description={task.description || ""}
                  taskId={task._id}
                />
              </div>
            </div>

            <TaskAssigneesSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members}
            />
            <TaskPrioritySelector priority={task.priority} taskId={task._id} />
            <SubTaskDetails subTasks={task?.subtasks || []} taskId={task._id} />

          </motion.div>
            <CommentSection taskId={task._id} members={project.members || []} />
        </motion.div>

        <motion.div variants={itemVariants} className="w-[30%] space-y-4">
          <Watchers watchers={task?.watchers || []} />
          <TaskActivity resourceId={task._id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TaskDetails;
