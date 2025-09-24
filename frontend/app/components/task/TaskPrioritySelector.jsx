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

const TaskPrioritySelector = ({ taskId, priority }) => {
  const { mutate, isPending } = useUpdateTaskPriorityMutatuion();
  const handlePriorityChange = (value) => {
    mutate(
      { taskId, priority: value },
      {
        onSuccess: () => {
          toast.success("Task priority updated successfully");
        },
        onError: (error) => {
          console.log(error);
          const errorMessage = error?.message;
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Select
      value={priority || ""}
      onValueChange={handlePriorityChange}
      diabled={isPending}
    >
      <SelectTrigger className={"w-[180px]"}>
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
