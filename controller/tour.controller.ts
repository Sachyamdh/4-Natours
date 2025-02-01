import { Response, Request } from "express";

const Tours = require("@models/tours.model");

const getAllTours = async (req: Request, res: Response) => {
  const allTours = Tours.findALl();
  if (!allTours) throw new Error("There are no tours available at the moment");

  res.status(200).json({ message: "Success", tours: allTours });
};

const getTourById = async (req: Request, res: Response) => {
  const { id } = req?.params;
  const singleTour = Tours.findOne({ id });
  if (!singleTour)
    throw new Error("There are no tours available at the moment");

  res.status(200).json({ message: "Success", tour: singleTour });
};

const createTour = async (req: Request, res: Response) => {
  const newTour = await Tours.create(req.body).select("-_id");

  res.status(200).json({ status: "Success", tour: newTour });
};

const deleteTour = async (req: Request, res: Response) => {
  const { id } = req?.params;
  await Tours.findByIdAndDelete({ id });
  res
    .status(200)
    .json({ status: "Success", message: "Tour Deleted Successfully" });
};

module.exports = { getAllTours, getTourById, createTour, deleteTour };
