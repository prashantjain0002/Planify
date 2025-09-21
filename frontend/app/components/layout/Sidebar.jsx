import { useAuth } from "@/lib/provider/authContext";
import { cn } from "@/lib/utils";
import {
  Award,
  ChevronRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  User,
  Users,
  Wrench,
} from "lucide-react";
import React, { useState } from "react";
import { href, Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./sidebarNav";

const Sidebar = ({ currentWorkspace }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: User,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Members",
      href: "/members",
      icon: Users,
    },
    {
      title: "Archived",
      href: "/archived",
      icon: Award,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16 md:w-[80px]" : "w-16 md:w-[240px]"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 mb-4">
        <Link to="/dashboard" className="flex items-center">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Wrench className="size-6 text-blue-500" />
              <span className="font-semibold text-lg hidden md:block">
                Planify
              </span>
            </div>
          )}

          {isCollapsed && <Wrench className="size-6 text-blue-500" />}
        </Link>

        <Button
          variant={"ghost"}
          size={"icon"}
          className={"ml-auto md:block flex justify-center"}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronRight className="rotate-180 size-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          currentWorkspace={currentWorkspace}
          className={isCollapsed && "items-center space-y-2"}
        />
      </ScrollArea>
      <div>
        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
        >
          <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
