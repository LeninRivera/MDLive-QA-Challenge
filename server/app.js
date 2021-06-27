require("./db/config");
const express = require("express"),
  app = express(),
  appsRoute = require("./routes/myApps");

//Parse incoming JSON into objects
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set();
app.set("view engine", "ejs");

app.use("/apps", appsRoute);

app.get("/", (req, res) => {
  res.status(200).render("home");
});

module.exports = app;
