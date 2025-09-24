import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAddSubTask, useUpdateSubTaskMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";

const SubTaskDetails = ({ subTasks, taskId }) => {
  const [newSubTask, setNewSubTask] = useState("");

  const { mutate: addSubTask, isPending } = useAddSubTask();
  const { mutate: updateSubTask, isPending: isUpdating } =
    useUpdateSubTaskMutatuion();

  const handleAddSubTask = () => {
    addSubTask(
      { taskId, title: newSubTask },
      {
        onSuccess: () => {
          setNewSubTask("");
          toast.success("Sub task added successfully");
        },
        onError: (error) => {
          const errorMessage = error?.message;
          console.log(error);
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleUpdateTask = (subTaskId, checked) => {
    updateSubTask(
      { taskId, subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success("Sub task updated successfully");
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
    <div className="my-6">
      <h3 className="text-sm font-medium mb-0">Sub Tasks</h3>

      <div className="space-y-2 mb-4">
        {subTasks.length > 0 ? (
          <div className="space-y-1 mt-1">
            {subTasks.map((subTask) => (
              <div key={subTask._id} className="flex items-center space-x-2">
                <Checkbox
                  id={subTask._id}
                  checked={subTask.completed}
                  onCheckedChange={(checked) =>
                    handleUpdateTask(subTask._id, !!checked)
                  }
                  disabled={isPending || isUpdating}
                />

                <label
                  className={cn(
                    "text-sm font-medium",
                    subTask.completed && "line-through text-muted-foreground"
                  )}
                >
                  {subTask.title}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm font-medium text-center">No sub tasks</div>
        )}

        <div className="flex items-center gap-2">
          <Input
            placeholder="Add sub task"
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            className={"mr-1"}
            disabled={isPending || isUpdating}
          />
          <Button onClick={handleAddSubTask} disabled={isPending || isUpdating}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubTaskDetails;
