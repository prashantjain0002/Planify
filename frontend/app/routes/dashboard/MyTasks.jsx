import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/useTask";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  Clock,
  FilterIcon,
  FolderKanban,
  Inbox,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState(initialFilter);
  const [sortDirection, setSortDirection] = useState(
    initialSort === "asc" ? "asc" : "desc"
  );
  const [search, setSearch] = useState(initialSearch);

  const { data, isLoading } = useGetMyTasksQuery();

  // Sync URL params with state
  useEffect(() => {
    const params = {};
    searchParams.forEach((value, key) => (params[key] = value));
    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;
    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection)
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  // Filter tasks
  const filteredTasks =
    data?.length > 0
      ? data
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "in-progress") return task.status === "In Progress";
            if (filter === "done") return task.status === "Done";
            if (filter === "archived") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";
            return true;
          })
          .filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description?.toLowerCase().includes(search.toLowerCase())
          )
      : [];

  // Sort tasks by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    }
    return 0;
  });

  if (isLoading) return <Loader />;

  // Framer Motion variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        variants={cardVariants}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Tasks
        </h1>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <Button
            variant="outline"
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? "Oldest First" : "Newest First"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="w-4 h-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("todo")}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("done")}>
                Done
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("archived")}>
                Archived
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("high")}>
                High Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={cardVariants}>
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-lg"
        />
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mb-4">
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Tasks
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground dark:text-gray-400">
                {sortedTasks.length} tasks assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border rounded-lg overflow-hidden">
                {sortedTasks.map((task) => (
                  <motion.div
                    key={task._id}
                    className="p-4 hover:bg-accent/40 dark:hover:bg-gray-700 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    variants={cardVariants}
                  >
                    {/* Left Section */}
                    <div className="flex items-start gap-3">
                      {task.status === "Done" ? (
                        <CheckCircle className="size-6 text-green-500 mt-1" />
                      ) : (
                        <Clock className="size-6 text-yellow-500 mt-1" />
                      )}
                      <div>
                        <Link
                          to={`/workspace/${task.project[0].workspace}/projects/${task.project[0]._id}/tasks/${task._id}`}
                          className="font-medium text-base hover:text-blue-500 hover:underline transition-colors flex items-center gap-1 dark:text-gray-100"
                        >
                          {task.title} <ArrowRight className="size-4" />
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge
                            variant={
                              task.status === "Done"
                                ? "done"
                                : task.status === "To Do"
                                  ? "todo"
                                  : "inProgress"
                            }
                          >
                            {task.status}
                          </Badge>
                          {task.priority && (
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "high"
                                  : task.priority === "Medium"
                                    ? "medium"
                                    : "low"
                              }
                            >
                              {task.priority}
                            </Badge>
                          )}
                          {task.isArchived && (
                            <Badge variant="archived">Archived</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-start md:items-end gap-2 text-sm">
                      {task.status === "Done" ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                          <CheckCircle className="size-4" />
                          <span className="font-medium">Completed</span>
                        </div>
                      ) : (
                        task.dueDate && (
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 text-sm font-medium ${
                              new Date(task.dueDate) < new Date()
                                ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                                : new Date(task.dueDate).toDateString() ===
                                    new Date().toDateString()
                                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                                  : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            }`}
                          >
                            <CalendarDays className="size-4" />
                            <span>
                              Due - {format(new Date(task.dueDate), "PPPP")}
                            </span>
                          </div>
                        )
                      )}

                      {task.project?.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm w-fit">
                          <FolderKanban className="size-4" />
                          <span>{task.project[0]?.title}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs w-fit">
                        <Clock className="size-4" />
                        <span>
                          Modified On -{" "}
                          {format(new Date(task.updatedAt), "PPPP")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {sortedTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500">
                    <Inbox className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-500" />
                    <h2 className="text-lg font-semibold">No tasks found</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Try adjusting your filters or adding a new task.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grid View */}
        <TabsContent value="grid" className="mb-4">
          {sortedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 dark:text-gray-500">
              <Inbox className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-500" />
              <h2 className="text-lg font-semibold">No tasks found</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Try adjusting your filters or adding a new task.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {sortedTasks.map((task) => (
                <motion.div
                  key={task._id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl border-l-4 shadow-md overflow-hidden"
                  style={{
                    borderColor:
                      task.status === "Done"
                        ? "#10b981"
                        : task.status === "In Progress"
                          ? "#f59e0b"
                          : "#3b82f6",
                  }}
                >
                  <CardHeader className="px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      {task.status === "Done" ? (
                        <CheckCircle className="size-5 text-green-500" />
                      ) : (
                        <Clock className="size-5 text-yellow-500" />
                      )}
                      <Link
                        to={`/workspace/${task.project[0].workspace}/projects/${task.project[0]._id}/tasks/${task._id}`}
                        className="font-semibold text-base hover:text-blue-500 hover:underline transition-colors dark:text-gray-100"
                      >
                        {task.title}
                      </Link>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 space-y-2">
                    <motion.div className="flex flex-wrap items-center gap-2 justify-center">
                      <Badge
                        variant={
                          task.status === "Done"
                            ? "done"
                            : task.status === "To Do"
                              ? "todo"
                              : "inProgress"
                        }
                      >
                        {task.status}
                      </Badge>
                      {task.priority && (
                        <Badge
                          variant={
                            task.priority === "High"
                              ? "high"
                              : task.priority === "Medium"
                                ? "medium"
                                : "low"
                          }
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.isArchived && (
                        <Badge variant="archived">Archived</Badge>
                      )}
                    </motion.div>

                    {task.dueDate && task.status !== "Done" && (
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 justify-center text-center ${
                          new Date(task.dueDate) < new Date()
                            ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                            : new Date(task.dueDate).toDateString() ===
                                new Date().toDateString()
                              ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400"
                              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                        }`}
                      >
                        <CalendarDays className="size-4" />
                        <span>
                          Due - {format(new Date(task.dueDate), "PPPP")}
                        </span>
                      </div>
                    )}

                    {task.project?.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm w-fit mx-auto">
                        <FolderKanban className="size-4" />
                        <span>{task.project[0]?.title}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs w-fit mx-auto text-center">
                      <Clock className="size-4" />
                      <span>
                         {format(new Date(task.updatedAt), "PPPP")}
                      </span>
                    </div>
                  </CardContent>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MyTasks;
