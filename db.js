const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const DB_STR = process.env.DB_STR_LOCAL;
    // const DB_STR = process.env.DB_STR_CLOUD.replace(
    //   "<PASSWORD>",
    //   process.env.DB_PASS
    // );
    const connectionInstance = await mongoose.connect(DB_STR);

    console.log(
      `MongoDB Connected to Host: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports = { connectDB };
