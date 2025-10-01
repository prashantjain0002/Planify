import { useAuth } from "@/lib/provider/authContext";
import React from "react";
import { Button } from "../ui/button";
import { Bell, PlusCircle, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import WorkspaceAvatar from "../workspace/WorkspaceAvatar";
import { useWorkspace } from "@/lib/provider/workspaceContext";
import { useTheme } from "@/lib/provider/ThemeContext";

const Header = ({ onCreateWorkspace }) => {
  const { user, logout } = useAuth();
  const { workspaces } = useLoaderData();
  const navigate = useNavigate();
  const isOnWorkspacePage = useLocation().pathname.includes("/workspace");
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspace();

  const { theme, toggleTheme } = useTheme();

  const handleOnClick = (workspace) => {
    setSelectedWorkspace(workspace);
    if (isOnWorkspacePage) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      navigate(`${window.location.pathname}?workspaceId=${workspace._id}`);
    }
  };

  return (
    <div className="bg-background sticky top-0 z-40 border-b shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Workspace Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors"
            >
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium truncate max-w-[150px]">
                    {selectedWorkspace.name}
                  </span>
                </>
              ) : (
                <span className="font-medium">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-[200px]">
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws._id}
                onClick={() => handleOnClick(ws)}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                {ws.color && (
                  <WorkspaceAvatar color={ws.color} name={ws.name} />
                )}
                <span className="truncate">{ws.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onCreateWorkspace}
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-green-500" />
              <span>Create Workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="hover:bg-gray-100 transition-colors"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-500" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-gray-300 transition-all">
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
                <Link to="/user/profile" className="hover:text-blue-600">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Header;
