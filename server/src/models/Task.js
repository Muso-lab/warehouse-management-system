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
    enum: ['EMERGENZA', 'AXA', 'AGGIORNAMENTO', 'ORDINARIO']  // Aggiunto 'AXA' qui
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
  warehouseNotes: String
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
