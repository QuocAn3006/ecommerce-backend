const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParse = require("body-parser");
const cookieParse = require("cookie-parser");

const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParse.json());
app.use(cookieParse());

routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("connect to DB success");
  })
  .catch(err => {
    console.log(err);
  });
app.listen(port, () => {
  console.log("server is running in port: ", port);
});
