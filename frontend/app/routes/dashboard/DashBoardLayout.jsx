import Loader from "@/components/Loader";
import { useAuth } from "@/lib/provider/authContext";
import React from "react";
import { Navigate, Outlet } from "react-router";

export function meta({}) {
  return [
    { title: "Dashboard - Planify" },
    { name: "description", content: "Welcome to Planify" },
  ];
}

const DashBoardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Component  */}
      <div className="flex flex-1 flex-col h-full">
        {/* Header  */}
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
