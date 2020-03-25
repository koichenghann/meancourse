const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username    : { type: String, required: true, unique: true },
  password    : { type: String, required: true },
  fullName    : { type: String, required: true },
  totalPoints : { type: Number, required: true },
  ecoLevel    : { type: String },
  address     : { type: String },
  schedule    : { type: mongoose.Schema.Types.ObjectId, ref: "Schedule" },
  userType    : { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
