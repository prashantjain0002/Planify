import React from "react";
import { cn } from "@/lib/utils";

const WorkspaceAvatar = ({ color, name, className }) => {
  let textSize = "text-xs";
  if (className?.includes("w-12") || className?.includes("h-12")) {
    textSize = "text-2xl";
  } else if (className?.includes("w-16") || className?.includes("h-16")) {
    textSize = "text-4xl";
  }

  return (
    <div
      className={cn(
        "rounded flex items-center justify-center font-medium text-white px-2 py-1",
        className
      )}
      style={{ backgroundColor: color }}
    >
      <span className={textSize}>{name?.charAt(0).toUpperCase()}</span>
    </div>
  );
};

export default WorkspaceAvatar;
