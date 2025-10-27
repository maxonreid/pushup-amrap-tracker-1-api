import type { Request, Response } from "express";
import {
  createPushupRecordService,
  getAllPushupRecordsService,
  getPushupRecordByIdService,
  deletePushupRecordService,
  updatePushupRecordService,
} from "../services/pushupRecordService.js";


/**
 * @desc    Create a new pushup record
 * @route   POST /api/pushups
 * @access  Private
 */
export const createPushupRecord = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const { pushupCount } = req.body;
  if (typeof pushupCount !== "number" || pushupCount <= 0) {
    return res.status(400).json({ message: "pushupCount must be a positive number" });
  }

  try {
    const record = await createPushupRecordService(req.user.id, pushupCount);
    res.status(201).json(record);
  } catch (error) {
    console.error("Create Pushup Record Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// @desc    Get all pushup records for the logged-in user
// @route   GET /api/pushups
// @access  Private
export const getAllPushupRecords = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  try {
    const records = await getPushupRecordsService(req.user.id);
    res.json(records);
  } catch (error) {
    console.error("Get Pushup Records Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Get a single pushup record by ID
 * @route   GET /api/pushups/:id
 * @access  Private 
 */
export const getPushupRecordById = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const recordId = parseInt(req.params.id, 10);

  try {
    const record = await getPushupRecordByIdService(req.user.id, recordId);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    console.error("Get Pushup Record Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Delete a pushup record
 * @route   DELETE /api/pushups/:id
 * @access  Private 
 */
export const deletePushupRecord = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const recordId = parseInt(req.params.id, 10);

  try {
    const result = await deletePushupRecordService(req.user.id, recordId);
    if (result.count === 0) {
      return res.status(404).json({ message: "Record not found or not owned by user" });
    }
    res.json({ message: "Record deleted" });
  } catch (error) {
    console.error("Delete Pushup Record Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Update a pushup record
 * @route   PUT /api/pushups/:id
 * @access  Private 
 */
export const updatePushupRecord = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  const recordId = parseInt(req.params.id, 10);
  const { pushupCount } = req.body;

  if (typeof pushupCount !== "number" || pushupCount <= 0) {
    return res.status(400).json({ message: "pushupCount must be a positive number" });
  }

  try {
    const result = await updatePushupRecordService(req.user.id, recordId, pushupCount);
    if (result.count === 0) {
      return res.status(404).json({ message: "Record not found or not owned by user" });
    }
    res.json({ message: "Record updated" });
  } catch (error) {
    console.error("Update Pushup Record Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
