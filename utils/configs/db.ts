const mongoose = require("mongoose");

if (!process.env.DATABASE_PASSWORD || !process.env.DATABASE_URL)
  throw new Error("Environment variables not set");

const databaseUrl = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(databaseUrl, {

    });
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
  }
};
module.exports = { connectToMongoDB };
