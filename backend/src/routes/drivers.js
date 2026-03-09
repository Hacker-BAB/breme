// src/routes/drivers.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { protect, requireSubscription } = require('../middleware/auth');

const router = express.Router();
router.use(protect, requireSubscription);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, t.matricule as truck_matricule
       FROM drivers d LEFT JOIN trucks t ON t.driver_id = d.id
       WHERE d.user_id = $1 ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, drivers: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

router.post('/', async (req, res) => {
  try {
    const { nom, telephone, email, numero_permis, types_permis, date_naissance, date_embauche, notes } = req.body;
    if (!nom) return res.status(400).json({ success: false, message: 'Nom requis.' });
    const result = await pool.query(
      `INSERT INTO drivers (id,user_id,nom,telephone,email,numero_permis,types_permis,date_naissance,date_embauche,notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [uuidv4(), req.user.id, nom, telephone, email, numero_permis, types_permis, date_naissance, date_embauche, notes]
    );
    res.status(201).json({ success: true, driver: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { nom, telephone, email, numero_permis, types_permis, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE drivers SET nom=$1,telephone=$2,email=$3,numero_permis=$4,types_permis=$5,status=$6,notes=$7,updated_at=NOW()
       WHERE id=$8 AND user_id=$9 RETURNING *`,
      [nom, telephone, email, numero_permis, types_permis, status, notes, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Chauffeur non trouvé.' });
    res.json({ success: true, driver: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM drivers WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Chauffeur supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: 'Erreur serveur.' }); }
});

module.exports = router;
