import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskPriorityMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";

const TaskPrioritySelector = ({ taskId, priority, isProjectCreator }) => {
  const { mutate, isPending } = useUpdateTaskPriorityMutatuion();

  const handlePriorityChange = (value) => {
    if (!isProjectCreator) return;

    mutate(
      { taskId, priority: value },
      {
        onSuccess: () => {
          toast.success("Task priority updated successfully");
        },
        onError: (error) => {
          console.error(error);
          const errorMessage = error?.response?.data?.message;
          toast.error(errorMessage || "Failed to update priority");
        },
      }
    );
  };

  return (
    <Select
      value={priority || ""}
      onValueChange={handlePriorityChange}
      disabled={!isProjectCreator || isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Low">Low</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="High">High</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TaskPrioritySelector;
