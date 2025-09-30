import Loader from "@/components/Loader";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteProject,
  useProjectQuery,
  useUpdateProject,
} from "@/hooks/useProject";
import { getProjectProgress } from "@/lib";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  TagIcon,
  Trash2,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { useGetWorkspaceQuery } from "@/hooks/useWorkspace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EditProjectDialog from "@/components/project/EditProjectDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProjectDetails = () => {
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilters, setTaskFilters] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { projectId, workspaceId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProjectQuery(projectId);
  const { data: workspace } = useGetWorkspaceQuery(workspaceId);

  const { mutate: deleteProject, isLoading: isDeleting } = useDeleteProject(
    () => navigate(`/workspace/${workspaceId}`)
  );
  const { mutate: updateProject, isLoading: isUpdating } = useUpdateProject();

  if (isLoading) return <Loader />;

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId) => {
    navigate(`/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  };

  const handleDeleteProject = () => {
    deleteProject(
      { workspaceId, projectId },
      {
        onSuccess: () => {
          toast.success("Project deleted successfully");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: (error) => {
          const errorMessage = error?.message;
          toast.error(errorMessage);
        },
      }
    );
    setDeleteOpen(false);
  };

  const handleEditProject = (values) => {
    updateProject(
      {
        workspaceId,
        projectId,
        projectData: {
          ...values,
          tags: values.tags || [],
        },
      },
      {
        onSuccess: () => {
          toast.success("Project updated successfully");
        },
        onError: (error) => {
          const errorMessage = error?.message;
          toast.error(errorMessage);
        },
      }
    );
    setEditOpen(false);
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
        className="md:flex-row md:items-center justify-between gap-4"
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
          <div className="flex items-center gap-3 mt-4 justify-between">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditOpen(true);
                }}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Edit
              </Button>
              <Button onClick={() => setIsCreateTask(true)} size={"sm"}>
                Add Task
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div>
            {project.description && (
              <p className="text-gray-500 text-sm mt-2">
                {project.description}
              </p>
            )}

            <ProjectProgress projectProgress={projectProgress} />

            <ProjectMeta project={project} />

            <ProjectTags tags={project?.tags} />
          </div>
        </div>
      </motion.div>

      {/* Tabs & Tasks */}
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

      {/* Delete Project Card */}
      <motion.div
        className="shadow-lg rounded-3xl p-8 space-y-6 border mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-red-600">Danger Zone</h2>
        </div>

        <p className="text-gray-700 text-sm">
          Deleting your project is permanent and cannot be undone.
        </p>

        <Button
          variant="destructive"
          className="py-3 font-medium transition-transform"
          onClick={() => setDeleteOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Project"}
        </Button>

        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this project? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId}
        projectMembers={workspace?.workspace?.members}
      />

      <EditProjectDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        project={project}
        onSubmit={handleEditProject}
        isLoading={isUpdating}
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

const metaItems = (project) => {
  const creator = project.members?.find(
    (member) => member.user._id === project.createdBy
  )?.user;

  return [
    {
      label: "Created By",
      value: creator?.name || "Unknown",
      icon: User,
      color: "from-blue-500/20 to-blue-500/10",
      accent: "bg-blue-500 text-white",
    },
    {
      label: "Created At",
      value: format(new Date(project.createdAt), "MMM d, yyyy"),
      icon: Calendar,
      color: "from-green-500/20 to-green-500/10",
      accent: "bg-green-500 text-white",
    },
    project.dueDate && {
      label: "Due Date",
      value: format(new Date(project.dueDate), "MMM d, yyyy"),
      icon: Calendar,
      color: "from-orange-500/20 to-orange-500/10",
      accent: "bg-orange-500 text-white",
    },
  ].filter(Boolean);
};

export function ProjectMeta({ project }) {
  const items = metaItems(project);

  return (
    <motion.div
      className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.03, y: -3 }}
          className={`relative flex items-center gap-5 overflow-hidden rounded-2xl p-5 backdrop-blur-md bg-gradient-to-br ${item.color} shadow-lg hover:shadow-2xl transition-all`}
        >
          {/* LEFT SIDE (Icon) */}
          <div className="flex-shrink-0">
            <motion.div
              className={`relative w-14 h-14 flex items-center justify-center rounded-full ${item.accent} shadow-lg`}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <item.icon className="w-6 h-6" />
            </motion.div>
          </div>

          {/* RIGHT SIDE (Label + Value) */}
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-gray-900">{item.label}</h3>
            {Array.isArray(item.value) ? (
              <div className="flex flex-wrap gap-2">
                {item.value.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 text-sm">{item.value}</p>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export const ProjectProgress = ({ projectProgress }) => {
  const progressColor =
    projectProgress < 40
      ? "bg-red-500"
      : projectProgress <= 70
        ? "bg-orange-500"
        : "bg-green-500";
  return (
    <motion.div
      className="relative rounded-xl p-4 shadow-md w-full max-w-6xl mx-auto border-2 my-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">Project Progress</h4>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {projectProgress}%
        </motion.span>
      </div>

      <div
        className={`relative w-full h-4 rounded-xl overflow-hidden bg-gray-200 `}
      >
        <motion.div
          className={`h-4 rounded-xl shadow-md ${progressColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${projectProgress}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export const ProjectTags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-6 justify-center">
      {tags.map((tag, index) => (
        <motion.div
          key={tag}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          whileHover={{ scale: 1.1, y: -2 }}
        >
          <Badge className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer shadow-md bg-[#2b079a] text-white">
            <TagIcon className="h-4 w-4 mr-1" /> {tag}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};
