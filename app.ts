import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      requestTime?: string;
    }
  }
}

const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();

process.env.ENVIRONMENT === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello from the server side!");
});

module.exports = app;
