const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();
const router = require("./routes/router");

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

module.exports = app;
