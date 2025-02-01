import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const { connectToMongoDB: dbConnect } = require("./utils/configs/db");
dbConnect();
const app = require("./app");
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
