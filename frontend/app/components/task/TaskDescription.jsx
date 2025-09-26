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
    <div className="flex items-start gap-2 w-full">
      {isEditing ? (
        <>
          <Textarea
            className="flex-1 min-h-[3rem] resize-none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={isPending}
          />
          <Button
            className="my-auto self-start flex-shrink-0"
            size="sm"
            onClick={updateDescription}
            disabled={isPending}
          >
            {isPending ? <Loader /> : "Save"}
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 text-sm text-pretty break-words">
            {description}
          </div>
          <div className="flex-shrink-0">
            <Edit
              className="size-5 cursor-pointer text-blue-500 hover:text-blue-600"
              onClick={() => setIsEditing(true)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TaskDescription;
