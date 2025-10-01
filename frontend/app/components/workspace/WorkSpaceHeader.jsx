import React from "react";
import WorkspaceAvatar from "./WorkspaceAvatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const WorkSpaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex md:items-center gap-3">
            {workspace.color && (
              <WorkspaceAvatar
                color={workspace.color}
                name={workspace.name}
                className={"w-12 h-12"}
              />
            )}

            <h2 className="text-2xl font-semibold">{workspace.name}</h2>
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-start mb-4 md:mb-0">
            <Button variant={"outline"} onClick={onInviteMember}>
              <UserPlus className="size-4" /> Invite
            </Button>

            <Button onClick={onCreateProject}>
              <Plus className="size-4" /> Create Project
            </Button>
          </div>
        </div>

        {workspace.description && (
          <p className="text-muted-foreground text-sm md:text-base text-justify">
            {workspace.description}
          </p>
        )}
      </div>

      {members.length > 0 && (
        <div className="flex items-center">
          <p className="font-semibold text-muted-foreground mr-3">Members</p>

          <div className="flex -space-x-3">
            {members.map((member) => (
              <div key={member._id} className="relative group">
                <Avatar className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm hover:scale-110 transition-transform duration-200">
                  <AvatarImage
                    src={member.user?.profilePicture}
                    alt={member.user?.name}
                  />
                  <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {member.user?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Tooltip */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-xs rounded-md bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {member.user?.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSpaceHeader;
