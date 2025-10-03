import Workspace from "./../models/workspace.model.js";
import Project from "./../models/project.model.js";
import Task from "./../models/task.model.js";

export const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this workspace" });
    }

    const tagArray = Array.isArray(tags) ? tags : tags ? tags.split(",") : [];
    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      members,
      workspace: workspaceId,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.workspace.toString() !== workspaceId) {
      return res.status(400).json({ message: "Invalid workspace for project" });
    }

    const isCreator = project.createdBy.toString() === req.user._id.toString();
    if (!isCreator) {
      return res
        .status(403)
        .json({ message: "Only the project creator can update this project" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (Array.isArray(tags)) project.tags = tags;
    if (Array.isArray(members)) project.members = members;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (status !== undefined) project.status = status;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate("members.user");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    const tasks = await Task.find({ project: projectId, isArchived: false })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ project, tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.workspace.toString() !== workspaceId) {
      return res.status(400).json({ message: "Invalid workspace for project" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project creator can delete this project" });
    }

    await Task.deleteMany({ project: projectId });

    workspace.projects = workspace.projects.filter(
      (id) => id.toString() !== projectId
    );
    await workspace.save();

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
