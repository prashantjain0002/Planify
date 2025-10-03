import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import Workspace from "../models/workspace.model.js";
import Comment from "./../models/comment.model.js";
import User from './../models/user.model.js';

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project creator can create tasks" });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
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

    const newComment = await Comment.create({
      text,
      task: taskId,
      author: req.user._id,
    });

    task.comments.push(newComment._id);
    await task.save();

    await recordActivity(req.user._id, "added_comment", "Task", taskId, {
      description: `Added comment ${
        text.substring(0, 50) + (text.length > 50 ? "..." : "")
      }`,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const watchTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
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

    const isWatching = task.watchers.includes(req.user._id);
    if (!isWatching) {
      task.watchers.push(req.user._id);
    } else {
      task.watchers = task.watchers.filter(
        (watcher) => watcher.toString() !== req.user._id.toString()
      );
    }

    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `${
        isWatching ? "Stopped watching" : "Started watching"
      } task ${task.title}`,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const archiveTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
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

    const Archived = task.isArchived;
    task.isArchived = !Archived;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `${Archived ? "Unarchived" : "Archived"} task ${task.title}`,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unarchiveTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate({
      path: "project",
      select: "title workspace",
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const workspace = await Workspace.findById(task.project.workspace);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member || !["owner", "admin"].includes(member.role)) {
      return res.status(403).json({ message: "Not authorized to unarchive" });
    }

    task.isArchived = false;
    await task.save();

    res.status(200).json({ message: "Task unarchived successfully", task });
  } catch (error) {
    console.error("Unarchive error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignees", "name profilePicture")
      .populate("watchers", "name profilePicture");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project).populate(
      "members.user",
      "name profilePicture email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getActivityByResourceId = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const activity = await ActivityLog.find({ resourseId: resourceId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommentByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });
    if (!comments) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyTasks = async (req, res) => {
  try {

    const tasks = await Task.find({ assignees: { $in: [req.user._id] } })
      .populate("project", "title workspace")
      .sort({ createdAt: -1 });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getMyTasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArchivedTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const tasks = await Task.find({
      project: { $in: workspace.projects },
      isArchived: true,
    }).populate("project", "title");

    res.status(200).json({ workspace, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskTitle = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project creator can update task title" });
    }

    const oldTitle = task.title;
    task.title = title;
    await task.save();

    if (typeof recordActivity === "function") {
      await recordActivity(req.user._id, "updated_task", "Task", taskId, {
        description: `Updated task title from "${oldTitle}" to "${title}"`,
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the project creator can update task description",
      });
    }

    const oldDescription =
      task.description?.substring(0, 50) +
      (task.description?.length > 50 ? "..." : "");

    task.description = description;
    await task.save();

    const newDescription =
      description?.substring(0, 50) + (description?.length > 50 ? "..." : "");

    if (typeof recordActivity === "function") {
      await recordActivity(req.user._id, "updated_task", "Task", taskId, {
        description: `Updated task description from "${oldDescription}" to "${newDescription}"`,
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this workspace" });
    }

    const oldStatus = task.status;

    task.status = status;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      description: `Updated task status from ${oldStatus} to ${status}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the project creator can update task assignees",
      });
    }

    const oldAssigneesIds = task.assignees || [];
    const newAssigneesIds = assignees || [];

    const oldUsers = await User.find({ _id: { $in: oldAssigneesIds } });
    const oldAssigneesNames = oldUsers.map((u) => u.name);

    const newUsers = await User.find({ _id: { $in: newAssigneesIds } });
    const newAssigneesNames = newUsers.map((u) => u.name);

    task.assignees = newAssigneesIds;
    await task.save();

    if (typeof recordActivity === "function") {
      await recordActivity(req.user._id, "updated_task", "Task", taskId, {
        description: `Updated task assignees from [${oldAssigneesNames.join(
          ", "
        )}] to [${newAssigneesNames.join(", ")}]`,
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project creator can update task priority" });
    }

    const oldPriority = task.priority;

    task.priority = priority;
    await task.save();

    if (typeof recordActivity === "function") {
      await recordActivity(req.user._id, "updated_task", "Task", taskId, {
        description: `Updated task priority from ${oldPriority} to ${priority}`,
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the project creator can delete tasks" });
    }

    project.tasks = project.tasks.filter((id) => id.toString() !== taskId);
    await project.save();

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
