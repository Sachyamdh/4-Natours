const jwt = require("jsonwebtoken");

const createJWTToken = (id: string, name: string) => {
  if (!process.env.JWT_EXPIRES && !process.env.JWT_SECRET)
    throw new Error("JWT environment variables not found");
  return jwt.sign({ id: id, name: name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = { createJWTToken };
