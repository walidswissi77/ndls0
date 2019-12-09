const mongoose = require("mongoose");

const progressSchema = mongoose.Schema({
  available: { type: Boolean , default: null},
  data: {type: Object, default: {}}
});

module.exports = mongoose.model("Progress", progressSchema);
