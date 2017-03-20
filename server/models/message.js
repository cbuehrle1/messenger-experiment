var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
  content: Array,
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now}
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
