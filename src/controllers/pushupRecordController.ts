import type { Request, Response } from "express";
import prisma from "../prisma/client.js";  

/**
 * @desc Get all pushup records for the logged-in user
 * @route GET /api/pushups
 * @access Private
 */
export const getAllPushupRecords = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;  
    const records = await prisma.pushupRecord.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({message: "Failed to get pushup records", error});
  }
}

/**
 * @desc Get a single pushup record by ID
 * @route GET /api/pushups/:id
 * @access Private
 */
export const getPushupRecordById = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const record = await prisma.pushupRecord.findFirst({
      where: {id, userId},
    });

    if(!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);    
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch record", error });
  }
};

/**
 * @desc Create a new pushup record
 * @route POST /api/pushups
 * @access Private
 */
export const createPushupRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { count } = req.body;

    if (!count || isNaN(count)) {
      return res.status(400).json({ message: "Count is required and must be a number" });
    }

    const newRecord = await prisma.pushupRecord.create({
      data: {
        pushupCount: Number(count),
        userId,
      },
    });

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Failed to create pushup record", error });
  }
};

/**
 * @desc Update an existing pushup record
 * @route PUT /api/pushups/:id
 * @access Private
 */
export const updatePushupRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const { pushupCount } = req.body;

    const existing = await prisma.pushupRecord.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Record not found" });
    }

    const updated = await prisma.pushupRecord.update({
      where: { id },
      data: {
        ...(pushupCount !== undefined ? { pushupCount: Number(pushupCount) } : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update pushup record" });
  }
};


/**
 * @desc Delete a pushup record
 * @route DELETE /api/pushups/:id
 * @access Private
 */
export const deletePushupRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const existing = await prisma.pushupRecord.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Record not found" });
    }

    await prisma.pushupRecord.delete({ where: { id } });
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete pushup record", error });
  }
};