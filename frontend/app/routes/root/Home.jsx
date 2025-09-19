import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router";

export function meta({}) {
  return [
    { title: "Planify" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const HomePage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-5">
      <Link to="/sign-in">
        <Button className="bg-blue-500 text-white">Log In</Button>
      </Link>
      <Link to="/sign-up">
        <Button className="bg-blue-500 text-white" variant={"outline"}>
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;
