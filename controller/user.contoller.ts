import { Request, Response } from "express";

const User = require("../models/users.model");
const { createJWTToken } = require("../middleware/authMiddleware");
const crypto = require("crypto");

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

  //throwing error if the email and password field is empty
  if (!email || !password) throw new Error("Email or password not entered");

  //getting the user from the cluster
  const getUser = await User.findOne({ email }).select("_id name password");
  if (!getUser)
    throw new Error("User associated with the email does not exist");

  //comparing the user password
  if (!(await getUser.correctPassword(password, getUser.password)))
    throw new Error("User Credentials do not match");

  const token = createJWTToken(getUser._id, getUser.name);
  res.status(200).json({
    token,
    message: "Success",
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  const email = req?.body.email;
  const checkUser = User.findOne({ email }).select("email");
  if (!checkUser) throw new Error("No user associated with the email");
  
};

module.exports = { signUp, logIn };
