import Workspace from "./../models/workspace.model.js";

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
    res.status(500).json({ message: "something went wrong" });
  }
};
