const MyApps = require("../models/myApps"),
  mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") require("dotenv").config();
require("../config/");

const dbReset = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  console.log(collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
  await MyApps.countDocuments({}, (err, count) => {
    console.log(`number of myApps: ${count}`);
  });
};

const seedDataBase = async () => {
  dbReset();
  for (let i = 1; i < 1000; i++) {
    const myAppNum = i.toString().padStart(3, 0);
    const myApp = new MyApps({
      id: i,
      name: `my-app-${myAppNum}`,
    });
    try {
      await myApp.save();
    } catch (err) {
      console.log(err.message);
    }
  }
  let count = await MyApps.countDocuments({});
  console.log(`number of my-apps seeded ${count}`);
};

seedDataBase();
