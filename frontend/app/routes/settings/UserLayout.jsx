import React from "react";
import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div className="container max-w-3xl mx-auto py-8 md:py-12">
      <Outlet />
    </div>
  );
};

export default UserLayout;
