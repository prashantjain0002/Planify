import React from "react";

const WorkspaceAvatar = ({ color, name }) => {
  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <p className="text-xs font-medium text-white">
        {name.charAt(0).toUpperCase()}
      </p>
    </div>
  );
};

export default WorkspaceAvatar;
