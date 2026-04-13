const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path"); //newly added to handle file paths

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" })); // newly added to handle larger payloads
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //nw added to serve uploaded files

// routes
app.use("/api", require("./routes/locationRoutes"));
app.use("/api/auth", require("./routes/Auth"));

module.exports = app;
