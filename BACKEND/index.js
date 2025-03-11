const express = require("express");
const mongoose = require("mongoose");

//Patient Manager
const router = require("./Routes/UserRoutes");

const app = express();
//Middleware
app.use(express.json());

//Patient Manager
app.use("/users", router);

mongoose
  .connect("mongodb+srv://admin:YAze8rs9t0QLCyGJ@cluster0.mgnkv.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
