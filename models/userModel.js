const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String },
  name: { type: String, default: null },
  password: { type: String, default: null },
  role: { type: String, default: 'user' },
  blocked: { type: Boolean, default: false },
  index: { type: Object, default: {
    'char2': 0,
    'char3': 0,
    'char4': 0,
    'char5': 0,
    'char6': 0,
    'digit2': 0,
    'digit3': 0,
    'digit4': 0,
    'digit5': 0,
    'digit6': 0,
    'mixed2': 0,
    'mixed3': 0,
    'mixed4': 0,
    'mixed5': 0,
    'mixed6': 0
  }}
});


// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);