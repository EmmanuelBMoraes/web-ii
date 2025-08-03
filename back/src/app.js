const express = require("express");
const cors = require("cors");

const app = express();
const router = require("./routes/router");

app.use(cors());
app.use(express.json());
app.use("/api", router);

module.exports = app;
