// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// ── Vérifier le token JWT ──
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès refusé. Veuillez vous connecter.' 
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const result = await pool.query(
      'SELECT id, name, email, role, subscription_status, subscription_end FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    req.user = result.rows[0];
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
  }
};

// ── Vérifier si abonnement actif ──
const requireSubscription = (req, res, next) => {
  if (req.user.role === 'admin') return next(); // admin toujours accès

  if (req.user.subscription_status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Abonnement inactif. Veuillez effectuer votre paiement de 10 000 FCFA.',
      code: 'SUBSCRIPTION_REQUIRED'
    });
  }

  // Vérifier si abonnement expiré
  if (req.user.subscription_end && new Date(req.user.subscription_end) < new Date()) {
    return res.status(403).json({
      success: false,
      message: 'Abonnement expiré. Veuillez renouveler votre abonnement.',
      code: 'SUBSCRIPTION_EXPIRED'
    });
  }

  next();
};

// ── Vérifier rôle admin ──
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès réservé aux administrateurs.' 
    });
  }
  next();
};

module.exports = { protect, requireSubscription, requireAdmin };
