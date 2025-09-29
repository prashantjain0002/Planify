import Loader from "@/components/Loader";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectQuery } from "@/hooks/useProject";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useGetWorkspaceQuery } from "@/hooks/useWorkspace";

const ProjectDetails = () => {
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const { projectId, workspaceId } = useParams();

  const { data, isLoading } = useProjectQuery(projectId);
  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetWorkspaceQuery(workspaceId);

  const navigate = useNavigate();

  if (isLoading) return <Loader />;

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId) => {
    navigate(`/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <Button
            onClick={() => navigate(-1)}
            variant={"outline"}
            size={"sm"}
            className={"p-4 me-4"}
          >
            ← Back
          </Button>

          <div className="flex items-center gap-3 mt-4">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>

          {project.description && (
            <p className="text-gray-500 text-sm">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress} %
            </span>
          </div>

          <Button
            onClick={() => setIsCreateTask(true)}
            className="transition-transform hover:scale-105"
          >
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all" className={"w-full"}>
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TabsList>
            {["all", "todo", "in-progress", "done"].map((val) => (
              <TabsTrigger
                key={val}
                value={val}
                onClick={() =>
                  setTaskFilters(
                    val === "all"
                      ? "All"
                      : val === "todo"
                        ? "To Do"
                        : val === "in-progress"
                          ? "In Progress"
                          : "Done"
                  )
                }
              >
                {val.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center text-sm">
            <span className="text-muted-foreground mr-2">Status</span>
            <div className="flex flex-row gap-2">
              <Badge className="bg-background" variant={"outline"}>
                {tasks.filter((task) => task.status === "To Do").length} To Do
              </Badge>
              <Badge className="bg-background" variant={"outline"}>
                {tasks.filter((task) => task.status === "In Progress").length}{" "}
                In Progress
              </Badge>
              <Badge className="bg-background" variant={"outline"}>
                {tasks.filter((task) => task.status === "Done").length} Done
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Task Columns */}
        {["all", "todo", "in-progress", "done"].map((tab) => (
          <TabsContent key={tab} value={tab} className={"m-0"}>
            <motion.div
              className={
                tab === "all"
                  ? "grid grid-cols-3 gap-4"
                  : "grid md:grid-cols-1 gap-4"
              }
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((t) => t.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth={tab !== "all"}
              />
              {tab === "all" && (
                <>
                  <TaskColumn
                    title="In Progress"
                    tasks={tasks.filter((t) => t.status === "In Progress")}
                    onTaskClick={handleTaskClick}
                  />
                  <TaskColumn
                    title="Done"
                    tasks={tasks.filter((t) => t.status === "Done")}
                    onTaskClick={handleTaskClick}
                  />
                </>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={workspace?.workspace?.members}
      />
    </motion.div>
  );
};

export default ProjectDetails;

// Task Column
const TaskColumn = ({ title, tasks, onTaskClick, isFullWidth = false }) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-3",
          !isFullWidth ? "h-full" : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h1 className="font-medium">{title}</h1>
            <Badge variant={"outline"}>{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-1 flex flex-col",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <TaskCard task={task} onClick={() => onTaskClick(task._id)} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Task Card
const TaskCard = ({ task, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge
            className={
              task.priority === "High"
                ? "bg-red-500"
                : task.priority === "Medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }
          >
            {task.priority}
          </Badge>

          <div className="flex gap-1">
            {task.status !== "To Do" && (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                title="Mark as To Do"
              >
                <AlertCircle className="size-4" />
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                title="Mark as In Progress"
              >
                <Clock className="size-4" />
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                title="Mark as Done"
              >
                <CheckCircle className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-medium">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees?.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                    title={member.name}
                  >
                    <AvatarImage
                      src={member.profilePicture || ""}
                      alt={member.name}
                    />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
            {task.assignees?.length > 5 && (
              <span className="text-xs text-muted-foreground">
                + {task.assignees.length - 5}
              </span>
            )}
          </div>

          {task.dueDate && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="size-4 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>

        {task.subtasks?.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {task.subtasks.filter((s) => s.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
