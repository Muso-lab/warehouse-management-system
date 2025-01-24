const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Operator = mongoose.model('Operator', operatorSchema);

module.exports = Operator;
