
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/jobs", jobRoutes);

app.listen(process.env.PORT, () =>
  console.log("Backend running on port", process.env.PORT)
);
