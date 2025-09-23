import Loader from "@/components/Loader";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import ProjectList from "@/components/workspace/ProjectList";
import WorkSpaceHeader from "@/components/workspace/WorkSpaceHeader";
import { useGetWorkspaceQuery } from "@/hooks/useWorkspace";
import React, { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No Workspace found</div>;
  }

  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspaceId);

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // console.log(workspace.workspace);

  return (
    <div>
      <WorkSpaceHeader
        workspace={workspace.workspace}
        members={workspace?.workspace?.members}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

      <ProjectList
        workspaceId={workspaceId}
        projects={workspace?.projects}
        onCreateProject={() => setIsCreateProject(true)}
      />

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={workspace?.workspace?.members}
      />
    </div>
  );
};

export default WorkspaceDetails;
