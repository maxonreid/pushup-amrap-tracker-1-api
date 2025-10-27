import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * Register a new user
 */
export const registerUserService = async (email: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true },
  });

  return {
    id: user.id,
    email: user.email,
    token: generateToken(user.id),
  };
};

/**
 * Login user
 */
export const loginUserService = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    id: user.id,
    email: user.email,
    token: generateToken(user.id),
  };
};

/**
 * Get user profile
 */
export const getUserProfileService = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
