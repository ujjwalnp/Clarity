require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes")

const { connectDB } = require("./utils/db");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res, next) => res.send("Hello World!"));

app.use("/api", router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})