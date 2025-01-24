const express = require('express');
const router = express.Router();
const Operator = require('../models/Operator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all operators
router.get('/', auth, async (req, res) => {
  try {
    const operators = await Operator.find().sort({ name: 1 });
    res.json(operators);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli operatori' });
  }
});

// Create operator
router.post('/', [auth, admin], async (req, res) => {
  try {
    // Verifica se esiste già un operatore con lo stesso nome
    const existingOperator = await Operator.findOne({ name: req.body.name });
    if (existingOperator) {
      return res.status(400).json({ message: 'Esiste già un operatore con questo nome' });
    }

    const operator = new Operator({
      name: req.body.name,
      active: req.body.active
    });

    const savedOperator = await operator.save();
    res.status(201).json(savedOperator);
  } catch (error) {
    res.status(400).json({ message: 'Errore nella creazione dell\'operatore' });
  }
});

// Update operator
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    // Verifica se il nuovo nome è già utilizzato da un altro operatore
    if (req.body.name) {
      const existingOperator = await Operator.findOne({
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      if (existingOperator) {
        return res.status(400).json({ message: 'Esiste già un operatore con questo nome' });
      }
    }

    const operator = await Operator.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        active: req.body.active
      },
      { new: true }
    );

    if (!operator) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }

    res.json(operator);
  } catch (error) {
    res.status(400).json({ message: 'Errore nell\'aggiornamento dell\'operatore' });
  }
});

// Delete operator
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      return res.status(404).json({ message: 'Operatore non trovato' });
    }

    await operator.remove();
    res.json({ message: 'Operatore eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminazione dell\'operatore' });
  }
});

module.exports = router;
