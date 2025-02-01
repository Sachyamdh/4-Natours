import { NextFunction, Request, Response } from "express";

type ControllerFunctionType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;
exports.tryCatch =
  (controller: ControllerFunctionType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        res.status(404).json({ status: "failed", message: err.message });
      } else {
        res
          .status(404)
          .json({ status: "failed", message: "An unknown error occurred" });
      }
    }
  };
