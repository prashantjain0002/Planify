import { useAuth } from "@/lib/provider/authContext";
import React from "react";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import WorkspaceAvatar from "../workspace/WorkspaceAvatar";

const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}) => {
  const { user, logout } = useAuth();

  const { workspaces } = useLoaderData();

  const navigate = useNavigate();

  const isOnWorkspacePage = useLocation().pathname.includes("/workspace");

  const handleOnClick = (workspace) => {
    onWorkspaceSelected(workspace);
    const location = window.location;
    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      const basePath = location.pathname;
      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}

                  <span className="font-medium">{selectedWorkspace?.name}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">Select Workspace</span>
                </>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel className={"text-center"}>
              Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.map((ws) => {
                return (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => handleOnClick(ws)}
                  >
                    {ws.color && (
                      <WorkspaceAvatar color={ws.color} name={ws.name} />
                    )}
                    <span className="ml-1">{ws.name}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onCreateWorkspace}>
                <PlusCircle className="w-4 h-4" />
                <span className="ml-1">Create Workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage
                  src={user?.profilePicture || ""}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <AvatarFallback className="bg-black text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
