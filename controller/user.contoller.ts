import { Request, Response } from "express";

const User = require("../models/users.model");
const { createJWTToken } = require("../middleware/authMiddleware");

const signUp = async (req: Request, res: Response) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirm_password: req.body.confirm_password,
    role: req.body.role,
  });
  console.log(newUser);
  const token = createJWTToken(newUser._id, newUser.name);

  res.status(200).json({
    token,
    message: "Success",
  });
};

const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new Error("Email or password not entered");
  const getUser = await User.findOne({ email }).select("_id name password");
  if (!getUser)
    throw new Error("User associated with the email does not exist");
  console.log(getUser);
  if (!(await getUser.correctPassword(password, getUser.password)))
    throw new Error("User Credentials do not mathc");

  const token = createJWTToken(getUser._id, getUser.name);
  res.status(200).json({
    token,
    message: "Success",
  });
};

module.exports = { signUp, logIn };
