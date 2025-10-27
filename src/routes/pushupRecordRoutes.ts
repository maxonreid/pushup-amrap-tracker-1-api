import { Router } from "express";
import {
  getAllPushupRecords,
  getPushupRecordById,
  createPushupRecord,
  updatePushupRecord,
  deletePushupRecord,
} from "../controllers/pushupRecordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// All routes below require authentication
router.use(protect);

router.get("/", getAllPushupRecords);

router.get("/:id", getPushupRecordById);

router.post("/", createPushupRecord);

router.put("/:id", updatePushupRecord);

router.delete("/:id", deletePushupRecord);

export default router;