const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);

