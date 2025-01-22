const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Dovrai installare jsonwebtoken: npm install jsonwebtoken

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Trova l'utente
    const user = await User.findOne({ username });

    // Verifica che l'utente esista e la password sia corretta
    if (!user || user.password !== password) { // In produzione, usa bcrypt per confrontare le password
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    // Verifica che l'utente sia attivo
    if (!user.active) {
      return res.status(403).json({ message: 'Account disattivato' });
    }

    // Genera il token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'your-secret-key', // In produzione, usa una chiave segreta in env
      { expiresIn: '24h' }
    );

    // Rimuovi la password prima di inviare i dati dell'utente
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore del server' });
  }
});

module.exports = router;
