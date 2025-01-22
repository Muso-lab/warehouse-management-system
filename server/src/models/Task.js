const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true,
    enum: ['CARICO', 'SCARICO', 'LOGISTICA']
  },
  vehicleData: String,
  clients: [{
    type: String,
    required: true
  }],
  priority: {
    type: String,
    required: true,
    enum: ['EMERGENZA', 'AXA', 'AGGIORNAMENTO', 'ORDINARIO']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  date: {
    type: String,
    required: true
  },
  startTime: String,
  endTime: String,
  officeNotes: String,
  warehouseNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
