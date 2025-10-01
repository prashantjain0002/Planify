import React from "react";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";
// import SubTaskDetails from "@/components/task/SubTaskDetails";
import TaskActivity from "@/components/task/TaskActivity";
import TaskAssigneesSelector from "@/components/task/TaskAssigneesSelector";
import TaskDescription from "@/components/task/TaskDescription";
import TaskPrioritySelector from "@/components/task/TaskPrioritySelector";
import TaskStatusSelector from "@/components/task/TaskStatusSelector";
import TaskTitle from "@/components/task/TaskTitle";
import Watchers from "@/components/task/Watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useArchiveTask,
  useDeleteTask,
  useTaskByIdQuery,
  useWatchTask,
} from "@/hooks/useTask";
import { useAuth } from "@/lib/provider/authContext";
import { formatDistanceToNow } from "date-fns";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import CommentSection from "@/components/task/CommentSection";
import { toast } from "sonner";
import {
  useGetWorkspaceDetailsQuery,
  useGetWorkspaceQuery,
} from "@/hooks/useWorkspace";

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
  const { taskId, workspaceId, projectId } = useParams();
  const navigate = useNavigate();

  const { data: taskData, isLoading } = useTaskByIdQuery(taskId);
  const { data: workspaceDetails, isLoading: isWorkspaceLoading } =
    useGetWorkspaceDetailsQuery(workspaceId);

  const { mutate: watchTask, isPending: isWatching } = useWatchTask();
  const { mutate: archiveTask, isPending: isArchiving } = useArchiveTask();
  const { mutate: deleteTask, isLoading: isDeleting } = useDeleteTask();

  if (isLoading || isWorkspaceLoading) return <Loader />;

  if (!taskData)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Task not found
        </h1>
      </div>
    );

  const { task, project } = taskData;
  const workspaceMembers = workspaceDetails?.members || [];
  const projectMembers = project?.members || [];

  const allMembers = [...workspaceMembers, ...projectMembers].reduce(
    (acc, member) => {
      const exists = acc.find(
        (m) => m.user._id === (member.user?._id || member.user)
      );
      if (!exists) acc.push(member);
      return acc;
    },
    []
  );

  const isUserWatching = task?.watchers?.some((w) => w._id === user._id);

  const isProjectCreator =
    project?.createdBy.toString() === user._id.toString();

  const handleWatchTask = () =>
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => toast.success("Task Watched"),
        onError: (e) => toast.error(e?.message || "Failed"),
      }
    );

  const handleArchiveTask = () =>
    archiveTask(
      { taskId: task._id },
      {
        onSuccess: () =>
          toast.success(task.isArchived ? "Task Unarchived" : "Task Archived"),
        onError: (e) => toast.error(e?.message || "Failed"),
      }
    );

  const handleDelete = () => {
    deleteTask(
      { projectId, taskId },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          navigate(`/workspace/${workspaceId}/projects/${projectId}`);
        },
        onError: (e) => toast.error(e?.response?.data?.message || "Failed"),
      }
    );
  };

  return (
    <motion.div
      className="container mx-auto p-0 py-4 md:px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
            className="p-4 mr-4"
          >
            ← Back
          </Button>
          <h1 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
            {task.title}
          </h1>
          {task.isArchived && (
            <Badge className="ml-2" variant="destructive">
              Archived
            </Badge>
          )}
        </div>

        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <Button
            variant={isUserWatching ? "destructive" : "outline"}
            size="sm"
            onClick={handleWatchTask}
            disabled={isWatching}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="w-4 h-4" /> Unwatch
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Watch
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleArchiveTask}
            disabled={isArchiving}
          >
            {task.isArchived ? "Unarchive" : "Archive"}
          </Button>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row gap-4"
      >
        {/* Left Column */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 w-full lg:w-[70%]"
        >
          <motion.div
            variants={itemVariants}
            className="bg-card dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between items-start mb-4 gap-4">
              <div className="flex-1 min-w-0">
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

                {/* Edit title only for project creator */}
                {isProjectCreator ? (
                  <TaskTitle title={task.title} taskId={task._id} />
                ) : (
                  <h2 className="font-semibold text-lg">{task.title}</h2>
                )}

                <div className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  Created{" "}
                  {formatDistanceToNow(new Date(task.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                <TaskStatusSelector taskId={task._id} status={task.status} />

                {/* Delete Task button only for project creator */}
                {isProjectCreator && (
                  <Button
                    className="hidden md:block"
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-1" />{" "}
                        Deleting...
                      </>
                    ) : (
                      "Delete Task"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-gray-100">
                Description
              </h3>
              <div className="p-3 rounded-lg border bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                {isProjectCreator ? (
                  <TaskDescription
                    description={task.description || ""}
                    taskId={task._id}
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-200">
                    {task.description || "No description"}
                  </p>
                )}
              </div>
            </div>

            {/* Only project creator can edit assignees, priority, and subtasks */}

            <>
              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={allMembers}
                isProjectCreator={isProjectCreator}
              />
              <TaskPrioritySelector
                priority={task.priority}
                taskId={task._id}
                isProjectCreator={isProjectCreator}
              />
              {/* <SubTaskDetails
                subTasks={task?.subtasks || []}
                taskId={task._id}
                isProjectCreator={isProjectCreator}
              /> */}
            </>
          </motion.div>

          <CommentSection taskId={task._id} members={allMembers} />
        </motion.div>

        {/* Right Column */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[30%] space-y-4"
        >
          <Watchers watchers={task?.watchers || []} />
          <TaskActivity resourceId={task._id} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TaskDetails;
