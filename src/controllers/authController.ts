import type { Request, Response } from "express";
import {
  registerUserService,
  loginUserService,
  getUserProfileService,
} from "../services/authService.js";


export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await registerUserService(email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginUserService(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const result = await getUserProfileService(req.user.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
