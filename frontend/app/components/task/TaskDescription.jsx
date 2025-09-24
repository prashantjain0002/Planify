import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskDescriptionMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";
import Loader from "../Loader";
import { Textarea } from "../ui/textarea";

const TaskDescription = ({ description, taskId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);

  const { mutate, isPending } = useUpdateTaskDescriptionMutatuion();

  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Task description updated successfully");
        },
        onError: (error) => {
          const errorMessage = error?.message || "something went wrong";
          console.log(error);
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <Textarea
          className={"w-full min-w-3xl"}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <div className="text-sm flex-1 text-pretty">
          {description}
        </div>
      )}

      {isEditing ? (
        <Button
          className={"py-0"}
          size={"sm"}
          onClick={updateDescription}
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

export default TaskDescription;
