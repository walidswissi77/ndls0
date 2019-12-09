const mongoose = require("mongoose");

const domainSchema = mongoose.Schema({
  name: { type: String },
  available: { type: Boolean, default: null },
  combinationType: { type: String},
  expirationDate: { type: Date, default: null},
  checkDate: {type: Date, default: Date.now()}
});
module.exports = mongoose.model("Domain", domainSchema);
