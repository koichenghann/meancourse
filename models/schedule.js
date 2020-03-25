const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const scheduleSchema = mongoose.Schema({
  userId      : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  day         : { type: String},
  startTime   : { type: String},
  endTime     : { type: String}
});

module.exports = mongoose.model('Schedule', scheduleSchema);
