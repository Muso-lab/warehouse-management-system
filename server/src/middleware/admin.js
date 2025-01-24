function admin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Accesso negato - Richiesti privilegi di amministratore' });
    }
}

module.exports = admin;
