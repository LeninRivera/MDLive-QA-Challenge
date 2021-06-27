require("./db/config");
const express = require("express"),
  app = express(),
  appsRoute = require("./routes/apps");

//Parse incoming JSON into objects
app.use(express.json());

app.use("/apps", appsRoute);

//todo delete before final commit
app.get("/test", (req, res) => {
  console.log("test point is working");
  res.status(200).send("Test point is working");
});

module.exports = app;
