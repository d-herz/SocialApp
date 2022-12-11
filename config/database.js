const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
require("dotenv").config({ path: "./config/.env" });

const clientP = mongoose.connect(
  `${process.env.DB_STRING}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
  .then(m => m.connection.getClient())
  .then(() => {
    console.log('Connected to DB YESSSS')
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  });

module.exports = clientP;
