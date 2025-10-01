import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";
import Loader from "../Loader";

const TaskTitle = ({ title, taskId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const { mutate } = useUpdateTaskTitleMutatuion();

  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Task title updated successfully");
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message;
          toast.error(errorMessage || "Something went wrong");
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {isEditing ? (
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <Input
            className="text-xl font-semibold w-full min-w-0 truncate"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button size="sm" onClick={updateTitle}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNewTitle(title); // revert changes
              setIsEditing(false); // exit edit mode
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold flex-1 min-w-0 truncate">
            {title}
          </h2>
          <Edit
            className="size-5 cursor-pointer text-blue-500 hover:text-blue-600"
            onClick={() => setIsEditing(true)}
          />
        </>
      )}
    </div>
  );
};

export default TaskTitle;
