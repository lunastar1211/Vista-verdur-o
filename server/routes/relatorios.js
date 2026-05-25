const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(`
      SELECT r.id_relatorio, r.data_geracao, r.id_usuario, u.nome AS nome_usuario
      FROM relatorio_ia r
      JOIN usuario u ON u.id_usuario = r.id_usuario
      ORDER BY r.data_geracao DESC
    `));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM relatorio_ia WHERE id_relatorio = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Relatório não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { id_usuario, conteudo, data_geracao } = req.body;
  try {
    const result = await query(
      "INSERT INTO relatorio_ia (id_usuario, conteudo, data_geracao) VALUES (?, ?, ?)",
      [id_usuario, conteudo, data_geracao]
    );
    res.status(201).json({ id_relatorio: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;