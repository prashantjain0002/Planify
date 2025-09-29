import Workspace from "./../models/workspace.model.js";
import Project from "./../models/project.model.js";
import User from "../models/user.model.js";
import WorkspaceInvite from "../models/wrokspaceInvite.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../libs/sendEmail.js";
import { recordActivity } from "./../libs/index.js";
import mongoose from "mongoose";
import Task from './../models/task.model.js';
import Comment from './../models/comment.model.js';
import ActivityLog from "../models/activity.model.js";

export const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner", joinedAt: Date.now() }],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: "You are not authorized to invite members to this workspace",
      });
    }

    const existingMember = await User.findOne({ email });
    if (!existingMember) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === existingMember._id.toString()
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this workspace" });
    }

    const isInvited = await WorkspaceInvite.findOne({
      user: existingMember._id,
      workspaceId,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res
        .status(400)
        .json({ message: "User is already invited to this workspace" });
    }

    if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.deleteOne({ _id: isInvited._id });
    }

    const inviteToken = jwt.sign(
      {
        user: existingMember._id,
        workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await WorkspaceInvite.create({
      user: existingMember._id,
      workspaceId,
      token: inviteToken,
      role: role || "member",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Send email
    const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

    const emailResult = await sendEmail(
      existingMember.email,
      "Invitation to join workspace",
      "views/workspaceInvitation.ejs",
      {
        name: existingMember.name,
        invitationLink,
        workspaceName: workspace.name,
      }
    );

    if (!emailResult.success) {
      return res.status(201).json({
        message:
          "User invited successfully, but failed to send invitation email.",
        emailError: emailResult.error,
      });
    }

    res.status(200).json({ message: "User invited successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const acceptInviteToken = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user, workspaceId, role } = decoded;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString()
    );
    if (isMember) {
      return res
        .status(403)
        .json({ message: "User already a member of this workspace" });
    }

    const inviteInfo = await WorkspaceInvite.findOne({
      user: user,
      workspaceId: workspaceId,
    });
    if (!inviteInfo) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invite expired" });
    }

    workspace.members.push({
      user: user,
      role: role || [],
      joinedAt: Date.now(),
    });
    await workspace.save();

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
        description: `Joined ${workspace.name} workspace`,
      }),
    ]);

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is already a member
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );
    if (isMember) {
      return res
        .status(403)
        .json({ message: "User already a member of this workspace" });
    }

    // Add user to workspace
    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });
    await workspace.save();

    // ✅ Add user to all projects inside this workspace
    await Project.updateMany(
      { workspace: workspaceId },
      {
        $addToSet: {
          members: {
            user: req.user._id,
            role: "member",
            joinedAt: new Date(),
          },
        },
      }
    );

    // Log activity
    await recordActivity(
      req.user._id,
      "joined_workspace",
      "Workspace",
      workspaceId,
      {
        description: `Joined ${workspace.name} workspace`,
      }
    );

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log("Error in acceptGenerateInvite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const updates = req.body;

    // Optional: whitelist fields that can be updated
    const allowedUpdates = ["name", "description", "color", "members"];
    const filteredUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Find workspace and update
    const workspace = await Workspace.findOneAndUpdate(
      { _id: workspaceId },
      { $set: filteredUpdates },
      { new: true }
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.json(workspace);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating workspace", error: err.message });
  }
};

export const transferWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwnerEmail } = req.body;

    const newOwner = await User.findOne({ email: newOwnerEmail });
    if (!newOwner) {
      return res.status(404).json({ message: "New owner not found" });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { owner: newOwner._id },
      { new: true }
    );

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }

    return res.json({ message: "Ownership transferred", workspace });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error transferring workspace", error: err.message });
  }
};

export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // members: { $in: [req.user._id] },
    })
      // .populate("tasks", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

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

    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchived priority"
        )
        .sort({ createdAt: -1 }),
    ]);

    const totalProjectsInProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;
    const totalProjectsCompleted = projects.filter(
      (project) => project.status === "Completed"
    ).length;

    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);
    const totalTaskCompleted = projects.reduce((acc, project) => {
      return acc + project.tasks.filter((task) => task.status === "Completed");
    }, 0);
    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);
    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks);

    const upcomingTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    const taskTrendsData = [
      { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
    ];

    const today = new Date();

    const last7DaysTasks = Array.from({ length: 7 }, (_, index) => {
      const d = new Date(today);
      d.setDate(today.getDate() - index);
      return d;
    }).reverse();

    for (const project of projects) {
      for (const task of project.tasks) {
        const taskDate = new Date(task.updatedAt);
        const dayInDate = last7DaysTasks.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear()
        );

        if (dayInDate !== -1) {
          const dayName = last7DaysTasks[dayInDate].toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          );
          const dayData = taskTrendsData.find((day) => day.name === dayName);
          if (dayData) {
            switch (task.status) {
              case "Done":
                dayData.completed++;
                break;
              case "In Progress":
                dayData.inProgress++;
                break;
              case "To Do":
                dayData.toDo++;
                break;
            }
          }
        }
      }
    }

    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#f59e0b" },
      { name: "Planning", value: 0, color: "#ef4444" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;
        case "In Progress":
          projectStatusData[1].value++;
          break;
        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }

    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const project of projects) {
      for (const task of project.tasks) {
        switch (task.priority) {
          case "High":
            taskPriorityData[0].value++;
            break;
          case "Medium":
            taskPriorityData[1].value++;
            break;
          case "Low":
            taskPriorityData[2].value++;
            break;
        }
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTask = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );

      const completedTask = projectTask.filter(
        (task) => task.status === "Done" && task.isArchived === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTask.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectsInProgress,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWorkspace = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { workspaceId } = req.params;

    // Find and delete the workspace
    const workspace = await Workspace.findOneAndDelete(
      { _id: workspaceId },
      { session }
    );

    if (!workspace) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Find all projects in this workspace
    const projects = await Project.find({ workspace: workspaceId }, null, {
      session,
    });

    // Collect all task IDs under these projects
    const taskIds = await Task.find(
      { project: { $in: projects.map((p) => p._id) } },
      "_id",
      { session }
    ).then((tasks) => tasks.map((t) => t._id));

    // Delete tasks
    await Task.deleteMany({ _id: { $in: taskIds } }, { session });

    // Delete comments associated with tasks
    await Comment.deleteMany({ task: { $in: taskIds } }, { session });

    // Delete projects
    await Project.deleteMany({ workspace: workspaceId }, { session });

    // Delete activity logs for workspace, projects, tasks, comments
    await ActivityLog.deleteMany(
      {
        $or: [
          { resourseType: "Workspace", resourseId: workspaceId },
          {
            resourseType: "Project",
            resourseId: { $in: projects.map((p) => p._id) },
          },
          { resourseType: "Task", resourseId: { $in: taskIds } },
          { resourseType: "Comment", resourseId: { $in: taskIds } }, 
        ],
      },
      { session }
    );

    // Delete workspace invites
    await WorkspaceInvite.deleteMany({ workspaceId }, { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.json({ message: "Workspace and all associated data deleted" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Error deleting workspace", error: err.message });
  }
};
