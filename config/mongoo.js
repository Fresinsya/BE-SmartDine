const { config } = require("dotenv");
config();
const mongoose = require("mongoose");

const mongo = mongoose.connect(process.env.MONGO_URL);

module.exports = mongo;