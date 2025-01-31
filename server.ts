import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });
const app = require("./app");
const { connectToMongoDB: dbConnect } = require("./utils/configs/db");

const port = process.env.PORT || 3000;

dbConnect();
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
