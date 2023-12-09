const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const connectDataBase = () => {
  mongoose.connect(process.env.mongoDB).then((data) => {
    console.log(`MongoDB Connected With Server ${data.connection.host}`);
  });
};

module.exports = connectDataBase;
