import type { Request, Response } from "express";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";

// Register
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // bcrypt v6: Promise API
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Profile
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({
    id: req.user.id,
    email: req.user.email,
  });
};
