const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSessionSchema = new Schema({
  userId: {
    type: String,
    dafault: ""
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const UserSession = mongoose.model("userSession", userSessionSchema);
module.exports = UserSession;
