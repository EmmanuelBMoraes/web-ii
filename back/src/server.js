require("dotenv").config();
const logger = require("./config/logger");

const app = require("./app");
const PORT = process.env.PORT || 3000;
const dbConnect = require("./config/db");

dbConnect();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
