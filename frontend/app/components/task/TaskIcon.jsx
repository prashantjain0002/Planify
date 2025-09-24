import {
  CheckSquare,
  Pencil,
  CheckCircle2,
  ListPlus,
  ListChecks,
  FolderPlus,
  FolderCog,
  FolderCheck,
  Building2,
  Building,
  Users,
  UserPlus,
  UserMinus,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import React from "react";

export const getActivityIcon = (action) => {
  switch (action) {
    case "created_task":
      return (
        <div className="bg-green-600/10 p-2 rounded-md">
          <CheckSquare className="h-5 w-5 text-green-600 rounded-fu" />
        </div>
      );

    case "updated_task":
      return (
        <div className="bg-blue-600/10 p-2 rounded-md">
          <Pencil className="h-5 w-5 text-blue-600" />
        </div>
      );

    case "completed_task":
      return (
        <div className="bg-emerald-600/10 p-2 rounded-md">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        </div>
      );

    case "created_subtask":
      return (
        <div className="bg-indigo-600/10 p-2 rounded-md">
          <ListPlus className="h-5 w-5 text-indigo-600" />
        </div>
      );

    case "updated_subtask":
      return (
        <div className="bg-cyan-600/10 p-2 rounded-md">
          <ListChecks className="h-5 w-5 text-cyan-600" />
        </div>
      );

    case "created_project":
      return (
        <div className="bg-purple-600/10 p-2 rounded-md">
          <FolderPlus className="h-5 w-5 text-purple-600" />
        </div>
      );

    case "updated_project":
      return (
        <div className="bg-yellow-600/10 p-2 rounded-md">
          <FolderCog className="h-5 w-5 text-yellow-600" />
        </div>
      );

    case "completed_project":
      return (
        <div className="bg-teal-600/10 p-2 rounded-md">
          <FolderCheck className="h-5 w-5 text-teal-600" />
        </div>
      );

    case "created_workspace":
      return (
        <div className="bg-pink-600/10 p-2 rounded-md">
          <Building2 className="h-5 w-5 text-pink-600" />
        </div>
      );

    case "updated_workspace":
      return (
        <div className="bg-orange-600/10 p-2 rounded-md">
          <Building className="h-5 w-5 text-orange-600" />
        </div>
      );

    case "joined_workspace":
      return (
        <div className="bg-sky-600/10 p-2 rounded-md">
          <Users className="h-5 w-5 text-sky-600" />
        </div>
      );

    case "transfered_workspace_ownership":
      return (
        <div className="bg-rose-600/10 p-2 rounded-md">
          <UserPlus className="h-5 w-5 text-rose-600" />
        </div>
      );

    case "added_member":
      return (
        <div className="bg-lime-600/10 p-2 rounded-md">
          <UserPlus className="h-5 w-5 text-lime-600" />
        </div>
      );

    case "removed_member":
      return (
        <div className="bg-red-600/10 p-2 rounded-md">
          <UserMinus className="h-5 w-5 text-red-600" />
        </div>
      );

    case "added_comment":
      return (
        <div className="bg-gray-600/10 p-2 rounded-md">
          <MessageSquare className="h-5 w-5 text-gray-600" />
        </div>
      );

    case "added_attachment":
      return (
        <div className="bg-violet-600/10 p-2 rounded-md">
          <Paperclip className="h-5 w-5 text-violet-600" />
        </div>
      );

    default:
      return (
        <div className="bg-muted p-2 rounded-md">
          <CheckSquare className="h-5 w-5 text-muted-foreground" />
        </div>
      );
  }
};
