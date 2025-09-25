import ActivityLog from "../models/activity.model.js";

export const recordActivity = async (
  userId,
  action,
  resourseType,
  resourseId,
  details
) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      resourseType,
      resourseId,
      details,
    });

    // Remove activity older than 1 year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    await ActivityLog.deleteMany({ createdAt: { $lt: oneYearAgo } });
  } catch (error) {
    console.log(error);
  }
};

