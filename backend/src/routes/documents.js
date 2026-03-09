// src/routes/documents.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { protect, requireSubscription } = require('../middleware/auth');

const router = express.Router();
router.use(protect, requireSubscription);

// GET /api/documents — Tous les documents avec statut d'expiration
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, t.matricule
       FROM documents d
       JOIN trucks t ON d.truck_id = t.id
       WHERE d.user_id = $1
       ORDER BY d.date_expiration ASC`,
      [req.user.id]
    );

    // Calculer le statut de chaque document
    const today = new Date();
    const docs = result.rows.map(doc => {
      const expDate = new Date(doc.date_expiration);
      const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      let status = 'valid';
      if (daysLeft < 0) status = 'expired';
      else if (daysLeft <= 30) status = 'expiring_soon';
      return { ...doc, days_left: daysLeft, status };
    });

    // Séparer les alertes
    const alerts = docs.filter(d => d.status !== 'valid');

    res.json({ success: true, documents: docs, alerts_count: alerts.length });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

// POST /api/documents
router.post('/', async (req, res) => {
  try {
    const { truck_id, type, numero, date_emission, date_expiration } = req.body;
    if (!truck_id || !type || !date_expiration) {
      return res.status(400).json({ success: false, message: 'truck_id, type et date_expiration requis.' });
    }
    const result = await pool.query(
      `INSERT INTO documents (id,truck_id,user_id,type,numero,date_emission,date_expiration)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [uuidv4(), truck_id, req.user.id, type, numero, date_emission, date_expiration]
    );
    res.status(201).json({ success: true, document: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { type, numero, date_emission, date_expiration } = req.body;
    const result = await pool.query(
      `UPDATE documents SET type=$1,numero=$2,date_emission=$3,date_expiration=$4,updated_at=NOW()
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [type, numero, date_emission, date_expiration, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Document non trouvé.' });
    res.json({ success: true, document: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM documents WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Document supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

module.exports = router;
