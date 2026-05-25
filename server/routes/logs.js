const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT l.*, u.nome AS nome_usuario
      FROM log_auditoria l
      LEFT JOIN usuario u ON u.id_usuario = l.id_usuario
      ORDER BY l.created_at DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario } = req.body;
  try {
    const result = await query(
      "INSERT INTO log_auditoria (tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario) VALUES (?, ?, ?, ?, ?, ?)",
      [tipo_evento, id_referencia, score_confianca, motivo, contexto, id_usuario]
    );
    res.status(201).json({ id_log: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;