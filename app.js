const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connectToMongoDB = require("./services/dbConnect");
const tsunRoute = require("./routes/tsun");

connectToMongoDB();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));

// Routes
app.use("/v1", tsunRoute);

app.listen(8000, () => {
  console.log("Server is running");
});
