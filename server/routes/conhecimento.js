const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query("SELECT * FROM base_conhecimento ORDER BY updated_at DESC"));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { tipo, titulo, conteudo } = req.body;
  try {
    const result = await query(
      "INSERT INTO base_conhecimento (tipo, titulo, conteudo) VALUES (?, ?, ?)",
      [tipo, titulo, conteudo]
    );
    res.status(201).json({ id_conhecimento: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.put("/:id", async (req, res) => {
  const { tipo, titulo, conteudo } = req.body;
  try {
    await query(
      "UPDATE base_conhecimento SET tipo = ?, titulo = ?, conteudo = ?, updated_at = NOW() WHERE id_conhecimento = ?",
      [tipo, titulo, conteudo, req.params.id]
    );
    res.json({ mensagem: "Conhecimento atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    await query("DELETE FROM base_conhecimento WHERE id_conhecimento = ?", [req.params.id]);
    res.json({ mensagem: "Registro removido" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;