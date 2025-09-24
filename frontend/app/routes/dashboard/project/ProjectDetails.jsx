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

const ProjectDetails = () => {
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const { projectId, workspaceId } = useParams();

  const { data, isLoading } = useProjectQuery(projectId);

  console.log(data);

  const navigate = useNavigate();

  if (isLoading) {
    return <Loader />;
  }

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId) => {
    navigate(`/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className={"w-full"}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilters("All")}>
                All Tasks
              </TabsTrigger>

              <TabsTrigger value="todo" onClick={() => setTaskFilters("To Do")}>
                To Do
              </TabsTrigger>

              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilters("In Progress")}
              >
                In Progress
              </TabsTrigger>

              <TabsTrigger value="done" onClick={() => setTaskFilters("Done")}>
                Done
              </TabsTrigger>
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
          </div>

          <TabsContent value="all" className={"m-0"}>
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className={"m-0"}>
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className={"m-0"}>
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className={"m-0"}>
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={project.members}
      />
    </div>
  );
};

export default ProjectDetails;

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
            "space-y-1 flex flex-col ",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }) => {
  return (
    <Card
      onClick={onClick}
      className={
        "cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1 gap-2 mb-4"
      }
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
                onClick={() => console.log("Mark as To Do")}
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
                onClick={() => console.log("Mark as In Progress")}
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
                onClick={() => console.log("Mark as Done")}
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
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className={
                      "relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                    }
                    title={member.name}
                  >
                    <AvatarImage
                      src={member.profilePicture || ""}
                      alt={member.name}
                    />
                    <AvatarFallback>{member?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}

            {task.assignees && task.assignees.length > 5 && (
              <span className="text-xs text-muted-foreground">
                {" "}
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

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
