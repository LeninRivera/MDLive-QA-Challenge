const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const myAppsSchema = new Schema({
  id: Number,
  name: String,
});

const MyApps = mongoose.model("MyApps", myAppsSchema);

module.exports = MyApps;
