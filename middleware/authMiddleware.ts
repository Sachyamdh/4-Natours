import { NextFunction, Request, Response } from "express";

const jwt = require("jsonwebtoken");

const createJWTToken = (id: string, name: string) => {
  if (!process.env.JWT_EXPIRES && !process.env.JWT_SECRET)
    throw new Error("JWT environment variables not found");
  return jwt.sign({ id: id, name: name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// const restrictTo

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers;
};

module.exports = { createJWTToken };
