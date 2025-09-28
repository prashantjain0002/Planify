// src/lib/provider/workspaceContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedWorkspace");
    if (saved) {
      setSelectedWorkspace(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem("selectedWorkspace", JSON.stringify(selectedWorkspace));
    }
  }, [selectedWorkspace]);

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, setSelectedWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
