const mongoose = require('mongoose');
const URL = process.env.MONGODB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("connection to DB");

  } catch (error) {
    console.error("not connected");
    process.exit(0);
  }
};
module.exports = connectDB;
