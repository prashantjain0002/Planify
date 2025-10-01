import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { useUpdateTaskAssigneesMutatuion } from "@/hooks/useTask";
import { toast } from "sonner";

const TaskAssigneesSelector = ({ task, assignees, projectMembers }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { mutate, isPending } = useUpdateTaskAssigneesMutatuion();

  const normalizedMembers = projectMembers.map((m) => {
    if (m.user) {
      return {
        _id: m.user._id,
        name: m.user.name,
        profilePicture: m.user.profilePicture,
      };
    }
    return m;
  });

  useEffect(() => {
    setSelectedIds(assignees.map((a) => a._id || a.user?._id));
  }, [assignees]);

  const handleSelectAll = () =>
    setSelectedIds(normalizedMembers.map((m) => m._id));
  const handleUnSelectAll = () => setSelectedIds([]);
  const handleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSaveAssignees = () => {
    mutate(
      { taskId: task._id, assignees: selectedIds },
      {
        onSuccess: () => {
          setDropDownOpen(false);
          toast.success("Assignees updated");
        },
        onError: (e) => {
          console.error(e);
          toast.error(e?.message || "Failed");
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
        Assignees
      </h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            Unassigned
          </span>
        ) : (
          normalizedMembers
            .filter((m) => selectedIds.includes(m._id))
            .map((m) => (
              <div
                key={m._id}
                className="flex items-center gap-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg px-3 py-1 shadow-sm hover:shadow-md transition-shadow cursor-no-drop"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={m.profilePicture} />
                  <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {m.name}
                </span>
              </div>
            ))
        )}
      </div>

      <div className="relative">
        <button
          className="text-sm w-full border rounded px-3 py-2 text-left bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 font-semibold text-green-500 dark:text-green-400"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          {selectedIds.length === 0
            ? "Select Assignees"
            : `${selectedIds.length} Selected`}
        </button>

        {dropDownOpen && (
          <div className="absolute top-full w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded z-10 mt-1 shadow-lg max-h-60 overflow-y-auto">
            <div className="flex justify-between px-2 py-1 border-b border-gray-200 dark:border-gray-600">
              <button
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-500"
                onClick={handleSelectAll}
              >
                Select all
              </button>
              <button
                className="text-xs text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-500"
                onClick={handleUnSelectAll}
              >
                Unselect all
              </button>
            </div>

            {normalizedMembers.map((m) => (
              <label
                key={m._id}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Checkbox
                  checked={selectedIds.includes(m._id)}
                  onCheckedChange={() => handleSelect(m._id)}
                  className="mr-2"
                />
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={m.profilePicture} />
                  <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-gray-900 dark:text-gray-100">
                  {m.name}
                </span>
              </label>
            ))}

            <div className="flex justify-between px-2 py-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDropDownOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAssignees}
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
