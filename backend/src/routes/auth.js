// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ── Générer un JWT ──
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// ============================================
// POST /api/auth/register — Inscription
// ============================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }

    // Vérifier si email existe déjà
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // 🔐 HACHAGE du mot de passe avec bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role, subscription_status)
       VALUES ($1, $2, $3, $4, 'user', 'inactive')
       RETURNING id, name, email, role, subscription_status`,
      [uuidv4(), name, email.toLowerCase(), hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès. Veuillez effectuer votre paiement pour activer l\'accès.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ============================================
// POST /api/auth/login — Connexion
// ============================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }

    // Trouver l'utilisateur
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const user = result.rows[0];

    // 🔐 Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status,
        subscription_end: user.subscription_end
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

// ============================================
// GET /api/auth/me — Profil utilisateur
// ============================================
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ============================================
// PUT /api/auth/change-password — Changer mot de passe
// ============================================
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Les deux mots de passe sont requis.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
    }

    // Récupérer le mot de passe actuel
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    const isValid = await bcrypt.compare(currentPassword, result.rows[0].password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedNew = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [hashedNew, req.user.id]);

    res.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });

  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

module.exports = router;
