import { cn } from "@/lib/utils";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const SidebarNav = ({ items, isCollapsed, currentWorkspace }) => {
  const navigate = useNavigate();
  return (
    <nav className={cn("flex flex-col gap-y-2")}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href;

        const handleClick = () => {
          if (el.href === "/workspaces") {
            navigate(el.href);
          } else if (currentWorkspace && currentWorkspace._id) {
            navigate(`${el.href}?workspaceId=${currentWorkspace._id}`);
          } else {
            navigate(el.href);
          }
        };

        return (
          <Button
            key={el.href}
            className={cn(
              "justify-start",
              isActive && "bg-blue-700/80 text-white font-medium"
            )}
            onClick={handleClick}
            variant={isActive ? "outline" : "ghost"}
          >
            <Icon className="mr-2 size-4" />
            {isCollapsed ? (
              <span className="sr-only">{el.title}</span>
            ) : (
              el.title
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
