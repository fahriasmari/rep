const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    process.env.DB_CONNECT,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    (err, db) => {
      if (err) throw err;
      console.log("Connected to DB!");
    }
  );
};
