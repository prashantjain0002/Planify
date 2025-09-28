import React from "react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

const ProjectCard = ({project, progress, workspaceId}) => {

  console.log(project);
  
  

  return (
    <Link to={`/workspace/${workspaceId}/projects/${project?._id}`}>
      <Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project?.title}</CardTitle>
            <span
              className={cn(
                "text-xs rounded-full px-2 py-1",
                getTaskStatusColor(project?.status)
              )}
            >
              {project?.status}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className={"line-clamp-2"}>
            {project?.description || "Description not found"}
          </CardDescription>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs mt-2">
                <span>Progress</span>
                <span>{progress} %</span>
              </div>

              <Progress value={progress} className={"h-2"} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm gap-2 text-muted-foreground">
                <span>{project?.tasks.length || 0}</span>
                <span>Tasks</span>
              </div>

              {project?.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="size-4 mr-1" />
                  <span>{format(project?.dueDate, "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
