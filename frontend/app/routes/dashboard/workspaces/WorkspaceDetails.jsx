import Loader from "@/components/Loader";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import ProjectList from "@/components/workspace/ProjectList";
import WorkSpaceHeader from "@/components/workspace/WorkSpaceHeader";
import { useGetWorkspaceQuery } from "@/hooks/useWorkspace";
import React, { useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import InviteMemberDialog from "@/components/workspace/InviteMemberDialog";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.15, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WorkspaceDetails = () => {
  const { workspaceId } = useParams();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) return <div>No Workspace found</div>;

  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspaceId);

  if (isLoading) return <Loader />;

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <WorkSpaceHeader
          workspace={workspace.workspace}
          members={workspace?.workspace?.members}
          onCreateProject={() => setIsCreateProject(true)}
          onInviteMember={() => setIsInviteMember(true)}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ProjectList
          workspaceId={workspaceId}
          projects={workspace?.projects}
          onCreateProject={() => setIsCreateProject(true)}
        />
      </motion.div>

      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={workspace?.workspace?.members}
      />

      <InviteMemberDialog
        isOpen={isInviteMember}
        onOpenChange={setIsInviteMember}
        workspaceId={workspaceId}
      />
    </motion.div>
  );
};

export default WorkspaceDetails;
