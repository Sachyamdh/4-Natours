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
const authRoutes = require("./routes/user.routes");

const app = express();

process.env.ENVIRONMENT === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello from the server side!");
});

//sending a bad response when there is no associated routes
app.all("*", async (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `No asscosiated routes Can't find the ${req.url}` });
});
module.exports = app;
