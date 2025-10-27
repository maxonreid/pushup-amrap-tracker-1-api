import prisma from "../prisma/client.js";

/**
 * Create a new pushup record for a user
 */
export const createPushupRecordService = async (userId: number, pushupCount: number) => {
  return prisma.pushupRecord.create({
    data: {
      pushupCount,
      userId,
    },
  });
};

/**
 * Get all pushup records for a user, newest first
 */
export const getAllPushupRecordsService = async (userId: number) => {
  return prisma.pushupRecord.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

/**
 * Get a single pushup record by ID (only if it belongs to the user)
 */
export const getPushupRecordByIdService = async (userId: number, recordId: number) => {
  return prisma.pushupRecord.findFirst({
    where: { id: recordId, userId },
  });
};

/**
 * Delete a pushup record (only if it belongs to the user)
 * Returns the number of deleted records (0 or 1)
 */
export const deletePushupRecordService = async (userId: number, recordId: number) => {
  return prisma.pushupRecord.deleteMany({
    where: { id: recordId, userId },
  });
};

/**
 * Update a pushup record (optional, if you want edit functionality)
 */
export const updatePushupRecordService = async (
  userId: number,
  recordId: number,
  pushupCount: number
) => {
  return prisma.pushupRecord.updateMany({
    where: { id: recordId, userId },
    data: { pushupCount },
  });
};
