const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const config = require('./config');
const dlRoutes = require("./routes/dlRoutes");
const userRoutes = require("./routes/userRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

const app = express();


mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DLS is connected to database!");
  })
  .catch((error) => {
    console.log("Connection failed!", error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/dl", dlRoutes); 
app.use("/api/user", userRoutes); 
app.use("/api/bookmark", bookmarkRoutes); 


module.exports = app;
