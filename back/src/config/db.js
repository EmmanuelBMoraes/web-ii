const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;
const logger = require("./logger");

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
module.exports = dbConnect;
