import Loader from "@/components/Loader";
import NoDataFound from "@/components/NoDataFound";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateWorkspace from "@/components/workspace/CreateWorkspace";
import WorkspaceAvatar from "@/components/workspace/WorkspaceAvatar";
import { useGetWorkspacesQuery } from "@/hooks/useWorkspace";
import { PlusCircle, Users } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { truncateDescription } from "@/lib/utils";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery();

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title={"No workspace found"}
              description={"Create a new workspace to get started"}
              buttonText={"Create Workspace"}
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = (e) => {
    e.preventDefault();
    setShowFullDescription((prev) => !prev);
  };

  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-md hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <WorkspaceAvatar
                name={workspace.name}
                color={workspace.color}
                className="w-12 h-12"
              />

              <div className="mt-1">
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground font-semibold">
                  Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs font-semibold">
                {workspace.members.length}
              </span>
            </div>
          </div>

          <CardDescription className="text-sm font-semibold text-justify">
            {showFullDescription
              ? workspace.description || "No description provided"
              : truncateDescription(workspace.description, 195)}
            {workspace.description?.length > 195 && (
              <Link
                onClick={handleToggleDescription}
                className="ml-1 text-blue-500 hover:underline text-xs cursor-pointer"
              >
                {showFullDescription ? "Show less" : "...more"}
              </Link>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default Workspaces;
