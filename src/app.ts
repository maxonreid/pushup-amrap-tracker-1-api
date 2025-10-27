import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pushupRecordRoutes from "./routes/pushupRecordRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/records", pushupRecordRoutes);

export default app;