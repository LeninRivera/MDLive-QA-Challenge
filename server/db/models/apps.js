const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const appsSchema = new Schema({
  id: Number,
  name: String,
});

const Apps = mongoose.model("Apps", appsSchema);

module.exports = Apps;
