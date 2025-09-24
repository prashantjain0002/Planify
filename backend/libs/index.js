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
  } catch (error) {
    console.log(error);
  }
};
