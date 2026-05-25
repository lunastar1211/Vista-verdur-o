const router = require("express").Router();
const { query } = require("../db");

router.get("/", async (_req, res) => {
  try {
    res.json(await query(
      "SELECT id_usuario, nome, email, tipo, provider, ativo, created_at FROM usuario"
    ));
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id_usuario, nome, email, tipo, provider, ativo, created_at FROM usuario WHERE id_usuario = ?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(rows[0]);
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.post("/", async (req, res) => {
  const { nome, email, senha_hash, tipo, provider, ativo } = req.body;
  try {
    const result = await query(
      "INSERT INTO usuario (nome, email, senha_hash, tipo, provider, ativo) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, senha_hash, tipo, provider, ativo ?? 1]
    );
    res.status(201).json({ id_usuario: result.insertId });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

router.put("/:id", async (req, res) => {
  const { nome, email, tipo, ativo } = req.body;
  try {
    await query(
      "UPDATE usuario SET nome = ?, email = ?, tipo = ?, ativo = ? WHERE id_usuario = ?",
      [nome, email, tipo, ativo, req.params.id]
    );
    res.json({ mensagem: "Usuário atualizado" });
  } catch (err) { res.status(500).json({ erro: err.message }); }
});

module.exports = router;