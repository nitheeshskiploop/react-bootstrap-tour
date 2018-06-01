const mongoose = require('mongoose');

// login schema
loginSchema = mongoose.Schema({
  email: String,
  password: String
})

module.exports = mongoose.model("loginDetails", loginSchema);