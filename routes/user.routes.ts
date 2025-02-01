const express = require("express");
const { signUp, logIn } = require("../controller/user.contoller");
const Router = express.Router();
const { tryCatch } = require("../utils/tryCatch");

Router.route("/signup").post(tryCatch(signUp));
Router.route("/login").post(tryCatch(logIn));

module.exports = Router;
