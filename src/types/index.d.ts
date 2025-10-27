import "express";
import "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; email: string };
  }
}

declare module "jsonwebtoken" {
  interface JwtPayload {
    id: number;
  }
}
