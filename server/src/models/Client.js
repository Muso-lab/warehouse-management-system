const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true  // Utilizziamo solo questo metodo per l'indice
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Rimuoviamo questa riga che causava il warning del doppio indice
// clientSchema.index({ name: 1 });

module.exports = mongoose.model('Client', clientSchema);
