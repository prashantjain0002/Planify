import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Loader from "@/components/Loader";
import CreateWorkspace from "@/components/workspace/CreateWorkspace";
import { getData } from "@/lib/fetchUtil";
import { useAuth } from "@/lib/provider/authContext";
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router";

export function meta({}) {
  return [
    { title: "Dashboard - Planify" },
    { name: "description", content: "Welcome to Planify" },
  ];
}

export const clientLoader = async () => {
  try {
    const [workspaceData] = await Promise.all([getData("/workspace")]);
    return { workspaces: workspaceData };
  } catch (error) {
    console.log(error);
    return { workspaces: [] };
  }
};

const DashBoardLayout = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const { isAuthenticated, isLoading } = useAuth();

  const handleWorkspaceSelected = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  return (
    <div className="flex h-screen w-full">
      <Sidebar currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashBoardLayout;
