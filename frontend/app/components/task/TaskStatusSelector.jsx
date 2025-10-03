import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskStatusMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";

const TaskStatusSelector = ({ taskId, status }) => {
  const { mutate, isPending } = useUpdateTaskStatusMutatuion();
  const handleStatusChange = (value) => {
    mutate(
      { taskId, status: value },
      {
        onSuccess: () => {
          toast.success("Task status updated successfully");
        },
        onError: (error) => {
          const errorMessage = error?.message;
          console.log(error);
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Select value={status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className={"w-[180px]"}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TaskStatusSelector;
