import React from "react";
import NoDataFound from "../NoDataFound";
import ProjectCard from "../project/ProjectCard";

const ProjectList = ({ workspaceId, projects, onCreateProject }) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Projects</h3>

      <div className="grid grid-6 sm:grid-cols-2 md:grid-cols-3">
        {projects.length === 0 ? (
          <NoDataFound
            title={"No project found"}
            description={"Create a project to get started"}
            buttonText={"Create Project"}
            buttonAction={onCreateProject}
          />
        ) : (
          projects.map((project) => {
            const projectProgress = 0;

            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={projectProgress}
                workspaceId={workspaceId}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectList;
