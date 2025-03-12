const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  age: { type: Number, required: true, min: 0, max: 120 },
  dob: { type: Date, required: true },
  password: { type: String, required: true, minlength: 10 },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  about: { type: String, maxlength: 5000 },
});

module.exports = mongoose.model("User", UserSchema);
