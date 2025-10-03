import React, { createContext, useContext, useState, useEffect } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  
  useEffect(() => {
    const saved = localStorage.getItem("selectedWorkspace");
    if (saved) {
      setSelectedWorkspace(JSON.parse(saved));
    }
  }, []);

  
  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem(
        "selectedWorkspace",
        JSON.stringify(selectedWorkspace)
      );
    }
  }, [selectedWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{ selectedWorkspace, setSelectedWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
