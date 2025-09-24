import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useUpdateTaskAssigneesMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";

const TaskAssigneesSelector = ({ task, assignees, projectMembers }) => {
  const [selectedIds, setSelectedIds] = useState(
    assignees.map((assignee) => assignee._id)
  );
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const { mutate, isPending } = useUpdateTaskAssigneesMutatuion();

  const handleSelectAll = () => {
    const allIds = projectMembers.map((m) => m.user._id);
    setSelectedIds(allIds);
  };

  const handleUnSelectAll = () => {
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    let newSelected = [];
    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((sid) => sid !== id);
    } else {
      newSelected = [...selectedIds, id];
    }

    setSelectedIds(newSelected);
  };

  const handleSaveAssignees = () => {
    mutate(
      { taskId: task._id, assignees: selectedIds },
      {
        onSuccess: () => {
          setDropDownOpen(false);
          toast.success("Task assignees updated successfully");
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
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Assignees</h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        ) : (
          projectMembers
            .filter((member) => selectedIds.includes(member.user._id))
            .map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1 shadow-sm hover:shadow-md transition-shadow cursor-no-drop"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={m.user.profilePicture} alt={m.user.name} />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium text-gray-700">
                  {m.user.name}
                </span>
              </div>
            ))
        )}
      </div>

      <div className="relative">
        <button
          className="text-sm w-full border rounded px-3 py-2 text-left bg-white font-semibold text-green-500"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          {selectedIds.length === 0
            ? "Select Assignees"
            : `${selectedIds.length} Selected`}
        </button>

        {dropDownOpen && (
          <div className="absolute top-full w-full bg-white border rounded z-10 mt-1 shadow-lg max-h-60 overflow-y-auto">
            <div className="flex justify-between px-2 py-1 border-b">
              <button
                className="text-xs text-blue-600 cursor-pointer font-semibold hover:text-blue-700"
                onClick={handleSelectAll}
              >
                Select all
              </button>

              <button
                className="text-xs text-red-600 cursor-pointer font-semibold hover:text-red-700"
                onClick={handleUnSelectAll}
              >
                Unselect all
              </button>
            </div>

            {projectMembers.map((m) => (
              <label
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50"
                key={m.user._id}
              >
                <Checkbox
                  checked={selectedIds.includes(m.user._id)}
                  onCheckedChange={() => handleSelect(m.user._id)}
                  className={"mr-2"}
                />

                <Avatar className={"size-6 mr-2"}>
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback>{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <span>{m.user.name}</span>
              </label>
            ))}

            <div className="flex justify-between px-2 py-1">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setDropDownOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button
                size={"sm"}
                onClick={() => handleSaveAssignees()}
                disabled={isPending}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssigneesSelector;
