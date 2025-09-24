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

  const { mutate, isPending } = useUpdateTaskTitleMutatuion();

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
          console.log(error);
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <Input
          className={"text-xl font-semibold w-full min-w-3xl"}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className="text-xl font-semibold flex-1">{title}</h2>
      )}

      {isEditing ? (
        <Button
          className={"py-0"}
          size={"sm"}
          onClick={updateTitle}
          disabled={isPending}
        >
          {isPending ? <Loader /> : "Save"}
        </Button>
      ) : (
        <Edit
          className="size-5 cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};

export default TaskTitle;
