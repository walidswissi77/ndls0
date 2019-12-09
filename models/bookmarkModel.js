const mongoose = require("mongoose");

const bookmarkScheme = mongoose.Schema({
  username: { type: String },
  name: { type: String },
  available: { type: Boolean },
  combinationType: { type: String },
  expirationDate: { type: Date }
});

module.exports = mongoose.model("Bookmark", bookmarkScheme);
