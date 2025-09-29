import Loader from "@/components/Loader";
import { useNavigate, useSearchParams } from "react-router";
import { useGetArchivedTasksQuery } from "@/hooks/useTask";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/provider/authContext";
import { useWorkspace } from "@/lib/provider/workspaceContext";
import { ArchiveRestore, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusColors = {
  "In Progress": "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-gray-100 text-gray-800",
};

const ArchivedTasks = () => {
  const [searchParams] = useSearchParams();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?._id || searchParams.get("workspaceId");
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useGetArchivedTasksQuery(workspaceId);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading) return <Loader />;
  if (!data)
    return (
      <div className="text-center text-muted-foreground mt-12">
        No workspace found
      </div>
    );

  const { workspace, tasks } = data;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  // Slice tasks for current page
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const member = workspace?.members?.find((m) => m.user._id === user._id);
  const canUnarchive = member && ["owner", "admin"].includes(member.role);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Archived Tasks</h1>
        {canUnarchive && (
          <p className="text-sm text-muted-foreground">
            You can view and navigate to tasks
          </p>
        )}
      </div>

      {/* Table */}
      <motion.div
        className="overflow-x-auto rounded-2xl border shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Table className="min-w-full">
          <TableHeader className="bg-muted/50">
            <TableRow>
              {["Title", "Description", "Status", "Project", "Due Date"].map(
                (header) => (
                  <TableHead key={header} className="text-center">
                    {header}
                  </TableHead>
                )
              )}
              {canUnarchive && (
                <TableHead className="text-center">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No archived tasks found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTasks.map((task, index) => (
                <motion.tr
                  key={task._id}
                  className={`transition-all hover:bg-muted/20 ${
                    index % 2 === 0 ? "bg-muted/5" : ""
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <TableCell className="text-center font-medium">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-center max-w-xs truncate text-muted-foreground">
                    {task.description || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[task.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {task.project[0]?.title || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  {canUnarchive && (
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 justify-center"
                        onClick={() =>
                          navigate(
                            `/workspace/${workspace._id}/projects/${task.project._id}/tasks/${task._id}`
                          )
                        }
                      >
                        <ArchiveRestore className="h-4 w-4" />
                        Go to Task
                      </Button>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination Controls */}
      {tasks.length > itemsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default ArchivedTasks;
