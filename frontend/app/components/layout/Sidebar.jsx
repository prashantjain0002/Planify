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
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import SidebarNav from "./SidebarNav";

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
      {/* Logo / Header */}
      <div className="flex h-14 items-center border-b px-4 mb-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Wrench className="size-6 text-blue-500" />
          {!isCollapsed && (
            <span className="font-semibold text-lg text-blue-500 hidden md:block">
              Planify
            </span>
          )}
        </Link>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto flex justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "size-4 transition-transform duration-300",
              isCollapsed && "rotate-0",
              !isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          currentWorkspace={currentWorkspace}
          className={cn(isCollapsed && "items-center space-y-2")}
        />
      </ScrollArea>

      {/* Logout Button */}
      <div className="mx-3 mb-2">
        <Button
          size={isCollapsed ? "icon" : "default"}
          onClick={logout}
          className={cn(
            "w-full transition-colors duration-200",
            "bg-red-500 hover:bg-red-600",
            "flex items-center justify-center gap-2"
          )}
        >
          <LogOut className="size-4" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
