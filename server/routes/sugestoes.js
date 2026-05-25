const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT s.*, u.nome AS nome_usuario
      FROM sugestao_promo s
      LEFT JOIN usuario u ON u.id_usuario = s.id_usuario
      ORDER BY s.data_geracao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const {
    desconto_sugerido, justificativa, score_confianca, status_decisao,
    data_geracao, data_decisao, id_alerta, id_usuario,
  } = req.body;
  try {
    const result = await query(
      `INSERT INTO sugestao_promo
        (desconto_sugerido, justificativa, score_confianca, status_decisao,
         data_geracao, data_decisao, id_alerta, id_usuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [desconto_sugerido, justificativa, score_confianca, status_decisao,
       data_geracao, data_decisao, id_alerta, id_usuario]
    );
    res.status(201).json({ id_sugestao: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.patch("/:id/decisao", async (req, res) => {
  const { status_decisao, id_usuario } = req.body;
  try {
    await query(
      "UPDATE sugestao_promo SET status_decisao = ?, id_usuario = ?, data_decisao = NOW() WHERE id_sugestao = ?",
      [status_decisao, id_usuario, req.params.id]
    );
    res.json({ mensagem: "Decisão registrada" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;